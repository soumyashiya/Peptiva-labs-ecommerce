import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/LegalPage";
import { LockIcon } from "@/components/icons";
import { buildMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects your personal information.`,
  path: "/privacy-policy",
});

const SECTIONS = [
  { id: "scope", label: "Scope" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use it" },
  { id: "cookies", label: "Cookies" },
  { id: "sharing", label: "Sharing with third parties" },
  { id: "retention", label: "Data retention" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children's privacy" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      icon={<LockIcon width={26} height={26} />}
      eyebrow="Policy"
      title="Privacy Policy"
      updated="August 3, 2026"
      intro={`This policy explains what personal information ${SITE_NAME} collects when you use our site or place an order, and how we use, store and protect it.`}
      sections={SECTIONS}
    >
      <LegalSection id="scope" title="Scope">
        <p>
          This policy applies to peptivalabs.com and any related checkout,
          account, or order-tracking pages. By using the site or placing an
          order, you agree to the collection and use of information as
          described here.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="Information we collect">
        <ul>
          <li>Account details: name, email address, and password (stored as a salted hash, never in plain text).</li>
          <li>Order information: shipping address, items purchased, order value, and order/tracking status.</li>
          <li>Payment information: handled entirely by our payment processor — we do not store full card numbers on our servers.</li>
          <li>Communications: messages you send us via email, chat widget, or the newsletter sign-up form.</li>
          <li>Technical data: IP address, browser type, and pages visited, collected automatically for security and analytics.</li>
        </ul>
      </LegalSection>

      <LegalSection id="use" title="How we use it">
        <ul>
          <li>To process, ship, and provide support for your orders.</li>
          <li>To create and secure your account and order-history access.</li>
          <li>To send order confirmations, shipping updates, and — only if you opt in — newsletter emails.</li>
          <li>To detect fraud, abuse, and security issues across the site.</li>
          <li>To improve site performance and the products we offer.</li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <p>
          We use essential cookies to keep you signed in and to remember the
          contents of your cart between visits. We may also use limited
          analytics cookies to understand how the site is used in aggregate.
          You can block or delete cookies in your browser settings, though
          some features — like staying signed in or a persistent cart — may
          stop working correctly if you do.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Sharing with third parties">
        <p>We only share personal information with the third parties needed to run the business, including:</p>
        <ul>
          <li>Payment processors, to complete and secure transactions.</li>
          <li>Shipping carriers, to deliver your order and provide tracking.</li>
          <li>Email and chat-support providers, to send transactional messages and respond to enquiries.</li>
        </ul>
        <p>We do not sell personal information to third parties.</p>
      </LegalSection>

      <LegalSection id="retention" title="Data retention">
        <p>
          We keep account and order records for as long as your account is
          active and for a reasonable period afterward to satisfy accounting,
          tax, and fraud-prevention obligations. You can request deletion of
          your account data at any time, subject to those legal requirements.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="Your rights">
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Request a copy of the personal information we hold about you.</li>
          <li>Correct inaccurate information.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Opt out of marketing emails at any time via the unsubscribe link.</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children's privacy">
        <p>
          Our products and site are intended for use by qualified research
          professionals aged 18 and over. We do not knowingly collect
          personal information from anyone under 18.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will
          be reflected by an updated &ldquo;last updated&rdquo; date at the
          top of this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Privacy questions or requests can be sent to{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, or
          reach us via the <Link href="/#contact">contact section</Link> of
          the site.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
