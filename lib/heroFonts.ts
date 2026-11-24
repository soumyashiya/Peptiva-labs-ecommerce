import {
  Archivo_Black,
  Bodoni_Moda,
  Cormorant_Garamond,
  Playfair_Display,
  UnifrakturCook,
} from "next/font/google";

/* Wordmark faces for the hero proof strip. Declared in a plain (non-client)
   module so the server and the browser resolve the same font class names. */
export const blackletter = UnifrakturCook({ weight: "700", subsets: ["latin"], display: "swap" });
export const playfair = Playfair_Display({ weight: ["700", "900"], subsets: ["latin"], display: "swap" });
export const bodoni = Bodoni_Moda({ weight: ["400", "700"], subsets: ["latin"], display: "swap" });
export const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], display: "swap" });
export const cormorant = Cormorant_Garamond({ weight: ["500"], style: ["italic"], subsets: ["latin"], display: "swap" });
