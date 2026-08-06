import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/LegalPage";
import { DocIcon } from "@/components/icons";
import { buildMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms that govern your use of ${SITE_NAME} and any order you place with us.`,
  path: "/terms-of-service",
});

const SECTIONS = [
  { id: "acceptance", label: "Acceptance of terms" },
  { id: "eligibility", label: "Eligibility & research use" },
  { id: "accounts", label: "Accounts" },
  { id: "orders", label: "Orders & pricing" },
  { id: "shipping-returns", label: "Shipping & returns" },
  { id: "ip", label: "Intellectual property" },
  { id: "conduct", label: "Acceptable use" },
  { id: "disclaimer", label: "Disclaimer of warranties" },
  { id: "liability", label: "Limitation of liability" },
  { id: "law", label: "Governing law" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact us" },
];

export default function TermsOfServicePage() {
  return (
    <LegalShell
      icon={<DocIcon width={26} height={26} />}
      eyebrow="Policy"
      title="Terms of Service"
      updated="August 3, 2026"
      intro={`These Terms of Service ("Terms") govern your access to peptivalabs.com and any order you place with ${SITE_NAME}. By using the site or placing an order, you agree to these Terms.`}
      sections={SECTIONS}
    >
      <LegalSection id="acceptance" title="Acceptance of terms">
        <p>
          By browsing this site, creating an account, or placing an order,
          you confirm that you have read, understood, and agree to be bound
          by these Terms and our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. If you do not
          agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="Eligibility & research use">
        <ul>
          <li>You must be at least 18 years old and legally able to enter a binding contract to use this site or place an order.</li>
          <li>Every product listed is supplied strictly for laboratory and analytical research use by qualified professionals. Nothing on this site is intended for human or veterinary consumption, and no product is intended to diagnose, treat, cure, or prevent any disease.</li>
          <li>By ordering, you represent that you are acquiring the products for lawful research purposes and that you are responsible for complying with the laws and regulations that apply to research-use compounds in your jurisdiction.</li>
        </ul>
      </LegalSection>

      <LegalSection id="accounts" title="Accounts">
        <p>
          You're responsible for keeping your account credentials
          confidential and for all activity that happens under your account.
          Let us know immediately at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> if you
          suspect unauthorized use of your account.
        </p>
      </LegalSection>

      <LegalSection id="orders" title="Orders & pricing">
        <p>
          Placing an order is an offer to purchase; we may accept, decline,
          or cancel any order at our discretion — for example if a product
          is out of stock, if we suspect fraud, or if a listing error
          affected the price. Prices are shown in USD and may change without
          notice, though the price you pay is the price shown at checkout
          when your order is confirmed.
        </p>
      </LegalSection>

      <LegalSection id="shipping-returns" title="Shipping & returns">
        <p>
          Order fulfilment, delivery timelines, and return eligibility are
          described in our{" "}
          <Link href="/shipping-policy">Shipping Policy</Link> and{" "}
          <Link href="/refund-policy">Refund Policy</Link>, both of which
          form part of these Terms.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="Intellectual property">
        <p>
          All content on this site — including text, graphics, logos,
          product photography, and site design — is owned by or licensed to{" "}
          {SITE_NAME} and protected by applicable intellectual property law.
          You may not copy, reproduce, or repurpose it without our written
          permission.
        </p>
      </LegalSection>

      <LegalSection id="conduct" title="Acceptable use">
        <ul>
          <li>Do not use the site for any unlawful purpose or in a way that violates any applicable regulation.</li>
          <li>Do not attempt to interfere with, disrupt, or gain unauthorized access to the site, our systems, or other users' accounts.</li>
          <li>Do not misrepresent your identity, age, or the intended use of any product ordered.</li>
        </ul>
      </LegalSection>

      <LegalSection id="disclaimer" title="Disclaimer of warranties">
        <p>
          The site and products are provided &ldquo;as is&rdquo; for research
          use. To the fullest extent permitted by law, we disclaim all
          warranties, express or implied, regarding the site or any product,
          including any warranty of merchantability or fitness for a
          particular purpose beyond laboratory research.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {SITE_NAME} will not be
          liable for any indirect, incidental, or consequential damages
          arising from your use of the site or any product, including any
          use outside the stated research-use-only purpose. Our total
          liability for any claim arising from an order is limited to the
          amount you paid for that order.
        </p>
      </LegalSection>

      <LegalSection id="law" title="Governing law">
        <p>
          These Terms are governed by the laws applicable in the
          jurisdiction where {SITE_NAME} is registered, without regard to
          conflict-of-law principles. Any dispute arising from these Terms
          will be resolved in the courts of that jurisdiction.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          We may update these Terms from time to time. Continuing to use the
          site after an update means you accept the revised Terms. Material
          changes will be reflected by an updated &ldquo;last updated&rdquo;
          date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions about these Terms? Email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
