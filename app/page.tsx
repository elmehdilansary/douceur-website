// /app/page.tsx — Douceur Maroc main page

"use client";

import { useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader/Loader";
import Hero from "@/components/Hero/Hero";
import CustomCursor from "@/components/CustomCursor";
import dynamic from "next/dynamic";

const Manifesto       = dynamic(() => import("@/components/Manifesto/Manifesto"));
const ProductShowcase = dynamic(() => import("@/components/ProductShowcase/ProductShowcase"));
const Materials       = dynamic(() => import("@/components/Materials/Materials"));
const ContactForm     = dynamic(() => import("@/components/Contact/ContactForm"));
const Footer          = dynamic(() => import("@/components/Footer/Footer"));
const ScrollScene3D   = dynamic(() => import("@/components/ScrollScene3D/ScrollScene3D"), { ssr: false });
const PandaMascot     = dynamic(() => import("@/components/PandaMascot/PandaMascot"), { ssr: false });

function LazyMount({ children, margin = "800px" }: { children: React.ReactNode; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShow(true); obs.disconnect(); }
    }, { rootMargin: margin });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [margin]);
  return <div ref={ref} style={{ minHeight: show ? "auto" : "200px" }}>{show && children}</div>;
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  return (
    <>
      {!isMobile && <CustomCursor />}
      {loaded && <PandaMascot />}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <main style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}>
        <Hero />
        <LazyMount margin="400px"><ScrollScene3D /></LazyMount>
        <LazyMount><Manifesto /></LazyMount>
        <LazyMount><ProductShowcase /></LazyMount>
        <LazyMount><Materials /></LazyMount>
        <LazyMount><ContactForm /></LazyMount>
        <LazyMount><Footer /></LazyMount>
      </main>
    </>
  );
}
