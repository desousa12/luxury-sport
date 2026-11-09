"use client";

import { useEffect, useRef, useState } from "react";

import type { Product } from "../types/menu";

type HeroSliderProps = {
  products: Product[];
  onSelectPromos: () => void;
};

function scrollToSlide(
  slider: HTMLDivElement,
  index: number,
  behavior: ScrollBehavior = "smooth",
) {
  const slide = slider.children.item(index);
  if (!(slide instanceof HTMLElement)) return;

  const offset =
    slide.getBoundingClientRect().left - slider.getBoundingClientRect().left;
  slider.scrollTo({ left: slider.scrollLeft + offset, behavior });
}

export function HeroSlider({ products, onSelectPromos }: HeroSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length < 2) return;

    const timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % products.length;
      const slider = sliderRef.current;

      if (slider) {
        scrollToSlide(slider, nextIndex);
        setActiveIndex(nextIndex);
      }
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeIndex, products.length]);

  const updateActiveSlide = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = Array.from(slider.children);
    const closestIndex = slides.reduce(
      (closest, slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - slider.getBoundingClientRect().left);
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;

    setActiveIndex(closestIndex);
  };

  if (products.length === 0) return null;

  return (
    <section className="hero-section" aria-label="Promos destacadas">
      <div
        ref={sliderRef}
        className="hero-slider"
        onScroll={updateActiveSlide}
        aria-label="Promos destacadas"
      >
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="hero-slide"
            onClick={onSelectPromos}
            aria-label={`Ver todas las promociones: ${product.name}`}
          >
            <img
              src={product.carouselImage ?? product.image}
              alt={`${product.name}: ${product.description}`}
              className="hero-slide__image"
            />
          </button>
        ))}
      </div>

      {products.length > 1 ? (
        <div className="hero-pagination" aria-label="Seleccionar promo destacada">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={index === activeIndex ? "hero-dot hero-dot--active" : "hero-dot"}
              onClick={() => {
                const slider = sliderRef.current;
                if (slider) scrollToSlide(slider, index);
                setActiveIndex(index);
              }}
              aria-label={`Mostrar promo ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
