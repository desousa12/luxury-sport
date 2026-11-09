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
      aria-label="Bienvenido a PISA 62"
    >
      <img
        className="welcome-cover__image"
        src="/images/menu.jpg"
        alt="Logo y banner oficial de PISA 62"
      />
      <div className="welcome-cover__shade" />
      <div className="welcome-cover__content">
        <span className="welcome-cover__eyebrow">PIZZA · HELADOS · CAFÉ</span>
        <h2>PISA 62</h2>
        <p>Un buen momento empieza con algo rico.</p>
        <button
          type="button"
          className="welcome-cover__hint"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <span className="welcome-cover__arrow" aria-hidden="true">↓</span>
          Desliza hacia abajo para ver el menú
        </button>
      </div>
    </section>
  );
}
