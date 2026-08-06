import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Shop from "@/components/Shop";
import { PRODUCTS } from "@/lib/products";
import { buildMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop the full range",
  description: `Browse all ${PRODUCTS.length} research-grade peptide formulations. Third-party tested, sealed, and cold-stored before it leaves the shelf.`,
  path: "/products",
  keywords: ["research peptides", "peptide shop", "buy research peptides"],
});

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
          ])
        )}
      />
      <Navbar />
      <main id="shop">
        <Shop />
      </main>
      <Footer />
    </>
  );
}
