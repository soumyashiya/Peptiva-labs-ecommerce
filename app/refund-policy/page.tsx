import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/LegalPage";
import { ShieldIcon } from "@/components/icons";
import { buildMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description: `Refund, cancellation and damaged-order policy for ${SITE_NAME} research products.`,
  path: "/refund-policy",
});

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "cancellations", label: "Order cancellations" },
  { id: "damaged", label: "Damaged or incorrect orders" },
  { id: "non-refundable", label: "Non-refundable situations" },
  { id: "process", label: "How refunds are issued" },
  { id: "contact", label: "Contact us" },
];

export default function RefundPolicyPage() {
  return (
    <LegalShell
      icon={<ShieldIcon width={26} height={26} />}
      eyebrow="Policy"
      title="Refund Policy"
      updated="August 3, 2026"
      intro="Because our catalogue is sealed, cold-chain research material, this policy is narrower than a typical retail refund policy. Read it before you order."
      sections={SECTIONS}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          All products sold by {SITE_NAME} are supplied for laboratory and
          analytical research use only, shipped sealed and tamper-evident,
          and stored cold from the point of production. Because of the
          handling and storage requirements involved, we can only accept
          returns or issue refunds in the specific situations set out below.
        </p>
      </LegalSection>

      <LegalSection id="cancellations" title="Order cancellations">
        <ul>
          <li>You can cancel an order free of charge any time before it has been marked as shipped.</li>
          <li>To cancel, email us or use the contact details on your order confirmation as soon as possible — we process orders quickly, so earlier is better.</li>
          <li>Once an order has shipped, it can no longer be cancelled; see the damaged/incorrect-order section below for post-shipment issues.</li>
        </ul>
      </LegalSection>

      <LegalSection id="damaged" title="Damaged, missing or incorrect orders">
        <p>
          If your order arrives damaged, incomplete, or different from what
          you ordered, contact us within 48 hours of delivery with:
        </p>
        <ul>
          <li>Your order number.</li>
          <li>Photos of the outer packaging and the affected item(s).</li>
          <li>A description of the issue.</li>
        </ul>
        <p>
          Once we've verified the claim, we'll send a replacement at no
          extra cost or issue a full refund to your original payment method,
          whichever you prefer.
        </p>
      </LegalSection>

      <LegalSection id="non-refundable" title="Non-refundable situations">
        <ul>
          <li>Products with a broken seal or tamper-evident closure that was opened after delivery, unless the item arrived that way.</li>
          <li>Change-of-mind requests once an order has shipped.</li>
          <li>Delays caused by the carrier once a package has left our facility (see our <Link href="/shipping-policy">Shipping Policy</Link>).</li>
          <li>Incorrect shipping details supplied by the customer at checkout.</li>
        </ul>
      </LegalSection>

      <LegalSection id="process" title="How refunds are issued">
        <p>
          Approved refunds are returned to the original payment method within
          5–10 business days, depending on your bank or payment provider.
          You'll get an email confirmation once a refund has been issued. If
          store credit is agreed instead of a refund, it's applied to your{" "}
          <Link href="/account">account</Link> and never expires.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Questions about an order? Reach us at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or track
          your shipment any time from the{" "}
          <Link href="/track-order">order tracking page</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
