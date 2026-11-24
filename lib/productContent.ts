/**
 * Product-specific copy for the product detail page: the three story
 * blocks, a tagline for the wide banner, a short research note per compound
 * and a few product-specific FAQ entries. Everything is written as
 * research-reference material: no use, dosing or outcome claims.
 */

export type Story = { title: string; body: string[] };

export type ProductContent = {
  tagline: string;
  stories: [Story, Story, Story];
  /** Keyed by compound name as it appears in the Janoshik rows. */
  compounds: Record<string, { label: string; note: string }>;
  faq: { q: string; a: string }[];
};

export const PRODUCT_CONTENT: Record<string, ProductContent> = {
  "bpc-157-tb-500": {
    tagline: "Two repair peptides, one sealed pen",
    stories: [
      {
        title: "Two compounds, measured separately.",
        body: [
          "BPC-157 and TB-500 are among the most widely cited peptides in tissue-repair literature, and are often studied side by side.",
          "Janoshik Analytical measured each one on its own in this batch: 21.99 mg of BPC-157 and 19.59 mg of TB-500 across the 3 mL fill.",
        ],
      },
      {
        title: "A blend you don't have to build.",
        body: [
          "Combining two lyophilised peptides at the bench adds a reconstitution step and a source of variance to every run.",
          "This pen arrives pre-filled at a fixed 20 mg / 20 mg ratio, so each experiment starts from the same known composition.",
        ],
      },
      {
        title: "Built for recovery protocols.",
        body: [
          "Researchers use the pair in comparative recovery and tissue-model study designs, where both compounds need to be present at once.",
          "Pair it with Glow for side-by-side protocols. Both are batch-coded to their public reports.",
        ],
      },
    ],
    compounds: {
      "BPC-157": {
        label: "Pentadecapeptide",
        note: "A 15-amino-acid synthetic peptide derived from a gastric protein sequence, widely studied in preclinical tissue and gut models.",
      },
      "TB-500": {
        label: "Thymosin β4 fragment",
        note: "A synthetic fragment of thymosin beta-4, investigated in preclinical research on cell migration and tissue repair.",
      },
    },
    faq: [
      {
        q: "What is the ratio of BPC-157 to TB-500?",
        a: "The pen is filled at 20 mg BPC-157 and 20 mg TB-500. The latest batch measured 21.99 mg and 19.59 mg respectively.",
      },
      {
        q: "Can the two compounds be ordered separately?",
        a: "Not at the moment. They are only supplied together in this pre-filled blend.",
      },
    ],
  },

  glow: {
    tagline: "A three-peptide blend led by GHK-Cu",
    stories: [
      {
        title: "Three peptides, one composition.",
        body: [
          "Glow combines GHK-Cu with BPC-157 and TB-500 in one pre-filled pen, a blend designed for skin and dermal research models.",
          "Janoshik Analytical measured all three in this batch: 25.8 mg GHK-Cu, 8.13 mg BPC-157 and 6.76 mg TB-500.",
        ],
      },
      {
        title: "Copper peptide, kept stable.",
        body: [
          "GHK-Cu is a copper-binding tripeptide, which makes it sensitive to light, heat and handling.",
          "It is filled and sealed in a single pass and kept cold from fill to dispatch, so the complex reaches your bench intact.",
        ],
      },
      {
        title: "Two sizes for two study designs.",
        body: [
          "Choose the 5 mg pen for pilot work or the 70 mg kit (two pens) for longer protocols.",
          "Both share the same composition and batch paperwork, so pilot and full-scale results compare directly.",
        ],
      },
    ],
    compounds: {
      "GHK-Cu": {
        label: "Copper tripeptide",
        note: "Glycyl-L-histidyl-L-lysine bound to copper, studied in dermal, collagen and hair-follicle research models.",
      },
      "BPC-157": {
        label: "Pentadecapeptide",
        note: "A synthetic 15-amino-acid peptide studied in preclinical tissue-repair models.",
      },
      "TB-500": {
        label: "Thymosin β4 fragment",
        note: "A synthetic thymosin beta-4 fragment investigated in cell-migration research.",
      },
    },
    faq: [
      {
        q: "What is the difference between the 5 mg and 70 mg options?",
        a: "The 70 mg kit contains two pens, each with 5 mg BPC-157, 5 mg TB-500 and 25 mg GHK-Cu. The 5 mg option is a single smaller pen for pilot work.",
      },
      {
        q: "How is Glow different from BPC-157 + TB-500?",
        a: "Glow adds GHK-Cu as its main compound, with smaller amounts of BPC-157 and TB-500. The BPC-157 + TB-500 pen contains only those two, at 20 mg each.",
      },
    ],
  },

  retatrutide: {
    tagline: "The triple agonist, in a 20 mg pen",
    stories: [
      {
        title: "Three receptors, one molecule.",
        body: [
          "Retatrutide is a single peptide that acts on the GLP-1, GIP and glucagon receptors. That triple-agonist profile makes it a key reference compound in metabolic research.",
          "This batch measured 99.21% purity, with 22.96 mg of Retatrutide across the 2.4 mL fill.",
        ],
      },
      {
        title: "Start smaller, compare cleanly.",
        body: [
          "The 20 mg pen suits pilot studies and dose-ranging work, where the full 40 mg is more than a protocol needs.",
          "It shares its formulation and handling with the 40 mg pen, so results scale from one to the other.",
        ],
      },
      {
        title: "Made for comparative designs.",
        body: [
          "Many metabolic protocols compare a triple agonist with a dual agonist such as Tirzepatide.",
          "The Metabolic Bundle pairs the two, each batch-coded to its own public report.",
        ],
      },
    ],
    compounds: {
      Retatrutide: {
        label: "GLP-1 / GIP / glucagon receptor agonist",
        note: "A synthetic triple-agonist peptide investigated in metabolic and energy-balance research.",
      },
    },
    faq: [
      {
        q: "How does the 20 mg pen differ from the 40 mg?",
        a: "Only the amount of Retatrutide. The formulation, the device and the handling are the same; the 40 mg pen is filled at a higher concentration.",
      },
    ],
  },

  "retatrutide-40mg": {
    tagline: "High-concentration Retatrutide",
    stories: [
      {
        title: "Twice the material, same fill.",
        body: [
          "The 40 mg pen holds the same 2.4 mL fill as the 20 mg pen at almost double the concentration: 18.22 mg/mL, measured by Janoshik Analytical.",
          "That gives 43.72 mg of Retatrutide in this batch, at 99.269% purity.",
        ],
      },
      {
        title: "Built for longer protocols.",
        body: [
          "Extended and multi-arm studies use more material. One 40 mg pen replaces two 20 mg pens and their two batch numbers.",
          "Fewer devices means fewer variables to track across a study.",
        ],
      },
      {
        title: "A triple-agonist reference.",
        body: [
          "Retatrutide acts on the GLP-1, GIP and glucagon receptors, which makes it central to current metabolic research.",
          "Every pen is batch-coded to its report, so a result traces back to a measured lot.",
        ],
      },
    ],
    compounds: {
      Retatrutide: {
        label: "GLP-1 / GIP / glucagon receptor agonist",
        note: "A synthetic triple-agonist peptide, supplied here at high concentration for extended research protocols.",
      },
    },
    faq: [
      {
        q: "Why choose 40 mg over two 20 mg pens?",
        a: "One device and one batch number instead of two, which simplifies record-keeping on longer studies.",
      },
    ],
  },

  tirzepatide: {
    tagline: "The dual agonist, in three strengths",
    stories: [
      {
        title: "Dual agonist, verified purity.",
        body: [
          "Tirzepatide acts on the GLP-1 and GIP receptors and is one of the most widely studied incretin peptides.",
          "The latest 40 mg batch measured 99.85% purity, with 40.05 mg across the 3 mL fill.",
        ],
      },
      {
        title: "Three strengths, one formulation.",
        body: [
          "Tirzepatide is stocked at 5, 20 and 40 mg, so each study design can use the amount it needs.",
          "Every strength shares the same device and handling, so results compare across the range.",
        ],
      },
      {
        title: "The benchmark for comparison.",
        body: [
          "As an established dual agonist, Tirzepatide is the usual reference point next to newer triple agonists like Retatrutide.",
          "Add both through the Metabolic Bundle for a side-by-side design.",
        ],
      },
    ],
    compounds: {
      Tirzepatide: {
        label: "GLP-1 / GIP receptor agonist",
        note: "A synthetic dual-agonist peptide and a widely used reference compound in incretin and metabolic research.",
      },
    },
    faq: [
      {
        q: "Which strengths are available?",
        a: "5 mg, 20 mg and 40 mg pre-filled pens. The report on this page is for the 40 mg batch.",
      },
    ],
  },

  "nad-plus-1000mg": {
    tagline: "1,000 mg of NAD+, in two pens",
    stories: [
      {
        title: "A coenzyme, not a peptide.",
        body: [
          "NAD+ (nicotinamide adenine dinucleotide) is the coenzyme behind cellular energy metabolism and a substrate for the sirtuin and PARP enzymes.",
          "It is one of the most studied molecules in cellular-ageing research.",
        ],
      },
      {
        title: "Two pens, 500 mg each.",
        body: [
          "The kit splits 1,000 mg across two sealed pens, so one can stay sealed and cold while the other is in use.",
          "That limits how often the material is exposed, which matters for a molecule this sensitive.",
        ],
      },
      {
        title: "Handled for stability.",
        body: [
          "NAD+ degrades with heat, light and repeated handling. Each pen is filled and sealed in one pass and shipped temperature-controlled.",
          "Its independent report is published the day the current batch is released.",
        ],
      },
    ],
    compounds: {
      "NAD+": {
        label: "Nicotinamide adenine dinucleotide",
        note: "A redox coenzyme present in every living cell, studied in research on mitochondrial function, sirtuins and cellular ageing.",
      },
    },
    faq: [
      {
        q: "Why is the kit split into two pens?",
        a: "So one pen can stay sealed while the other is in use. NAD+ is sensitive to heat and light, and less exposure helps stability.",
      },
      {
        q: "Is a lab report available?",
        a: "The independent report for the current batch is being prepared and will be published on this page when it is released.",
      },
    ],
  },

  "cjc-1295": {
    tagline: "CJC-1295 without DAC, 10 mg",
    stories: [
      {
        title: "A GHRH analogue, without DAC.",
        body: [
          "CJC-1295 is a synthetic analogue of growth-hormone-releasing hormone. This version has no drug affinity complex (DAC), which gives it a short half-life.",
          "That short half-life makes it the usual choice for pulsatile research designs.",
        ],
      },
      {
        title: "10 mg, pre-filled and sealed.",
        body: [
          "Supplied in a single 10 mg pre-filled pen, so no vial reconstitution is needed before a run.",
          "The pen is batch-coded and sealed in one controlled pass.",
        ],
      },
      {
        title: "Short-acting by design.",
        body: [
          "Without DAC, CJC-1295 clears quickly, so each measurement reflects a distinct pulse rather than a sustained level.",
          "Every batch is sent for independent testing, and its batch code is printed on the pen.",
        ],
      },
    ],
    compounds: {
      "CJC-1295": {
        label: "GHRH analogue (no DAC)",
        note: "A modified 29-amino-acid GHRH fragment studied in growth-hormone axis research.",
      },
    },
    faq: [
      {
        q: "What does 'without DAC' mean?",
        a: "DAC (drug affinity complex) is a modification that extends half-life. This version does not have it, so its half-life is short.",
      },
      {
        q: "Does the pen need reconstituting?",
        a: "No. It arrives pre-filled and sealed, ready for laboratory use.",
      },
    ],
  },

  "mots-c": {
    tagline: "A mitochondrial peptide, 40 mg",
    stories: [
      {
        title: "Encoded by mitochondria.",
        body: [
          "MOTS-C is a 16-amino-acid peptide encoded in mitochondrial DNA, not in the cell nucleus. That makes it an unusual subject in metabolic research.",
          "It is studied for its role in cellular energy regulation and metabolic signalling.",
        ],
      },
      {
        title: "40 mg in one pen.",
        body: [
          "The pen holds 40 mg, divided into four 10 mg portions, so multi-point protocols can run from a single batch.",
          "One device and one batch code keep the paperwork simple.",
        ],
      },
      {
        title: "Sealed for a sensitive peptide.",
        body: [
          "Short peptides like MOTS-C are sensitive to heat and handling, so each pen is filled and sealed in one pass and kept at 2–8°C.",
          "Every batch is sent for independent testing, and its batch code is printed on the pen.",
        ],
      },
    ],
    compounds: {
      "MOTS-C": {
        label: "Mitochondrial-derived peptide",
        note: "A 16-amino-acid peptide encoded by the mitochondrial 12S rRNA gene, studied in metabolic and exercise-physiology research.",
      },
    },
    faq: [
      {
        q: "What makes MOTS-C different from other peptides?",
        a: "It is encoded by mitochondrial DNA rather than nuclear DNA. It belongs to a small group of mitochondrial-derived peptides.",
      },
      {
        q: "How is the 40 mg divided?",
        a: "Into four 10 mg portions within one pre-filled pen.",
      },
    ],
  },

  tesamorelin: {
    tagline: "A stabilised GHRH analogue, 20 mg",
    stories: [
      {
        title: "A stabilised GHRH analogue.",
        body: [
          "Tesamorelin is a synthetic analogue of growth-hormone-releasing hormone with a modification at the N-terminus that makes it more stable.",
          "It is a well-characterised reference compound in growth-hormone axis and body-composition research.",
        ],
      },
      {
        title: "20 mg, in ten portions.",
        body: [
          "The pen holds 20 mg, divided into ten 2 mg portions, so repeated measurements come from one device and one batch.",
          "It arrives pre-filled and sealed, with no reconstitution needed.",
        ],
      },
      {
        title: "Traceable from the lab to your bench.",
        body: [
          "Every Tesamorelin batch goes to Janoshik Analytical for independent testing.",
          "The batch code on the pen matches its report, so every result traces back to a measured lot.",
        ],
      },
    ],
    compounds: {
      Tesamorelin: {
        label: "GHRH analogue",
        note: "A 44-amino-acid GHRH analogue with an N-terminal modification for stability, studied in growth-hormone axis research.",
      },
    },
    faq: [
      {
        q: "How is the 20 mg divided?",
        a: "Into ten 2 mg portions within one pre-filled pen.",
      },
    ],
  },
};
