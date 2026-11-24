import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutView from "@/components/pages/AboutView";
import { buildMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About us",
  description: "Why Peptiva Labs exists: verifiable, consistently handled research material, documented end to end.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ])
        )}
      />
      <Navbar />
      <main>
        <AboutView />
      </main>
      <Footer />
    </>
  );
}
