import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your use of the Chef's Kiss website and any workshop bookings or applications made through it.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalDoc title="Terms & Conditions" lastUpdated="04.05.2026">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the
        Chef&apos;s Kiss website (chefskiss.com.cy, &quot;the Site&quot;) and
        any workshop bookings or applications made through it.
      </p>
      <p>
        The Site is operated by <strong>DMC Nexus Hospitality Ltd</strong>, a
        company registered in Cyprus at 111, Nissi Avenue, Ayia Napa, 5330
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
      </p>
      <p>
        By using the Site or making a booking or application, you agree to these
        Terms. If you do not agree, please do not use the Site.
      </p>

      <h2>1. Who can use the Site</h2>
      <p>
        You must be at least 18 years old to make a booking or submit an
        application through the Site. By booking or applying, you confirm that
        you are 18 or older.
      </p>
      <p>
        Browsing the Site (viewing event information, schedules, vendors, and
        maps) is open to all visitors and does not require an account.
      </p>

      <h2>2. What the Site offers</h2>
      <p>The Site provides:</p>
      <ul>
        <li>Information about the Chef&apos;s Kiss festival and its events</li>
        <li>Online booking of workshops held as part of the festival</li>
        <li>
          An application form for businesses wishing to participate as vendors
          or workshop hosts
        </li>
      </ul>
      <p>We may add, change, or remove features of the Site at any time.</p>

      <h2>3. Workshop bookings</h2>
      <h3>Making a booking</h3>
      <p>
        When you book a workshop, you enter into a contract with us for
        attendance at that workshop. A booking is confirmed only when:
      </p>
      <ul>
        <li>
          Payment has been successfully processed by our payment provider,
          Payabl.one, and
        </li>
        <li>You have received a booking confirmation email.</li>
      </ul>
      <p>
        If payment fails or a confirmation email is not received, the booking is
        not considered made. If you believe you have paid but not received a
        confirmation, please contact us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>.
      </p>

      <h3>Workshop details and capacity</h3>
      <p>
        Each workshop has a limited number of places, a scheduled date and time,
        and a specific location within the festival. Workshops may have
        additional conditions that apply to all attendees in the booking,
        including:
      </p>
      <ul>
        <li>
          A minimum age requirement (for example, workshops involving alcohol
          are restricted to attendees aged 18 and over).
        </li>
        <li>Specific arrival times, dress code, or equipment requirements.</li>
      </ul>
      <p>
        These conditions are shown on the workshop&apos;s page at the time of
        booking. By making a booking, you confirm that you and all attendees in
        your party meet the stated conditions. We reserve the right to refuse
        entry to any attendee who does not meet a workshop&apos;s stated
        conditions, and no refund will be provided in that case.
      </p>

      <h3>Changes and cancellations by us</h3>
      <p>
        Occasionally, we may need to change or cancel a workshop, for example if
        a chef becomes unavailable, if too few people have booked, or for
        reasons beyond our control (such as weather or public health
        restrictions). If this happens, we will contact you by email and offer
        either a refund or a transfer to another workshop where possible.
      </p>

      <h3>Changes and cancellations by you</h3>
      <p>
        Our cancellation and refund policy is set out in our{" "}
        <Link href="/refund">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>4. Vendor and workshop host applications</h2>
      <p>
        Submitting a vendor or workshop host application does not guarantee
        participation in the festival. Applications are reviewed by our team,
        and we may accept or decline any application at our discretion.
      </p>
      <p>By submitting an application, you confirm that:</p>
      <ul>
        <li>
          The information and documents you provide (including business name,
          contact details, Instagram handle, and business licence) are accurate
          and belong to you or the business you represent.
        </li>
        <li>
          You are authorised to submit the application on behalf of the
          business.
        </li>
      </ul>
      <p>
        We may contact you for further information during the review process.
      </p>

      <h2>5. Photography and video at the event</h2>
      <p>
        Photos and video may be taken at the festival and at workshops for
        promotional use by Chef&apos;s Kiss, including on our website and social
        media channels. By attending, you acknowledge that you and members of
        your party may appear in such images.
      </p>
      <p>
        If you do not wish to appear in promotional material, please email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span> before the
        event so we can take reasonable steps to accommodate your request. You
        may also notify a member of our staff at the event.
      </p>

      <h2>6. Acceptable use of the Site</h2>
      <p>When using the Site, you agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose</li>
        <li>
          Submit false, misleading, or fraudulent information in a booking or
          application
        </li>
        <li>
          Attempt to gain unauthorised access to any part of the Site or its
          underlying systems
        </li>
        <li>
          Interfere with the Site&apos;s normal operation (e.g., through
          automated scraping, denial-of-service attempts, or injecting malicious
          code)
        </li>
        <li>
          Upload content that you do not have the right to share, or that is
          illegal, defamatory, or infringes the rights of others
        </li>
      </ul>
      <p>
        We may suspend or terminate your access to the Site if we reasonably
        believe you have breached these Terms.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The Site, including its design, text, images, logos, and branding, is
        owned by or licensed to DMC Nexus Hospitality Ltd. You may not copy,
        reproduce, or redistribute any part of the Site without our written
        permission, except for personal non-commercial use (for example, sharing
        a workshop&apos;s page with a friend).
      </p>
      <p>
        Content you submit through applications (such as business descriptions
        and uploaded images) remains your property. By submitting it, you grant
        us a licence to use it for the purposes of operating the Site and
        promoting the festival.
      </p>

      <h2>8. Third-party services and links</h2>
      <p>
        The Site uses third-party services to operate, including payment
        processing (Payabl.one), email (Resend), hosting (Vercel, Neon), file
        uploads (UploadThing), and administrator sign-in (Google). These
        services have their own terms and privacy policies, which apply when you
        interact with them.
      </p>
      <p>
        The Site may also link to third-party websites (for example,
        vendors&apos; social media pages). We are not responsible for the
        content, policies, or practices of third-party sites.
      </p>

      <h2>9. Liability</h2>
      <p>
        We take reasonable care in operating the Site and running the festival,
        but to the extent permitted by law:
      </p>
      <ul>
        <li>
          We are not liable for any indirect, incidental, or consequential
          losses arising from your use of the Site or attendance at a workshop.
        </li>
        <li>
          We are not liable for losses caused by circumstances outside our
          reasonable control (force majeure), including but not limited to
          severe weather, natural disasters, public health emergencies, or acts
          of government.
        </li>
        <li>
          Our total liability to you in connection with any booking is limited
          to the amount you paid for that booking.
        </li>
      </ul>
      <p>
        Nothing in these Terms limits or excludes liability that cannot be
        limited or excluded under applicable law (for example, liability for
        death or personal injury caused by our negligence, or for fraud).
      </p>
      <p>
        Attendance at the festival and at workshops is at your own risk. You are
        responsible for your own conduct, safety, and belongings at the event.
      </p>

      <h2>10. Data protection</h2>
      <p>
        We process personal data in accordance with our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The updated Terms will be
        posted on this page with a new &quot;Last updated&quot; date. Material
        changes affecting existing bookings or applications will be notified to
        you by email where we have your contact details. Continued use of the
        Site after an update means you accept the updated Terms.
      </p>

      <h2>12. Governing law and jurisdiction</h2>
      <p>
        These Terms and any disputes arising from them are governed by the laws
        of the Republic of Cyprus. Any disputes will be subject to the exclusive
        jurisdiction of the courts of Cyprus.
      </p>

      <h2>13. Contact us</h2>
      <p>
        For questions about these Terms, please email{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>.
      </p>
    </LegalDoc>
  );
}
