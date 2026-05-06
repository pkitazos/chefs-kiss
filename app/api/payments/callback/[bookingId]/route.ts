import { waitUntil } from "@vercel/functions";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { env } from "@/lib/env/server";
import { sendBookingConfirmation } from "@/lib/email/booking-emails";
import { sendWaitlistPaymentConfirmation } from "@/lib/email/waitlist-emails";
import { debug } from "@/lib/debug";
import { verifyNotification } from "@/lib/payments/payabl";

interface NotificationFields {
  transactionid: string;
  type: string;
  errorcode: string;
  timestamp: string;
  security: string;
  orderid: string;
  errormessage: string;
}

function parseNotification(body: string): NotificationFields | null {
  const params = new URLSearchParams(body);

  const transactionid = params.get("transactionid");
  const type = params.get("type");
  const errorcode = params.get("errorcode");
  const timestamp = params.get("timestamp");
  const security = params.get("security");
  const orderid = params.get("orderid");

  if (
    !transactionid ||
    !type ||
    errorcode === null ||
    !timestamp ||
    !security ||
    !orderid
  ) {
    return null;
  }

  return {
    transactionid,
    type,
    errorcode,
    timestamp,
    security,
    orderid,
    errormessage: params.get("errormessage") ?? "",
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;

  console.log(
    `[callback] ${bookingId} received POST from ${request.headers.get("user-agent") ?? "unknown"}`,
  );

  const rawBody = await request.text();
  const notification = parseNotification(rawBody);

  if (!notification) {
    console.warn(`[callback] ${bookingId} malformed body: ${rawBody}`);
    return new Response("Bad Request", { status: 400 });
  }

  console.log(`[callback] ${bookingId} body:`, rawBody);

  const signatureValid = verifyNotification(
    {
      transactionid: notification.transactionid,
      type: notification.type,
      errorcode: notification.errorcode,
      timestamp: notification.timestamp,
      security: notification.security,
    },
    env.PAYABL_SECRET,
  );

  if (!signatureValid) {
    console.warn(`[callback] ${bookingId} signature mismatch; ignoring`);
    return new Response("Unauthorized", { status: 401 });
  }

  if (notification.orderid !== bookingId) {
    console.warn(
      `[callback] ${bookingId} orderid mismatch: body claims ${notification.orderid}`,
    );
    return new Response("Conflict", { status: 409 });
  }

  const isSuccess = notification.errorcode === "0";

  // Look up the booking. No transaction needed for the read
  // the UPDATE below is the atomic
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    console.warn(`[callback] ${bookingId} not found`);
    return new Response("Not Found", { status: 404 });
  }

  // ---------- State transition rules ----------
  //   pending + success     -> confirmed (+ email)
  //   pending + failure     -> failed
  //   expired + success     -> confirmed (+ email) — late payment after expiry
  //   anything else         -> no-op (log if unexpected, always 200)

  const actionableStatuses = ["pending", "expired"] as const;
  const isActionable =
    isSuccess && booking.status === "expired"
      ? true
      : booking.status === "pending";

  if (!isActionable) {
    const unexpected =
      (booking.status === "confirmed" && !isSuccess) ||
      (booking.status === "failed" && isSuccess);

    if (unexpected) {
      console.warn(
        `[callback] ${bookingId} unexpected state: status=${booking.status} ` +
          `errorcode=${notification.errorcode}; ignoring`,
      );
    } else {
      console.log(
        `[callback] ${bookingId} already in terminal state ${booking.status}; ignoring`,
      );
    }

    return new Response("OK", { status: 200 });
  }

  if (booking.status === "expired" && isSuccess) {
    console.warn(
      `[callback] ${bookingId} accepting late payment (was expired); promoting to confirmed`,
    );
  }

  const newStatus = isSuccess ? "confirmed" : "failed";
  const now = new Date();

  // Atomic UPDATE guarded on current status.
  // The WHERE clause is the idempotency barrier:
  // if two callbacks race, only the first one affects rows.
  const [updated] = await db
    .update(bookings)
    .set({
      status: newStatus,
      payablTransactionId: notification.transactionid,
      payablErrorCode: notification.errorcode,
      payablErrorMessage: notification.errormessage || null,
      paidAt: isSuccess ? now : null,
      updatedAt: now,
    })
    .where(
      and(
        eq(bookings.id, bookingId),
        inArray(bookings.status, actionableStatuses),
      ),
    )
    .returning();

  if (!updated) {
    // Another process updated the row between our SELECT and UPDATE.
    // Log and return 200; retries won't help.
    console.warn(`[callback] ${bookingId} raced with another update; ignoring`);
    return new Response("OK", { status: 200 });
  }

  console.log(
    `[callback] ${bookingId} -> ${newStatus} (errorcode=${notification.errorcode})`,
  );

  if (isSuccess) {
    const sendConfirmation =
      updated.waitlistEntryId === null
        ? sendBookingConfirmation
        : sendWaitlistPaymentConfirmation;

    // debug(
    //   "callback",
    //   `${bookingId} sending confirmation email to ${updated.email}`,
    // );
    waitUntil(
      sendConfirmation({
        email: updated.email,
        fullName: updated.fullName,
        bookingId: updated.id,
        type: updated.type,
        seats: updated.seats,
        slotId: updated.slotId,
      })
        .then((result) => {
          // debug("callback", `${bookingId} email result`, result);
          if (result.success) {
            return db
              .update(bookings)
              .set({ confirmationEmailSentAt: new Date() })
              .where(eq(bookings.id, bookingId));
          }
        })
        .catch((err) => {
          // debug(
          //   "callback",
          //   `${bookingId} email/db update error`,
          //   err instanceof Error ? err.message : err,
          // );
          console.error(
            `[callback] ${bookingId} email send failed:`,
            err instanceof Error ? err.message : err,
          );
        }),
    );
  }

  return new Response("OK", { status: 200 });
}
