import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScienceView from "@/components/pages/ScienceView";
import { buildMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our science & lab results",
  description: "Independent Janoshik Analytical results for every Peptiva Labs compound — batch codes, measured content and public verification links.",
  path: "/science",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Science", path: "/science" },
          ])
        )}
      />
      <Navbar />
      <main>
        <ScienceView />
      </main>
      <Footer />
    </>
  );
}
