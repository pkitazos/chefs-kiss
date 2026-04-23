import { env } from "@/lib/env/server";
import { signRequest } from "./signature";
import type { InitRequestParams, InitResponse } from "./types";

/**
 * POSTs an init request to payabl (or the local sim) and returns a
 * parsed, discriminated response.
 *
 * Does not throw for payabl-level errors — those come back as
 * { ok: false, errorcode, errormessage }. It only throws on network
 * failures or unparseable responses, which are genuine exceptional
 * conditions (not "the transaction was declined").
 */
export async function initPayablTransaction(
  params: InitRequestParams,
): Promise<InitResponse> {
  // Build the full param set including merchantid from env. Keep it as
  // a Record<string, string> so signing doesn't have to think about
  // undefined values.
  const signedParams: Record<string, string> = {
    merchantid: env.PAYABL_MERCHANT_ID,
    amount: params.amount,
    currency: params.currency,
    orderid: params.orderid,
    firstname: params.firstname,
    lastname: params.lastname,
    email: params.email,
    notification_url: params.notification_url,
    url_return: params.url_return,
  };

  if (params.customerip) {
    signedParams.customerip = params.customerip;
  }

  const signature = signRequest(signedParams, env.PAYABL_SECRET);

  const body = new URLSearchParams({ ...signedParams, signature });

  const url = `${env.PAYABL_BASE_URL}/pay/payment/init`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Payabl init returned HTTP ${response.status} ${response.statusText}`,
    );
  }

  const responseText = await response.text();
  const parsed = new URLSearchParams(responseText);

  const errorcode = parsed.get("errorcode");
  if (errorcode === null) {
    throw new Error(
      `Payabl init response missing errorcode. Body: ${responseText}`,
    );
  }

  if (errorcode !== "0") {
    return {
      ok: false,
      errorcode,
      errormessage: parsed.get("errormessage") ?? "",
    };
  }

  const transactionid = parsed.get("transactionid");
  const sessionid = parsed.get("sessionid");
  const start_url = parsed.get("start_url");

  if (!transactionid || !sessionid || !start_url) {
    throw new Error(
      `Payabl init succeeded but response is missing required fields. Body: ${responseText}`,
    );
  }

  return { ok: true, transactionid, sessionid, start_url };
}
