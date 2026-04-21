// /lib/gsap.config.ts — Central GSAP plugin registration and luxury ease definition

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export function registerGSAP() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  CustomEase.create("luxury", "0.16, 1, 0.3, 1");

  ScrollTrigger.config({ limitCallbacks: true });

  // Batch DOM reads/writes for ScrollTrigger
  ScrollTrigger.defaults({ invalidateOnRefresh: true });
}

export { gsap, ScrollTrigger, CustomEase };
