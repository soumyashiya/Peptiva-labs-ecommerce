import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/LegalPage";
import { ChatIcon } from "@/components/icons";
import { buildMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Press & Media",
  description: `Media resources, brand facts and press contact details for ${SITE_NAME}.`,
  path: "/press",
});

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "facts", label: "Company facts" },
  { id: "assets", label: "Brand assets" },
  { id: "inquiries", label: "Media inquiries" },
];

export default function PressPage() {
  return (
    <LegalShell
      icon={<ChatIcon width={26} height={26} />}
      eyebrow="Press"
      title="Press & Media"
      updated="August 3, 2026"
      intro="Resources for journalists, researchers and partners writing about Peptiva Labs, our sourcing standards, and the research-peptide category."
      sections={SECTIONS}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          Peptiva Labs supplies reference-grade research peptides and
          compounds to laboratories and qualified research professionals.
          Every batch we release is third-party tested by Janoshik
          Analytical, sealed under tamper-evident packaging, and cold-stored
          from production through delivery.
        </p>
        <p>
          We do not currently maintain a public archive of press coverage.
          If you are working on a story that references Peptiva Labs, please
          reach out using the contact details below — we're happy to verify
          facts, provide comment, or share supporting documentation.
        </p>
      </LegalSection>

      <LegalSection id="facts" title="Company facts">
        <ul>
          <li>Founded to supply verified, research-use-only peptide formulations to laboratories.</li>
          <li>Every catalogue item is batch-tested by an independent third-party lab (Janoshik Analytical) before it ships.</li>
          <li>Products are supplied strictly for laboratory and analytical research — not for human or veterinary use.</li>
          <li>Cold-chain packaging and tracked shipping on every order.</li>
        </ul>
      </LegalSection>

      <LegalSection id="assets" title="Brand assets">
        <p>
          Logo files and brand guidelines are available on request for
          accredited media and partners. Please include your publication or
          organisation and the intended use when you write in.
        </p>
      </LegalSection>

      <LegalSection id="inquiries" title="Media inquiries">
        <p>
          For interview requests, fact-checking, or comment, email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with
          &ldquo;Press&rdquo; in the subject line. We aim to respond within
          two business days.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
