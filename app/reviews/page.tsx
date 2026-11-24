import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsView from "@/components/pages/ReviewsView";
import { buildMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Customer reviews",
  description: "Published reviews from laboratories and researchers who order from Peptiva Labs.",
  path: "/reviews",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ])
        )}
      />
      <Navbar />
      <main>
        <ReviewsView />
      </main>
      <Footer />
    </>
  );
}
