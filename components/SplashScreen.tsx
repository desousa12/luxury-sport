"use client";

import { useEffect, useRef, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    let dismissTimer: number | undefined;
    const handleScroll = () => {
      if (window.scrollY <= 24 || dismissed.current) return;
      dismissed.current = true;
      setIsFading(true);
      dismissTimer = window.setTimeout(() => setIsVisible(false), 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (dismissTimer !== undefined) window.clearTimeout(dismissTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <section
      className={`welcome-cover${isFading ? " welcome-cover--fading" : ""}`}
      aria-label="Bienvenido a Luxury Sport"
    >
      <div className="welcome-cover__shade" />
      <div className="welcome-cover__content">
        <span className="welcome-cover__eyebrow">MODA DEPORTIVA &amp; URBANA</span>
        <h2>Luxury Sport</h2>
        <p>Estilo que se mueve contigo.</p>
        <button
          type="button"
          className="welcome-cover__hint"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="welcome-cover__arrow" aria-hidden="true">↓</span>
          Desliza hacia abajo para ver las camisetas
        </button>
      </div>
    </section>
  );
}
