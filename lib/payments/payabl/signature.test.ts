import { describe, it, expect } from "vitest";
import {
  signRequest,
  computeNotificationSignature,
  verifyNotification,
} from "./signature";

describe("signRequest", () => {
  it("matches the worked example from payabl docs", () => {
    // From https://docs.payabl.com/docs/signature-calculation
    // Expected SHA-1 hex of concatenated values + "VeryGoodSecret"
    const params = {
      merchantid: "gateway_test",
      amount: "1.23",
      currency: "EUR",
      orderid: "1234-123456789-4321",
      language: "de",
      gender: "",
      lastname: "Mustermann",
      street: "Hanauer Landstrasse",
      zip: "60322",
      city: "Frankfurt",
      country: "DEU",
      firstname: "Max",
      company: "Powerpay21",
      email: "tech.support@powerpay21.com",
      customerip: "127.1.1.1",
      payment_method: "1",
      ccn: "4242424242424242",
      cvc_code: "123",
      cardholder_name: "Max Mustermann",
      exp_month: "01",
      exp_year: "2015",
    };

    expect(signRequest(params, "VeryGoodSecret")).toBe(
      "00f05286b075aecf621b5c3db67eb5d4f612e855",
    );
  });

  it("excludes the signature field if present", () => {
    const withSig = { a: "1", b: "2", signature: "garbage" };
    const without = { a: "1", b: "2" };
    expect(signRequest(withSig, "s")).toBe(signRequest(without, "s"));
  });

  it("is order-independent (sorts by key)", () => {
    const a = { foo: "1", bar: "2", baz: "3" };
    const b = { baz: "3", foo: "1", bar: "2" };
    expect(signRequest(a, "s")).toBe(signRequest(b, "s"));
  });

  it("produces lowercase hex", () => {
    const result = signRequest({ a: "1" }, "s");
    expect(result).toMatch(/^[a-f0-9]{40}$/);
  });
});

describe("computeNotificationSignature", () => {
  it("matches the worked example from payabl docs", () => {
    // From https://docs.payabl.com/docs/signature-calculation
    // sha256("118656640capture01610018172goodsecret")
    const params = {
      transactionid: "118656640",
      type: "capture",
      errorcode: "0",
      timestamp: "1610018172",
    };

    expect(computeNotificationSignature(params, "goodsecret")).toBe(
      "1f67d79aa5e2a4070b2091837fefae84cd15f08370de0cee4bf9ea75951e047b",
    );
  });

  it("produces lowercase hex", () => {
    const result = computeNotificationSignature(
      { transactionid: "1", type: "capture", errorcode: "0", timestamp: "1" },
      "s",
    );
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("verifyNotification", () => {
  const validParams = {
    transactionid: "118656640",
    type: "capture",
    errorcode: "0",
    timestamp: "1610018172",
    security:
      "1f67d79aa5e2a4070b2091837fefae84cd15f08370de0cee4bf9ea75951e047b",
  };

  it("returns true for a valid signature", () => {
    expect(verifyNotification(validParams, "goodsecret")).toBe(true);
  });

  it("returns false for a tampered errorcode", () => {
    expect(
      verifyNotification({ ...validParams, errorcode: "1" }, "goodsecret"),
    ).toBe(false);
  });

  it("returns false with the wrong secret", () => {
    expect(verifyNotification(validParams, "badsecret")).toBe(false);
  });

  it("returns false for a malformed security field", () => {
    expect(
      verifyNotification({ ...validParams, security: "short" }, "goodsecret"),
    ).toBe(false);
  });
});
