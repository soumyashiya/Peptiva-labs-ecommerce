import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Shared frame for sign-in / create-account: soft pink wash, photo card, bordered form card. */

export const HARD = "rounded-[14px] border-[1.5px] border-black shadow-[3px_3px_0_#000]";

export const INPUT =
  "h-12 w-full rounded-md border border-grey-300 bg-white px-4 text-base text-black outline-none transition-colors duration-fast placeholder:text-grey-600 focus:border-black";

export default function AuthShell({
  img,
  tag,
  title,
  points,
  children,
}: {
  img: string;
  tag: string;
  title: string;
  points: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        className="pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44"
        style={{ background: "linear-gradient(180deg, #FDE9EF 0%, #FFF6F8 50%, #FFFFFF 100%)" }}
      >
        <div className="mx-auto grid w-[calc(100%-32px)] max-w-[1140px] items-start gap-8 lg:grid-cols-2 lg:gap-14">
          {/* photo card */}
          <aside className="relative order-2 hidden aspect-[9/10] overflow-hidden rounded-[24px] bg-powder-200 lg:sticky lg:top-40 lg:order-1 lg:block">
            <Image src={img} alt="" fill priority sizes="(min-width: 1024px) 560px, 100vw" quality={92} className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <span className="inline-flex h-6 items-center rounded-pill bg-white px-2.5 text-[9px] font-semibold uppercase tracking-label text-black">
                {tag}
              </span>
              <p className="mt-3 max-w-[420px] text-[28px] font-medium leading-tight">{title}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-small text-white/90">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* form card */}
          <section className={`${HARD} order-1 bg-white px-5 py-8 sm:px-10 sm:py-12 lg:order-2`}>{children}</section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-pill bg-powder-200 px-2.5 text-[9px] font-semibold uppercase tracking-label text-black">
      {children}
    </span>
  );
}
