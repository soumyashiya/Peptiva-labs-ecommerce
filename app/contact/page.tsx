import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactView from "@/components/pages/ContactView";
import { buildMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description: "Contact Peptiva Labs about an order, a batch lab report or a bulk research order. Replies within one business day.",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ])
        )}
      />
      <Navbar />
      <main>
        <ContactView />
      </main>
      <Footer />
    </>
  );
}
