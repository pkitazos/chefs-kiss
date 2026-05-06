import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How DMC Nexus Hospitality Ltd collects, uses, and protects your personal data when you use the Chef's Kiss website.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc title="Privacy Policy" lastUpdated="04.05.2026">
      <p>
        This Privacy Policy explains how DMC Nexus Hospitality Ltd
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and
        protects your personal data when you use the Chef&apos;s Kiss website
        (chefskiss.com.cy).
      </p>
      <p>
        We are the data controller for the personal data described in this
        policy.
      </p>
      <p>
        <strong>Our contact details:</strong>
      </p>
      <ul>
        <li>DMC Nexus Hospitality Ltd</li>
        <li>111, Nissi Avenue, Ayia Napa, 5330, Cyprus</li>
        <li>
          Email: <span className="text-primary">info@chefskiss.com.cy</span>
        </li>
      </ul>

      <h2>What data do we collect?</h2>
      <p>We collect the following personal data:</p>
      <p>
        <strong>
          From workshop attendees (the person making the booking):
        </strong>
      </p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Number of attendees in the booking</li>
        <li>
          A reference to the payment transaction processed by our payment
          provider (we do not collect or store card details; see &quot;Third
          parties&quot; below)
        </li>
      </ul>
      <p>
        <strong>From vendor and workshop host applicants:</strong>
      </p>
      <ul>
        <li>Full name of the contact person</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Business name</li>
        <li>Business Instagram handle</li>
        <li>A copy of the business licence (uploaded file)</li>
      </ul>
      <p>
        <strong>From administrators:</strong>
      </p>
      <ul>
        <li>Email address (for sign-in via Google)</li>
      </ul>
      <p>
        <strong>Automatically collected:</strong>
      </p>
      <ul>
        <li>
          Technical information required for the site to function (e.g., session
          cookies for signed-in administrators). See our{" "}
          <Link href="/cookies">Cookie Policy</Link>. for details.
        </li>
      </ul>

      <h2>How do we collect your data?</h2>
      <p>You provide most of this data directly when you:</p>
      <ul>
        <li>Book a workshop through our website</li>
        <li>Submit a vendor or workshop host application</li>
        <li>Sign in as an administrator</li>
      </ul>
      <p>
        Some data is collected automatically when you visit the site (for
        example, session cookies for signed-in users).
      </p>

      <h2>Why we use your data and the legal basis</h2>
      <p>We use your data for the following purposes:</p>
      <ul>
        <li>
          <strong>To process workshop bookings</strong>, including sending
          booking confirmations and event communications. Legal basis:
          performance of a contract.
        </li>
        <li>
          <strong>
            To link your booking to the payment processed by our payment
            provider.
          </strong>{" "}
          Legal basis: performance of a contract.
        </li>
        <li>
          <strong>To review vendor and workshop host applications</strong> and
          communicate with applicants. Legal basis: performance of a contract or
          taking steps at your request prior to entering into a contract.
        </li>
        <li>
          <strong>To operate and secure the website</strong>, including
          administrator authentication. Legal basis: legitimate interests
          (running the service).
        </li>
        <li>
          <strong>To comply with legal obligations</strong>, including tax and
          accounting record-keeping requirements. Legal basis: legal obligation.
        </li>
      </ul>
      <p>
        We do not currently send marketing emails. If we decide to do so in the
        future, we will ask for your consent first, and you will be able to opt
        out at any time.
      </p>

      <h2>Who we share your data with (third parties)</h2>
      <p>
        We use the following service providers to operate the website. Each of
        these providers acts as a data processor on our behalf and processes
        your data only according to our instructions:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> &mdash; website hosting.
        </li>
        <li>
          <strong>Neon Inc.</strong> &mdash; database hosting (where your
          booking and application information is stored).
        </li>
        <li>
          <strong>Resend</strong> &mdash; sending transactional emails (for
          example, booking confirmations).
        </li>
        <li>
          <strong>Payabl.one</strong> &mdash; processing payments for workshop
          bookings. When you make a payment, you are directed to
          Payabl.one&apos;s hosted payment page. Your card details are collected
          and processed directly by Payabl.one under their own privacy policy;
          we do not see or store them. We receive only a transaction reference
          and a confirmation that the payment succeeded.
        </li>
        <li>
          <strong>UploadThing</strong> &mdash; hosting files uploaded to the
          site (such as vendor business licences and images displayed on the
          site).
        </li>
        <li>
          <strong>Google LLC</strong> &mdash; providing sign-in (OAuth) for
          administrators only. Public visitors do not use Google sign-in.
        </li>
      </ul>
      <p>
        Some of these providers may transfer or store data outside the European
        Economic Area. Where they do, they rely on legally recognised safeguards
        for international data transfers (such as the EU Standard Contractual
        Clauses).
      </p>
      <p>
        We do not sell your personal data. We do not share your personal data
        with third parties for their own marketing purposes.
      </p>
      <p>
        We may also share data where we are legally required to do so (for
        example, in response to a lawful request from a public authority).
      </p>

      <h2>How long we keep your data</h2>
      <ul>
        <li>
          <strong>Workshop booking records</strong> (including your name, email,
          phone, number of attendees, and the payment transaction reference):
          approximately one year after the festival event, with the exception of
          information required to meet our tax and accounting obligations, which
          we keep for six years as required by Cyprus law.
        </li>
        <li>
          <strong>Vendor and workshop host applications</strong>: approximately
          one year after the application is submitted.
        </li>
        <li>
          <strong>Uploaded files</strong> (e.g., business licences): kept for
          the same period as the application they were submitted with.
        </li>
        <li>
          <strong>Administrator account data</strong>: for the duration of the
          administrator&apos;s involvement with the festival.
        </li>
      </ul>
      <p>
        Card and payment-network data is retained separately by Payabl.one under
        their own retention policy; we do not store or control it.
      </p>
      <p>
        After the applicable period expires, we delete or anonymise the data.
      </p>

      <h2>How we protect your data</h2>
      <p>
        We store your data on infrastructure provided by the processors listed
        above, which apply industry-standard security practices. We restrict
        administrator access to the system using email-based allow-listing and
        Google-authenticated sign-in.
      </p>
      <p>
        We take reasonable technical and organisational measures to protect your
        data, but no system is completely secure. If we become aware of a data
        breach that affects your personal data, we will notify you and the
        relevant authorities as required by law.
      </p>

      <h2>Your data protection rights</h2>
      <p>
        Under the EU General Data Protection Regulation (GDPR), you have the
        following rights:
      </p>
      <ul>
        <li>
          <strong>Right of access</strong> &mdash; you can request a copy of the
          personal data we hold about you.
        </li>
        <li>
          <strong>Right to rectification</strong> &mdash; you can ask us to
          correct data that is inaccurate or incomplete.
        </li>
        <li>
          <strong>Right to erasure</strong> &mdash; you can ask us to delete
          your data, subject to certain exceptions (for example, where we are
          legally required to keep it).
        </li>
        <li>
          <strong>Right to restrict processing</strong> &mdash; you can ask us
          to limit how we use your data in certain circumstances.
        </li>
        <li>
          <strong>Right to object</strong> &mdash; you can object to our
          processing of your data on grounds relating to your particular
          situation.
        </li>
        <li>
          <strong>Right to data portability</strong> &mdash; you can ask us to
          provide your data in a portable format, or to transfer it to another
          organisation.
        </li>
        <li>
          <strong>Right to withdraw consent</strong> &mdash; where we rely on
          your consent, you can withdraw it at any time.
        </li>
      </ul>
      <p>
        To exercise any of these rights, email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>. We will
        respond within one month.
      </p>
      <p>
        You also have the right to lodge a complaint with the Cyprus data
        protection authority, the Office of the Commissioner for Personal Data
        Protection (
        <a
          href="https://www.dataprotection.gov.cy"
          target="_blank"
          rel="noreferrer noopener"
        >
          www.dataprotection.gov.cy
        </a>
        ), if you believe we have not handled your data lawfully.
      </p>

      <h2>Cookies</h2>
      <p>
        For information about the cookies we use, please see our{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Our website may contain links to other websites (for example, the social
        media pages of vendors). This Privacy Policy applies only to our site.
        If you click through to another site, please read their privacy policy.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        update the &quot;Last updated&quot; date at the top of this page. We
        encourage you to review this page periodically.
      </p>

      <h2>How to contact us</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle
        your data, please email us at{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>.
      </p>
    </LegalDoc>
  );
}
