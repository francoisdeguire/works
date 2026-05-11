"use client";

import { useEffect, useRef } from "react";

const MAX_TILT_DEG = 3;

export default function CardTilt() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 40rem)").matches) return;

    const marker = markerRef.current;
    if (!marker) return;
    const parent = marker.parentElement;
    if (!parent) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const mx = (event.clientX - rect.left) / rect.width - 0.5;
      const my = (event.clientY - rect.top) / rect.height - 0.5;
      parent.style.setProperty("--tilt-x", `${my * 2 * MAX_TILT_DEG}deg`);
      parent.style.setProperty("--tilt-y", `${-mx * 2 * MAX_TILT_DEG}deg`);
    };

    parent.addEventListener("pointermove", handlePointerMove);

    return () => {
      parent.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <span ref={markerRef} aria-hidden className="hidden" />;
}
