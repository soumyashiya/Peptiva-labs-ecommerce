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

/**
 * One PDP story-split photo. Defaults to filling the standard 652/786 frame.
 * `aspect` (a CSS aspect-ratio, e.g. "1 / 1") shrinks the frame to the shot's
 * own shape so a photo that isn't 652/786 neither crops nor letterboxes.
 */
export type StoryImage = {
  src: string;
  fit?: "cover" | "contain";
  aspect?: string;
  /** Tailwind max-width for the frame, e.g. "lg:max-w-[560px]". */
  width?: string;
};

export type Product = {
  slug: string;
  name: string;
  meta: string;
  price: number; // base price in USD
  from?: boolean; // show "from" prefix (variants/options)
  img: string;
  /**
   * Listed and photographed but not yet orderable: no price is shown, the
   * buy box becomes "Register interest" and it can never reach the cart.
   */
  comingSoon?: boolean;
  /** Freshly added to the catalogue: cards carry the circular "New" badge. */
  newArrival?: boolean;
  /** Lifestyle photo (4:5) used on catalogue rail cards, e.g. best sellers. */
  cardImg?: string;
  /** Second photo cross-faded in when a rail card is hovered. */
  hoverImg?: string;
  /**
   * Pins the three PDP story-split photos. Without it they fall back to the
   * card, hover and render images, which are framed for cards, not for the
   * tall 652/786 story frame. Use `fit: "contain"` for a shot wider than the
   * frame, where cropping to fill would cut the subject off at the edges.
   */
  storyImgs?: [StoryImage, StoryImage, StoryImage];
  /**
   * Photo for the wide tagline banner. A photograph fills the frame; without
   * this the banner shows the transparent render contained on the wash.
   */
  bannerImg?: string;
  /** Studio shot used on the shop-page product card. */
  shopImg?: string;
  gallery?: string[];
  bg: string; // pastel wash behind the product render on catalogue cards
  category: string;
  /** Short goal/benefit tags shown as filter chips and on the PDP. */
  tags?: string[];
  rating?: number;
  reviews?: number;
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
    img: "/new-images/products/bpc-tb500/render.png",
    shopImg: "/new-images/shop/cards-v2/07-BPC157-TB500-40mg.webp",
    bannerImg: "/new-images/bpcdetail4.png",
    cardImg: "/new-images/ALLUVI-BPC-157-TB-500.png",
    hoverImg: "/new-images/hover/ALLUVI carton on pastel marble.png",
    // All three are 1122×1402, so each frame takes that shape exactly and
    // nothing crops. The lilac backdrop matches this product's wash.
    storyImgs: [
      { src: "/new-images/bpcdetail1.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/bpcdetail2.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/bpcdetail3.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    gallery: [
      "/new-images/bpc/trimmed/01-Carton.png",
      "/new-images/bpc/trimmed/02-Packaging.png",
      "/new-images/bpc/trimmed/03-Pen-Details.png",
    ],
    bg: "bg-goal-bones",
    category: "Research Blend",
    tags: ["Recovery", "Tissue repair", "Blends"],
    rating: 4.8,
    reviews: 412,
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
    img: "/new-images/products/glow/render.png",
    shopImg: "/new-images/shop/cards-v2/08-Glow-GHK-Cu.webp",
    cardImg: "/new-images/ALLUVI-Glow.png",
    hoverImg: "/new-images/hover/Alluvi Glow pen with chestnut hair sweep.png",
    gallery: [
      "/new-images/GLOW/ALLUVI-GLOW-Portrait.png",
      "/new-images/GLOW/ALLUVI-GLOW-Studio.png",
      "/new-images/GLOW/ALLUVI-GLOW-Details.png",
    ],
    bg: "bg-goal-skin",
    category: "Research Blend",
    tags: ["Skin", "Recovery", "Blends", "Skin & hair", "Anti-ageing"],
    rating: 4.9,
    reviews: 287,
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
    img: "/new-images/products/retatrutide-20mg/render.png",
    shopImg: "/new-images/shop/cards-v2/04-Retatrutide-20mg.webp",
    cardImg: "/new-images/Retatrutide-Second-Version/Product.png",
    gallery: [
      "/new-images/Retatrutide-Second-Version/Portrait.png",
      "/new-images/Retatrutide-Second-Version/Studio.png",
      "/new-images/Retatrutide-Second-Version/Product.png",
    ],
    bg: "bg-goal-weight",
    category: "Research Peptide",
    tags: ["Metabolic", "Triple agonist"],
    rating: 4.7,
    reviews: 531,
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
    img: "/new-images/products/tirzepatide/render.png",
    shopImg: "/new-images/shop/cards-v2/06-Tirzepatide-40mg.webp",
    cardImg: "/new-images/ALLUVI-Tirzepatide.png",
    hoverImg: "/new-images/hover/Pastel ranunculus and tirzepatide carton.png",
    // All three are 1122×1402, so each frame takes that shape exactly and
    // nothing crops.
    storyImgs: [
      { src: "/new-images/Upright ALLUVI pen with gerbera blooms-2.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/ALLUVI carton, pen, and ivory daisies-3.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/ALLUVI Tirzepatide on a Blush Marble Tray-5.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    // 1600×960 (1.67) — close to the banner's own 16/8 frame.
    bannerImg: "/new-images/ALLUVI Tirzepatide with blush ranunculus-1.png",
    gallery: [
      "/new-images/Tirzepatide/01-Carton-Label.png",
      "/new-images/Tirzepatide/02-Carton.png",
      "/new-images/Tirzepatide/03-Pen.png",
    ],
    bg: "bg-goal-gut",
    category: "Research Peptide",
    tags: ["Metabolic", "Dual agonist"],
    rating: 4.8,
    reviews: 698,
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
    img: "/new-images/products/retatrutide/render.png",
    shopImg: "/new-images/shop/cards-v2/05-Retatrutide-40mg.webp",
    cardImg: "/new-images/ALLUVI-Retatrutide-40mg.png",
    hoverImg: "/new-images/hover/reta.png",
    // All three are 1122×1402, so each frame takes that shape exactly and
    // nothing crops. The cyan backdrop matches this product's wash.
    storyImgs: [
      { src: "/new-images/retadetail1.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/retadetail2.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/retadetail3.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    // 1600×960 (1.67) — close to the banner's own 16/8 frame.
    bannerImg: "/new-images/retadetail4.png",
    gallery: [
      "/new-images/Retatrutide/01-Carton-Label.png",
      "/new-images/Retatrutide/02-Pen.png",
      "/new-images/Retatrutide/03-Carton.png",
    ],
    bg: "bg-tint-lavender-50",
    category: "Research Peptide",
    tags: ["Metabolic", "High concentration"],
    rating: 4.8,
    reviews: 244,
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
    img: "/new-images/products/nad/render.png",
    shopImg: "/new-images/shop/cards-v2/03-NAD-Plus-1000mg.webp",
    cardImg: "/new-images/ALLUVI-NAD-Plus.png",
    hoverImg: "/new-images/hover/nad.png",
    // Each frame takes its own shot's shape and width, so nothing crops and
    // no wash shows through. Ratios are the files' real pixel dimensions.
    storyImgs: [
      // 1122×1402
      { src: "/new-images/natdetail1.png", fit: "contain", aspect: "1122 / 1402" },
      // 1122×1402
      { src: "/new-images/hover/nad.png", fit: "contain", aspect: "1122 / 1402" },
      // 1254×1254 — square, so this frame sits shorter than the other two.
      { src: "/new-images/nad-detail.png", fit: "contain", aspect: "1 / 1" },
    ],
    bannerImg: "/new-images/nad detail-4.png",
    gallery: [
      "/new-images/NAD-Plus/01-Pen.png",
      "/new-images/NAD-Plus/02-Carton.png",
      "/new-images/NAD-Plus/03-Carton-Label.png",
    ],
    bg: "bg-goal-energy",
    category: "Research Compound",
    tags: ["Cellular", "Energy", "Anti-ageing"],
    rating: 4.6,
    reviews: 176,
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
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    meta: "10 mg pre-filled pen · without DAC",
    price: 110,
    newArrival: true,
    img: "/new-images/products/cjc-1295/render.png",
    shopImg: "/new-images/shop/cards-v2/02-CJC-1295-10mg.webp",
    cardImg: "/new-images/ALLUVI-CJC-1295.png",
    hoverImg: "/new-images/hover/cjc.png",
    // All three are 1122×1402, so each frame takes that shape exactly and
    // nothing crops. The ivory studio backdrop matches this product's wash.
    storyImgs: [
      { src: "/new-images/cjcdetail1.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/cjcdetail2.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/cjcdetail3.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    // 1600×960 (1.67) — close to the banner's own 16/8 frame.
    bannerImg: "/new-images/cjcdetail4.png",
    gallery: [
      "/new-images/CJC-1295/ALLUVI-CJC-1295-Portrait.png",
      "/new-images/CJC-1295/ALLUVI-CJC-1295-Studio.png",
      "/new-images/CJC-1295/ALLUVI-CJC-1295-Details.png",
    ],
    bg: "bg-goal-bones",
    category: "Research Peptide",
    tags: ["Metabolic"],
    rating: 4.7,
    reviews: 86,
    blurb:
      "CJC-1295 (without DAC) reference peptide in a sealed 10 mg pre-filled research pen.",
    description: [
      "A 10 mg CJC-1295 (without DAC) reference formulation supplied in a pre-filled research device, intended exclusively for controlled laboratory R&D applications.",
    ],
    highlights: [
      "10 mg per pen, without DAC",
      "Batch testing by Janoshik Analytical before release",
      "Sealed, tamper-evident handling",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    packageContents: [
      "Each CJC-1295 10 mg research kit includes:",
      "Pre-filled research pen (10 mg CJC-1295, without DAC)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "mots-c",
    name: "MOTS-C",
    meta: "40 mg pre-filled pen",
    price: 140,
    newArrival: true,
    img: "/new-images/products/mots-c/render.png",
    shopImg: "/new-images/shop/cards-v2/09-MOTS-C-40mg.webp",
    cardImg: "/new-images/ALLUVI-MOTS-C.png",
    hoverImg: "/new-images/hover/Three Pens on a Warm Gradient.png",
    // Each frame takes its own shot's shape, so nothing crops and no wash
    // shows through. Ratios are the files' real pixel dimensions.
    storyImgs: [
      // 1122×1402
      { src: "/new-images/MOTS-C carton and pen display-1.png", fit: "contain", aspect: "1122 / 1402" },
      // 1122×1402
      { src: "/new-images/Violet-capped pen in warm hands-2.png", fit: "contain", aspect: "1122 / 1402" },
      // 1122×1402
      { src: "/new-images/Pastel carton and violet pen-4.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    // 1600×971 — the landscape shot, for the wide banner.
    bannerImg: "/new-images/MOTS-C carton and pen on lemon table-3.png",
    gallery: [
      "/new-images/MOTS-C/01-Carton.png",
      "/new-images/MOTS-C/02-Carton-Label.png",
      "/new-images/MOTS-C/03-Pen.png",
    ],
    bg: "bg-tint-lavender-50",
    category: "Research Peptide",
    tags: ["Metabolic", "Cellular", "Energy"],
    rating: 4.8,
    reviews: 104,
    blurb:
      "MOTS-C mitochondrial-derived reference peptide in a sealed 40 mg pre-filled research pen.",
    description: [
      "A 40 mg MOTS-C reference formulation supplied in a pre-filled research device, intended exclusively for controlled laboratory R&D applications.",
    ],
    highlights: [
      "40 mg per pen (4 doses of 10 mg)",
      "Batch testing by Janoshik Analytical before release",
      "Sealed, tamper-evident handling",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    packageContents: [
      "Each MOTS-C 40 mg research kit includes:",
      "Pre-filled research pen (40 mg MOTS-C)",
      "Research information sheet",
    ],
    storageLogic:
      "Store refrigerated (2–8°C). Do not freeze. Supplied in fixed-volume sealed format for laboratory analysis.",
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    meta: "20 mg pre-filled pen",
    price: 120,
    newArrival: true,
    img: "/new-images/products/tesamorelin/render.png",
    shopImg: "/new-images/shop/cards-v2/01-Tesamorelin-20mg.webp",
    cardImg: "/new-images/ALLUVI-Tesamorelin.png",
    hoverImg: "/new-images/hover/tessa.png",
    // All three are 1122×1402, so each frame takes that shape exactly and
    // nothing crops. The pink backdrop is this product's own wash.
    storyImgs: [
      { src: "/new-images/ALLUVI-Tesamorelin-02-Front.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/ALLUVI-Tesamorelin-03-Floating-Pen.png", fit: "contain", aspect: "1122 / 1402" },
      { src: "/new-images/ALLUVI-Tesamorelin-04-Carton-in-Hands.png", fit: "contain", aspect: "1122 / 1402" },
    ],
    // 1600×960 (1.67) — close to the banner's own 16/8 frame.
    bannerImg: "/new-images/ALLUVI-Tesamorelin-01-Plinth.png",
    gallery: [
      "/new-images/tessa/01-Pen.png",
      "/new-images/tessa/02-Carton-Label.png",
      "/new-images/tessa/03-Carton.png",
    ],
    bg: "bg-goal-skin",
    category: "Research Peptide",
    tags: ["Metabolic"],
    rating: 4.7,
    reviews: 158,
    blurb:
      "Tesamorelin reference peptide in a sealed 20 mg pre-filled research pen for laboratory analysis and formulation studies.",
    description: [
      "A 20 mg Tesamorelin reference formulation supplied in a pre-filled research device, intended exclusively for controlled laboratory R&D applications.",
    ],
    highlights: [
      "20 mg per pen (10 doses of 2 mg)",
      "Third-party testing by Janoshik Analytical",
      "Sealed, tamper-evident handling",
      "For laboratory research use only — not for human or veterinary use",
    ],
    safetyProtocol:
      "FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Supplied strictly for laboratory and analytical research conducted by qualified professionals.",
    packageContents: [
      "Each Tesamorelin 20 mg research kit includes:",
      "Pre-filled research pen (20 mg Tesamorelin)",
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
  return PRODUCTS.filter((p) => p.slug !== slug && !p.comingSoon).slice(0, limit);
}

export function formatUSD(n: number): string {
  return `$ ${n.toLocaleString("en-US")}`;
}

export function priceLabel(p: Product): string {
  if (p.comingSoon) return "Coming soon";
  return `${p.from ? "from " : ""}${formatUSD(p.price)}`;
}

/** Full-bleed photography (cover) vs transparent product renders (contain). */
export function isPhoto(src: string): boolean {
  return !src.startsWith("/new-images/products/");
}
