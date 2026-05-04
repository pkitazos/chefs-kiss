import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Cookie Policy | Chef's Kiss Festival",
  description:
    "What cookies are, which cookies are used on the Chef's Kiss website, and how you can manage them.",
};

export default function CookiePolicyPage() {
  return (
    <LegalDoc title="Cookie Policy" lastUpdated="04.05.2026">
      <p>
        This Cookie Policy explains what cookies are, which cookies are used on
        the Chef&apos;s Kiss website (chefskiss.com.cy), and how you can manage
        them.
      </p>
      <p>
        This policy should be read alongside our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device when you
        visit a website. They are used to make websites work, to remember your
        preferences, and in some cases to collect information about how you use
        a site.
      </p>

      <h2>What cookies do we use?</h2>
      <p>
        We use a small number of cookies, all of which are strictly necessary
        for the site to work. We do not use cookies for advertising, tracking
        across other websites, or analytics.
      </p>
      <p>
        <strong>Strictly necessary cookies:</strong>
      </p>
      <ul>
        <li>
          <code>__Secure-better-auth.session_token</code> &mdash; keeps
          administrators signed in during a session. Set only when an
          administrator signs in. Public visitors do not receive this cookie.
        </li>
        <li>
          <code>__Secure-better-auth.state</code> &mdash; used temporarily
          during the administrator sign-in flow to prevent cross-site request
          forgery. Set only during sign-in.
        </li>
        <li>
          <code>vercel-experiment-uuid</code> &mdash; set by our hosting
          provider (Vercel) for platform-level functionality.
        </li>
      </ul>
      <p>
        These cookies are essential for the site to operate and cannot be
        disabled through an in-site consent banner. You can still block or
        delete cookies through your browser settings, but doing so may prevent
        parts of the site (in particular, administrator sign-in) from working.
      </p>

      <h2>How to manage cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings.
        You can usually find these options under &quot;Privacy&quot;,
        &quot;Security&quot;, or similar in your browser&apos;s preferences.
        Common options include:
      </p>
      <ul>
        <li>Viewing and deleting cookies currently stored on your device</li>
        <li>Blocking cookies from specific sites or all sites</li>
        <li>Receiving a notification when a cookie is set</li>
      </ul>
      <p>
        For detailed guidance, visit{" "}
        <a
          href="https://www.allaboutcookies.org"
          target="_blank"
          rel="noreferrer noopener"
        >
          www.allaboutcookies.org
        </a>
        .
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we add new cookies to the site (for example, if we introduce
        analytics in the future), we will update this page and, where required
        by law, ask for your consent before the new cookies are set.
      </p>

      <h2>Contact us</h2>
      <p>
        If you have questions about our use of cookies, please email{" "}
        <span className="text-primary">info@chefskiss.com.cy</span>.
      </p>
    </LegalDoc>
  );
}
