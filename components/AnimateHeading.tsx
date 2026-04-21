"use client";

import { useEffect, useRef } from "react";

interface Props {
  text: string;
  tag?: "h1" | "h2" | "h3";
  style?: React.CSSProperties;
  className?: string;
  triggerOnce?: boolean;
}

export default function AnimateHeading({ text, tag: Tag = "h2", style, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)";
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      obs.disconnect();
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={className}>
      {text}
    </Tag>
  );
}
