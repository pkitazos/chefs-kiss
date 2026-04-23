/**
 * The fields we send to POST /pay/payment/init.
 *
 * We pass strings throughout because that's what the wire format is
 * form-encoded values are always strings. Keeping it as strings here
 * makes signing work without conversion gymnastics.
 */
export interface InitRequestParams {
  amount: string;
  currency: string;
  orderid: string;
  firstname: string;
  lastname: string;
  email: string;
  notification_url: string;
  url_return: string;
  customerip?: string;
}

/**
 * The fields payabl returns from a successful init.
 */
export interface InitSuccessResponse {
  ok: true;
  transactionid: string;
  sessionid: string;
  start_url: string;
}

export interface InitErrorResponse {
  ok: false;
  errorcode: string;
  errormessage: string;
}

export type InitResponse = InitSuccessResponse | InitErrorResponse;
