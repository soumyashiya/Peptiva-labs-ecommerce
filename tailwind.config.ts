import type { Config } from "tailwindcss";

/**
 * Design system mirrored from the reference wellness storefront.
 *
 * Everything here maps 1:1 onto the CSS custom properties declared in
 * `app/globals.css` under the `--fl-*` namespace, so a token can be reached
 * either as a Tailwind class (`bg-sand-100`) or as a raw var inside arbitrary
 * CSS (`var(--fl-sand-100)`). Keeping both in sync is deliberate: section
 * gradients and the page shell need the vars, components want the classes.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        lg: "40px",
      },
      screens: {
        "2xl": "1390px",
      },
    },
    extend: {
      colors: {
        /* ---- neutrals ---- */
        ink: {
          DEFAULT: "#111121",
          black: "#000000",
        },
        grey: {
          100: "#F5F5F5",
          200: "#EBEBEB",
          300: "#E0E0E0",
          500: "#C4C4C4",
          600: "#909090",
          650: "#8A8A8A",
          700: "#5B5B5B",
          800: "#2A2A2A",
        },

        /* ---- warm surfaces ---- */
        sand: { 100: "#F8F5F2" },
        powder: {
          50: "#FEF7F8",
          100: "#FCF1F3",
          200: "#FAE3E8",
          300: "#F6DDE3",
          400: "#F1D4DB",
          500: "#EDCBD4",
        },

        /* ---- tints used for section washes and product cards ---- */
        tint: {
          lavender: "#E4E4FD",
          "lavender-50": "#F3F1FF",
          sage: "#ECF4ED",
          rose: "#FBE3EC",
          "rose-100": "#F7E7E7",
          aqua: "#DDF2F6",
          "aqua-50": "#EDF8FA",
          amber: "#FFF1D6",
          mint: "#DCFFCF",
          blush: "#F4DCE6",
          pink: "#FEE6FB",
          "pink-50": "#FBE3EC",
        },

        /* ---- goal / category washes ---- */
        goal: {
          hair: "#EFEBFF",
          skin: "#FFE9EE",
          weight: "#E6F6EA",
          gut: "#FFF1DA",
          menopause: "#FDE6EE",
          mood: "#E9E8FF",
          energy: "#FFF6D3",
          bones: "#E4F4F7",
        },

        /* ---- accents ---- */
        violet: {
          300: "#8E82FF",
          400: "#8B7CF6",
          500: "#7C6CF2",
          600: "#5B4CD6",
        },
        lilac: { 300: "#C9A0F0" },
        plum: { 500: "#4B4170", 700: "#2E2359" },
        wine: { 900: "#4B0E29" },
        berry: { 500: "#AF3460" },
        teal: { 200: "#9FDDE8", 500: "#2E9DB3" },
        leaf: { 600: "#00B67A", 800: "#1E6F3D" },
        alert: { 500: "#DA3238", 50: "#FFEFF0" },
        quiet: "#564F60",
      },

      fontFamily: {
        sans: ["var(--font-core)", "Poppins", "Helvetica Neue", "Arial", "sans-serif"],
        core: ["var(--font-core)", "Poppins", "Helvetica Neue", "Arial", "sans-serif"],
      },

      /**
       * Measured off the reference at a 1440px viewport, then expressed as
       * clamp() so the same curve covers the breakpoints its media queries
       * handle. Desktop end-points are the literal computed values:
       *   body 16/24 · card title 20/32 · lead 25/40 (weight 300)
       *   h2 40/56 bold · editorial h3 40/60 regular · hero h1 50/65
       */
      fontSize: {
        /* body */
        micro: ["12px", { lineHeight: "1.45", letterSpacing: "0.08em" }],
        small: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.5" }],
        /* the oversized light intro paragraph: 25px / 40px */
        lead: ["clamp(17px, 1.75vw, 25px)", { lineHeight: "1.6" }],

        /* headings */
        card: ["20px", { lineHeight: "1.6" }],
        h4: ["clamp(17px, 1.4vw, 20px)", { lineHeight: "1.6" }],
        h3: ["clamp(20px, 2vw, 26px)", { lineHeight: "1.35" }],
        h2: ["clamp(28px, 3.2vw, 40px)", { lineHeight: "1.4" }],
        h1: ["clamp(32px, 4.2vw, 50px)", { lineHeight: "1.3" }],
        display: ["clamp(34px, 5.6vw, 64px)", { lineHeight: "1.12" }],
        /* the all-caps band headings, e.g. "BACKED BY REAL STUDIES" */
        band: ["clamp(34px, 6.4vw, 76px)", { lineHeight: "1.08" }],
      },

      letterSpacing: {
        caps: "0.025em",
        label: "0.08em",
      },

      maxWidth: {
        /* 1425 shell − 40px gutters = the reference's 1345px content column */
        shell: "1425px",
        prose: "640px",
      },

      /* Measured radii: 10 buttons · 14 list pills · 20 cards · 30 section
         wrappers · 40 the hero container. */
      borderRadius: {
        md: "10px",
        tile: "14px",
        lg: "20px",
        xl: "30px",
        "2xl": "40px",
        pill: "1000px",
      },

      boxShadow: {
        soft: "0 2px 40px rgba(0, 0, 0, 0.10)",
        nav: "0 2px 24px rgba(0, 0, 0, 0.06)",
        sticky: "0 -2px 20px rgba(0, 0, 0, 0.05)",
        tile: "0 1px 3px rgba(0, 0, 0, 0.06)",
      },

      backgroundImage: {
        "grad-promo":
          "linear-gradient(90deg, #E4E4FD 0%, #F7E7E7 25%, #ECF4ED 50%, #F4DCE6 75%, #E4E4FD 100%)",
        "grad-cta": "linear-gradient(120deg, #2E2359, #5B4CD6 55%, #8E82FF)",
        "grad-powder": "linear-gradient(180deg, #FEF7F8 0%, #FCF1F3 100%)",
        "grad-powder-card": "linear-gradient(135deg, #FAE3E8 0%, #FCEBEE 100%)",
        "grad-routine": "linear-gradient(180deg, #F7F0FF 0%, #F8F5F2 100%)",
        "grad-wash": "linear-gradient(135deg, #F3F1FF 0%, #F8F5F2 60%, #EDF8FA 100%)",
        "grad-stat": "linear-gradient(90deg, #2E2359, #8B7CF6 60%, #C9A0F0)",
      },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        fast: "440ms",
        base: "660ms",
      },

      keyframes: {
        "marquee-x": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0,24px,0)" },
          to: { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "upload-progress": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },

      animation: {
        marquee: "marquee-x 40s linear infinite",
        "marquee-slow": "marquee-x 70s linear infinite",
        "fade-up": "fade-up 660ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 440ms cubic-bezier(0.4, 0, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
