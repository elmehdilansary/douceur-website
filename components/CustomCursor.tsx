"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const cx = useRef(0), cy = useRef(0);
  const tx = useRef(0), ty = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch devices: skip

    const dot = dotRef.current;
    if (!dot) return;

    const onMove = (e: MouseEvent) => { tx.current = e.clientX; ty.current = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    const tick = () => {
      cx.current += (tx.current - cx.current) * 0.12;
      cy.current += (ty.current - cy.current) * 0.12;
      if (dot) {
        dot.style.transform = `translate(${cx.current - 6}px, ${cy.current - 6}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => {
      if (!dot) return;
      dot.style.width  = "40px";
      dot.style.height = "40px";
      dot.style.background = "rgba(232,67,106,0.4)";
      dot.style.marginLeft = "-14px";
      dot.style.marginTop  = "-14px";
    };
    const onLeave = () => {
      if (!dot) return;
      dot.style.width  = "12px";
      dot.style.height = "12px";
      dot.style.background = "rgba(232,67,106,0.75)";
      dot.style.marginLeft = "0px";
      dot.style.marginTop  = "0px";
    };

    const interactives = document.querySelectorAll("a, button, input, textarea, select, [role='button']");
    interactives.forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      interactives.forEach(el => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 9999,
        width: "12px", height: "12px",
        borderRadius: "50%",
        background: "rgba(232,67,106,0.75)",
        pointerEvents: "none",
        transition: "width 0.25s ease, height 0.25s ease, background 0.25s ease, margin 0.25s ease",
        willChange: "transform",
      }}
    />
  );
}
