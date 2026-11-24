// Central SEO configuration and structured-data (JSON-LD) helpers.
//
// The canonical origin is configurable via NEXT_PUBLIC_SITE_URL so the same
// build can be promoted across preview/production without hard-coding a host.

import type { Metadata } from "next";
import { PRODUCTS, type Product, formatUSD } from "./products";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://peptivalabs.com"
).replace(/\/$/, "");

export const SITE_NAME = "Peptiva Labs";

export const SITE_DESCRIPTION =
  "Reference-grade research peptides for laboratory and analytical use. Third-party purity testing, sealed handling, and transparent sourcing. For research use only — not for human or veterinary use.";

export const CONTACT = {
  email: "sales@peptivalabs.com",
};

// Default social card inherited by every route that doesn't pass its own
// image (product routes override it with the product photo).
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/research2.jpg`,
  width: 600,
  height: 400,
  alt: "Peptiva Labs — reference-grade research peptides for laboratory use only",
};

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Shared metadata factory so every route gets consistent canonical URLs,
 * Open Graph and Twitter cards without repeating boilerplate.
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  images,
  noindex = false,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noindex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images ?? [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: DEFAULT_OG_IMAGE.url,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT.email,
      availableLanguage: ["en"],
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE.url,
    logo: `${SITE_URL}/icon.svg`,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    priceRange: "USD",
    currenciesAccepted: "USD",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    category: product.category,
    image: (product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img]
    ).map((src) => absoluteUrl(src)),
    brand: { "@type": "Brand", name: SITE_NAME },
    sku: product.slug,
    ...(product.comingSoon ? {} : { offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: { "@id": `${SITE_URL}/#organization` },
      // Human-readable label kept for parity with the on-page price.
      description: `${product.from ? "from " : ""}${formatUSD(product.price)}`,
    } }),
  };
}

/** Serialise a schema object for safe embedding in a <script> tag. */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** All product URLs, used by the sitemap. */
export function productUrls(): string[] {
  return PRODUCTS.map((p) => absoluteUrl(`/products/${p.slug}`));
}
