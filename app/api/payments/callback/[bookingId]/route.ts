import { NextRequest } from "next/server";
import { env } from "@/lib/env/server";
import { verifyNotification } from "@/lib/payments/payabl";

/**
 * Fields we read from the notification body. We only
 * validate the fields we actually use. Extra fields in the body are
 * fine and ignored.
 */
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

  const rawBody = await request.text();
  const notification = parseNotification(rawBody);

  if (!notification) {
    console.warn(`[callback] ${bookingId} malformed body: ${rawBody}`);
    return new Response("Bad Request", { status: 400 });
  }

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

  // TODO: look up the booking, update status, fire emails.
  // That's the next section.

  console.log(
    `[callback] ${bookingId} verified ok. errorcode=${notification.errorcode} type=${notification.type}`,
  );
  return new Response("OK", { status: 200 });
}
