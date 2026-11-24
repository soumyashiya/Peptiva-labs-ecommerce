import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import About from "@/components/About";
import Services from "@/components/Services";
import Features from "@/components/Features";
import CaseStudy from "@/components/CaseStudy";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";
import Contact, { FreeFrom } from "@/components/Contact";
import Footer from "@/components/Footer";
import { localBusinessSchema, jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(localBusinessSchema())}
      />
      <Navbar />
      <main className="home-flow">
        {/* Section order mirrors the reference storefront's home template:
            hero → best sellers → category grid → why-it-works → social proof
            → editorial strip → promo → reviews → free-from + contact. */}
        <Hero />
        <BestSellers />
        <About />
        <Services />
        <Features />
        <CaseStudy />
        <CTA />
        <FreeFrom />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
