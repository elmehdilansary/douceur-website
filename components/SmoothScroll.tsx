"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap.config";
import { registerGSAP } from "@/lib/gsap.config";

export default function SmoothScroll() {
  useEffect(() => {
    registerGSAP();
    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1.4,
      touchMultiplier: 2.0,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
