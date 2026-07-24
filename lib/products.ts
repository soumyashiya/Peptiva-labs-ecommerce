export type JanoshikRow = {
  compound: string;
  concentration: string;
  verified: string;
};

export type JanoshikReport = {
  batch: string;
  fillVolume: string;
  purity?: string;
  rows: JanoshikRow[];
  verifyUrl: string;
  certificateImg?: string;
};

export type Product = {
  slug: string;
  name: string;
  meta: string;
  price: number; // base price in USD
  from?: boolean; // show "from" prefix (variants/options)
  img: string;
  gallery?: string[];
  bg: string; // accent background used on the catalogue card overlay
  category: string;
  blurb: string;
  description: string[];
  highlights: string[];
  safetyProtocol?: string;
  janoshik?: JanoshikReport;
  packageContents?: string[];
  storageLogic?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500",
    meta: "40 mg dual blend",
    price: 130,
    img: "/images/bpc/front.jpg",
    gallery: [
      "/images/bpc/front.jpg",
      "/images/bpc/pen.jpg",
      "/images/bpc/open.jpg",
      "/images/bpc/uv.jpg",
    ],
    bg: "bg-lilac",
    category: "Research Blend",
    blurb:
      "Two widely researched peptides paired in one research-grade pre-filled pen for laboratory analysis and formulation studies.",
    description: [
      "A 40 mg BPC-157 & TB-500 reference formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and analytical-method development.",
    ],
    highlights: [
      "40 mg total (20 mg / 20 mg) per pen",
      "Third-party tested by Janoshik Analytical",
      "Sealed, tamper-evident handling",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    janoshik: {
      batch: "BP1701FSR",
      fillVolume: "3 mL",
      rows: [
        { compound: "BPC-157", concentration: "7.33 mg/mL", verified: "21.99 mg" },
        { compound: "TB-500", concentration: "6.53 mg/mL", verified: "19.59 mg" },
      ],
      verifyUrl:
        "https://verify.janoshik.com/tests/163218-ALLUVI_BPC157_TB500_40MG_KIT_EAI125ZEF8TB",
      certificateImg: "/images/bpc/janoshik-40mg.png",
    },
    packageContents: [
      "Each BPC-157 & TB-500 40 mg research kit includes:",
      "Pre-filled research pen (20 mg BPC-157, 20 mg TB-500)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "glow",
    name: "Glow",
    meta: "5 mg · 70 mg options",
    price: 100,
    from: true,
    img: "/images/glow/front.jpg",
    gallery: [
      "/images/glow/front.jpg",
      "/images/glow/pen.jpg",
      "/images/glow/open.jpg",
      "/images/glow/uv.jpg",
    ],
    bg: "bg-cream",
    category: "Research Blend",
    blurb:
      "A multi-compound peptide reference blend supplied in a pre-filled research pen for laboratory analysis and formulation studies.",
    description: [
      "A 70 mg Glow reference formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and analytical-method development.",
    ],
    highlights: [
      "Available in 5 mg and 70 mg options",
      "Third-party tested by Janoshik Analytical",
      "Sealed, tamper-evident pens",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    janoshik: {
      batch: "GL0621XSA",
      fillVolume: "3.4 mL",
      rows: [
        { compound: "GHK-Cu", concentration: "7.59 mg/mL", verified: "25.8 mg" },
        { compound: "BPC-157", concentration: "2.39 mg/mL", verified: "8.13 mg" },
        { compound: "TB-500", concentration: "1.99 mg/mL", verified: "6.76 mg" },
      ],
      verifyUrl:
        "https://verify.janoshik.com/tests/163217-ALLUVI_GLOW_70MG_KIT_DCL3AJSE4JQP",
      certificateImg: "/images/glow/janoshik-70mg.png",
    },
    packageContents: [
      "Each Glow 70 mg research kit includes:",
      "2 × pre-filled research pens (each pen contains 5 mg BPC-157, 5 mg TB-500, 25 mg GHK-Cu)",
      "Total contents: 10 mg BPC-157, 10 mg TB-500, 50 mg GHK-Cu",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "retatrutide",
    name: "Retatrutide 20mg",
    meta: "20 mg pre-filled pen",
    price: 100,
    img: "/images/retatrutide/20mg-front.jpg",
    gallery: [
      "/images/retatrutide/20mg-front.jpg",
      "/images/retatrutide/front.jpg",
      "/images/retatrutide/pen.jpg",
      "/images/retatrutide/open.jpg",
    ],
    bg: "bg-nude-green",
    category: "Research Peptide",
    blurb:
      "Triple-agonist reference peptide in a sealed 20 mg pre-filled research pen, batch-tested before it leaves the shelf.",
    description: [
      "A 20 mg Retatrutide reference formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and analytical-method development.",
    ],
    highlights: [
      "20 mg Retatrutide, pre-filled research pen",
      "Triple-agonist reference peptide",
      "Janoshik Analytical verified",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    janoshik: {
      batch: "AR1721TRT",
      fillVolume: "2.4 mL",
      purity: "99.21%",
      rows: [
        { compound: "Retatrutide", concentration: "9.57 mg/mL", verified: "22.96 mg" },
      ],
      verifyUrl:
        "https://verify.janoshik.com/tests/163215-ALLUVI_RETATRUTIDE_20MG_KIT_GBHEFN58JXXZ",
      certificateImg: "/images/retatrutide/janoshik-20mg.png",
    },
    packageContents: [
      "Each Retatrutide 20 mg research kit includes:",
      "Pre-filled research pen (20 mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    meta: "5 / 20 / 40 mg",
    price: 100,
    from: true,
    img: "/images/tirzepatide/front.jpg",
    gallery: [
      "/images/tirzepatide/front.jpg",
      "/images/tirzepatide/back.jpg",
      "/images/tirzepatide/open.jpg",
      "/images/tirzepatide/uv.jpg",
    ],
    bg: "bg-nude-orange",
    category: "Research Peptide",
    blurb:
      "Dual-agonist GLP-1 / GIP reference peptide stocked in three concentrations to suit different research study designs.",
    description: [
      "A 40 mg Tirzepatide reference formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and analytical-method development.",
    ],
    highlights: [
      "Available in 5 mg, 20 mg and 40 mg",
      "Dual-agonist GLP-1 / GIP reference peptide",
      "Janoshik Analytical verified",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    janoshik: {
      batch: "TR786PAOS",
      fillVolume: "3 mL",
      purity: "99.85%",
      rows: [
        { compound: "Tirzepatide", concentration: "13.35 mg/mL", verified: "40.05 mg" },
      ],
      verifyUrl:
        "https://verify.janoshik.com/tests/147174-ALLUVI_TIRZEPATIDE_40MG_KIT_T5MBWRAYD4HN",
      certificateImg: "/images/tirzepatide/janoshik-40mg.png",
    },
    packageContents: [
      "Each Tirzepatide 40 mg research kit includes:",
      "Pre-filled research pen (40 mg Tirzepatide)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "retatrutide-40mg",
    name: "Retatrutide 40mg",
    meta: "40 mg pre-filled pen",
    price: 180,
    img: "/images/retatrutide/40mg-front.jpg",
    gallery: [
      "/images/retatrutide/40mg-front.jpg",
      "/images/retatrutide/front.jpg",
      "/images/retatrutide/pen.jpg",
      "/images/retatrutide/open.jpg",
    ],
    bg: "bg-nude-green",
    category: "Research Peptide",
    blurb:
      "High-concentration 40 mg Retatrutide reference peptide in a sealed pre-filled research pen for controlled laboratory R&D applications.",
    description: [
      "A 40 mg Retatrutide reference formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in sealed format to support compound stability analysis, formulation studies, and analytical-method development.",
    ],
    highlights: [
      "40 mg Retatrutide, pre-filled research pen",
      "Janoshik Analytical verified",
      "Sealed for stability and formulation studies",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    janoshik: {
      batch: "AR1739JAT",
      fillVolume: "2.4 mL",
      purity: "99.269%",
      rows: [
        { compound: "Retatrutide", concentration: "18.22 mg/mL", verified: "43.72 mg" },
      ],
      verifyUrl:
        "https://verify.janoshik.com/tests/163216-ALLUVI_RETATRUTIDE_40MG_KIT_TU3SQLQB9ZDQ",
      certificateImg: "/images/retatrutide/janoshik-40mg.png",
    },
    packageContents: [
      "Each Retatrutide 40 mg research kit includes:",
      "Pre-filled research pen (40 mg Retatrutide)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "nad-plus-1000mg",
    name: "NAD+ 1,000mg",
    meta: "2 × 500 mg pre-filled pens",
    price: 140,
    img: "/images/nad/front.jpg",
    gallery: [
      "/images/nad/front.jpg",
      "/images/nad/pen.jpg",
      "/images/nad/open.jpg",
      "/images/nad/uv.jpg",
    ],
    bg: "bg-lilac",
    category: "Research Compound",
    blurb:
      "Nicotinamide Adenine Dinucleotide reference kit — two pre-filled 500 mg pens for controlled laboratory studies.",
    description: [
      "NAD+ (Nicotinamide Adenine Dinucleotide) reference formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.",
    ],
    highlights: [
      "2 × pre-filled NAD+ pens (500 mg each)",
      "Research information sheet included",
      "Sealed, tamper-evident kit",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    packageContents: [
      "Each NAD+ 1,000 mg kit includes:",
      "2 × pre-filled NAD+ pens (500 mg each)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.slug !== slug).slice(0, limit);
}

export function formatUSD(n: number): string {
  return `$ ${n.toLocaleString("en-US")}`;
}

export function priceLabel(p: Product): string {
  return `${p.from ? "from " : ""}${formatUSD(p.price)}`;
}
