import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, LegalSection } from "@/components/LegalPage";
import { TruckIcon } from "@/components/icons";
import { buildMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  description: `Processing times, cold-chain packaging and delivery details for ${SITE_NAME} orders.`,
  path: "/shipping-policy",
});

const SECTIONS = [
  { id: "processing", label: "Processing time" },
  { id: "packaging", label: "Cold-chain packaging" },
  { id: "rates", label: "Shipping rates & regions" },
  { id: "tracking", label: "Tracking your order" },
  { id: "delays", label: "Delays & lost packages" },
  { id: "contact", label: "Contact us" },
];

export default function ShippingPolicyPage() {
  return (
    <LegalShell
      icon={<TruckIcon width={26} height={26} />}
      eyebrow="Policy"
      title="Shipping Policy"
      updated="August 3, 2026"
      intro="Every order is cold-packed and shipped with tracking. Here's what to expect from checkout to delivery."
      sections={SECTIONS}
    >
      <LegalSection id="processing" title="Processing time">
        <p>
          Orders are verified and packed within 1–2 business days of
          payment confirmation. You'll receive an email as soon as your
          order ships, followed by a separate email with tracking once the
          carrier scans the package.
        </p>
      </LegalSection>

      <LegalSection id="packaging" title="Cold-chain packaging">
        <ul>
          <li>Pre-filled pens and vials ship in insulated packaging with cold packs to protect compound stability in transit.</li>
          <li>All outer packaging is discreet and unmarked — no product names or logos on the exterior.</li>
          <li>Tamper-evident seals are checked before dispatch; do not accept a package if the outer seal looks compromised.</li>
        </ul>
      </LegalSection>

      <LegalSection id="rates" title="Shipping rates & regions">
        <p>
          Shipping cost and estimated delivery time are calculated at
          checkout based on your address and the shipping method you select.
          We currently ship within the regions available at checkout; if
          your country isn't listed, it means we can't yet guarantee
          cold-chain delivery there.
        </p>
      </LegalSection>

      <LegalSection id="tracking" title="Tracking your order">
        <p>
          Once your order ships, use the{" "}
          <Link href="/track-order">order tracking page</Link> with your
          order number and email to see live carrier status. Tracking
          details are also available from your{" "}
          <Link href="/account">account</Link> if you checked out signed in.
        </p>
      </LegalSection>

      <LegalSection id="delays" title="Delays & lost packages">
        <p>
          Once a package is scanned by the carrier, transit times are
          outside our control, though we'll help you chase a resolution if
          something looks wrong. If tracking shows no movement for more than
          5 business days, or a package is marked delivered but never
          arrives, contact us and we'll open a carrier trace and arrange a
          replacement or refund per our{" "}
          <Link href="/refund-policy">Refund Policy</Link> once the trace
          confirms the package is lost.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <p>
          Shipping questions? Email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your
          order number and we'll get back to you quickly.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
