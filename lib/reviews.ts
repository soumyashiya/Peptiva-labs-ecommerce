/**
 * Published customer reviews. Shared by the home-page carousel and the
 * /reviews page so both always show the same set.
 */
export type Review = {
  stars: number;
  product: string;
  quote: string;
  name: string;
  kind: "product" | "company";
};

export const REVIEWS: Review[] = [
  {
    stars: 5,
    product: "Tirzepatide",
    quote:
      "Packaging was easily the cleanest I've seen from any research peptide supplier — sealed, labelled and cold-stored properly. Replies on WhatsApp arrived in minutes.",
    name: "Hassan Al Marri",
    kind: "product",
  },
  {
    stars: 5,
    product: "Retatrutide 20mg",
    quote:
      "Certificate matched the batch code on the device. That sounds basic, but it is the first time I have been able to check it end to end.",
    name: "Dr. Aisha Khan",
    kind: "product",
  },
  {
    stars: 5,
    product: "Peptiva Labs",
    quote:
      "I've worked with three different vendors. Peptiva is the only one that has been consistent on purity, stock and after-sales communication every single order.",
    name: "Yusuf Rahman",
    kind: "company",
  },
  {
    stars: 4,
    product: "BPC-157 + TB-500",
    quote:
      "Arrived cold, arrived sealed, arrived on the day they said. Documentation was in the box rather than buried in an email.",
    name: "Leila Haddad",
    kind: "product",
  },
  {
    stars: 5,
    product: "Glow",
    quote:
      "Their team walked me through concentration choices before I bought anything. No upsell, no pressure — just useful guidance. That's rare in this space.",
    name: "Omar Siddiqui",
    kind: "company",
  },
  {
    stars: 5,
    product: "NAD+ 1,000mg",
    quote:
      "Two sealed pens, one information sheet, no surprises. Reordering was a single click from the account page.",
    name: "Priya Nair",
    kind: "product",
  },
];

/** Average star rating for a subset, rounded to one decimal. */
export function averageRating(list: Review[]): number {
  if (!list.length) return 0;
  return Math.round((list.reduce((n, r) => n + r.stars, 0) / list.length) * 10) / 10;
}

/** Count of reviews per star value, 5 → 1. */
export function starBreakdown(list: Review[]): { stars: number; count: number }[] {
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: list.filter((r) => r.stars === stars).length,
  }));
}
