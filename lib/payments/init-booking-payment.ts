import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import type { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";

import { buildNotificationUrl, initPayablTransaction } from "./payabl";

type InitBookingPaymentArgs = {
  database: typeof db;
  booking: {
    id: string;
    fullName: string;
    email: string;
    totalAmount: number;
  };
  urlReturn: string;
  /**
   * On payabl error or network failure, also flip the booking to `failed`
   * (with error code/message) before throwing.
   *
   * `bookings.create` sets this so a one-shot booking that can't be paid
   * shows up as failed on the status page.
   * `waitlist.initPayment` leaves it false — the customer can retry from
   * the same claim link, and a `failed` row would make the link permanently dead.
   */
  markFailedOnError: boolean;
  logTag: string;
};

export async function initBookingPayment({
  database,
  booking,
  urlReturn,
  markFailedOnError,
  logTag,
}: InitBookingPaymentArgs): Promise<{ paymentUrl: string }> {
  const [firstName, ...restName] = booking.fullName.trim().split(/\s+/);
  const lastName = restName.join(" ") || firstName;

  try {
    console.log(`[${logTag}] ${booking.id} initiating payabl`, {
      amount: (booking.totalAmount / 100).toFixed(2),
      notification_url: buildNotificationUrl(booking.id),
      url_return: urlReturn,
    });

    const initResult = await initPayablTransaction({
      amount: (booking.totalAmount / 100).toFixed(2),
      currency: "EUR",
      orderid: booking.id,
      firstname: firstName,
      lastname: lastName,
      email: booking.email,
      notification_url: buildNotificationUrl(booking.id),
      url_return: urlReturn,
    });

    if (!initResult.ok) {
      console.warn(
        `[${logTag}] payabl init failed for ${booking.id}: ${initResult.errorcode} ${initResult.errormessage}`,
      );

      if (markFailedOnError) {
        await database
          .update(bookings)
          .set({
            status: "failed",
            payablErrorCode: initResult.errorcode,
            payablErrorMessage: initResult.errormessage || null,
            updatedAt: new Date(),
          })
          .where(eq(bookings.id, booking.id));
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Could not initiate payment. Please try again or contact support.",
      });
    }

    console.log(
      `[${logTag}] ${booking.id} init ok, transactionid=${initResult.transactionid}`,
    );

    await database
      .update(bookings)
      .set({
        payablTransactionId: initResult.transactionid,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    return { paymentUrl: initResult.start_url };
  } catch (err) {
    if (err instanceof TRPCError) throw err;

    console.error(
      `[${logTag}] payabl init threw for ${booking.id}:`,
      err instanceof Error ? err.message : err,
    );

    if (markFailedOnError) {
      await database
        .update(bookings)
        .set({
          status: "failed",
          payablErrorMessage: "Payment provider unreachable",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, booking.id));
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Could not reach payment provider. Please try again in a moment.",
    });
  }
}
