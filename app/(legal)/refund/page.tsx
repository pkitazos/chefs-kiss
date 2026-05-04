import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Chef's Kiss Festival",
  description:
    "How cancellations and refunds work for workshop and private dining bookings made through the Chef's Kiss website.",
};

export default function RefundPolicyPage() {
  return (
    <LegalDoc title="Refund & Cancellation Policy" lastUpdated="04.05.2026">
      <p>
        This policy explains how cancellations and refunds work for bookings
        made through the Chef&apos;s Kiss website (chefskiss.com.cy). It applies
        to all workshop and private dining bookings.
      </p>
      <p>
        The Site is operated by <strong>DMC Nexus Hospitality Ltd</strong>,
        registered at 111, Nissi Avenue, Ayia Napa, 5330, Cyprus.
      </p>
      <p>
        If you have any questions about this policy or need to make a request,
        please email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>.
      </p>

      <h2>Booking reference number</h2>
      <p>
        Every booking is assigned a unique booking reference number, which is
        included in your booking confirmation email. Please keep this reference
        safe &mdash; you will need to provide it for any cancellation, change,
        or refund request.
      </p>

      <h2>Workshops</h2>
      <h3>One person per booking</h3>
      <p>
        Each workshop booking is for one person. If you wish to attend a
        workshop with friends or family, each person must make their own booking
        using their own name and email address.
      </p>

      <h3>Cancellations</h3>
      <p>
        You may cancel your workshop booking at any time before the workshop
        starts.
      </p>
      <p>
        <strong>
          Refunds for cancelled workshop bookings are issued in cash at the
          festival.
        </strong>{" "}
        To collect your refund, present your booking reference number to the
        workshop manager during the festival.
      </p>

      <h3>If you cannot attend the festival in person</h3>
      <p>
        If you need to cancel and are unable to come to the festival to collect
        a cash refund, please email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>{" "}
        <strong>at least two (2) days before the workshop</strong>, including
        your booking reference number. In this case, we will process your refund
        electronically through our payment provider, Payabl.one, back to the
        original payment card.
      </p>

      <h3>No-shows</h3>
      <p>
        If you do not attend the workshop and have not cancelled in advance, no
        refund will be issued.
      </p>

      <h3>Workshops cancelled by us</h3>
      <p>
        If we need to cancel a workshop (for example, due to insufficient
        bookings, the unavailability of a chef, or circumstances beyond our
        control), we will contact you by email and issue a full refund
        electronically through Payabl.one to the original payment card.
      </p>

      <h2>Private dining</h2>
      <h3>Booking sizes</h3>
      <p>
        Private dining bookings are accepted for 2, 4, or 6 guests only. The
        number of guests must be selected at the time of booking.
      </p>

      <h3>Cancellations and changes</h3>
      <p>
        You may cancel your private dining booking, or change the number of
        guests, by emailing{" "}
        <span className="text-primary">info@chefskiss.com.cy</span> with your
        booking reference number,{" "}
        <strong>at least 48 hours before the booking</strong>.
      </p>
      <p>For changes made at least 48 hours in advance:</p>
      <ul>
        <li>
          <strong>Reducing the number of guests:</strong> the difference will be
          refunded electronically through Payabl.one to the original payment
          card.
        </li>
        <li>
          <strong>Increasing the number of guests:</strong> we will contact you
          to arrange payment for the additional guests.
        </li>
      </ul>
      <p>For cancellations made at least 48 hours in advance:</p>
      <ul>
        <li>
          The full booking amount will be refunded electronically through
          Payabl.one to the original payment card.
        </li>
      </ul>

      <h3>Less than 48 hours before the booking</h3>
      <p>
        If you cancel, or reduce the number of guests, less than 48 hours before
        your private dining booking, we are unable to issue a refund for the
        cancelled portion.
      </p>

      <h3>No-shows</h3>
      <p>
        If you do not attend your private dining booking and have not contacted
        us in advance, no refund will be issued.
      </p>

      <h3>Private dining cancelled by us</h3>
      <p>
        If we need to cancel your private dining booking, we will contact you by
        email and issue a full refund electronically through Payabl.one to the
        original payment card.
      </p>

      <h2>Festival cancellation</h2>
      <p>
        If the festival as a whole is cancelled or postponed for any reason, we
        will contact all customers with active bookings and issue full refunds
        electronically through Payabl.one to the original payment card.
      </p>

      <h2>Refund timing</h2>
      <p>
        Electronic refunds processed through Payabl.one will be issued within
        ten (10) working days of confirming your refund request. Once issued,
        the refund may take additional time to appear on your bank statement,
        depending on your card issuer.
      </p>
      <p>
        Cash refunds for workshops are issued at the time you present your
        booking reference at the festival.
      </p>

      <h2>Special circumstances</h2>
      <p>
        We understand that occasionally circumstances arise that are not covered
        by the rules above. In such cases, refunds will be handled on a
        case-by-case basis. Please email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span> with your
        booking reference number and we will do our best to help.
      </p>

      <h2>How to contact us</h2>
      <p>
        For all cancellation, change, and refund requests, please email us at{" "}
        <strong className="text-primary">info@chefskiss.com.cy</strong> with
        your booking reference number.
      </p>
      <p>For questions about this policy, the same email address applies.</p>
    </LegalDoc>
  );
}
