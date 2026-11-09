"use client";

import type { MenuCategory, Product } from "../types/menu";

type CategoryGridProps = {
  categories: MenuCategory[];
  products: Product[];
  onSelect: (category: MenuCategory) => void;
  onCustomize: (product: Product) => void;
};

export function CategoryGrid({
  categories,
  products,
  onSelect,
  onCustomize,
}: CategoryGridProps) {
  const customPizza = products.find((product) => product.id === "pizza-personalizada");

  return (
    <section className="category-section">
      <div className="category-section__heading">
        <h2>¿Qué se te antoja?</h2>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const representativeProduct = products.find(
            (product) =>
              product.category === category.id &&
              product.id !== "pizza-personalizada",
          );
          const image =
            category.id === "promos"
              ? "/images/combo portada.jpg"
              : representativeProduct?.image;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category)}
              className="category-tile"
            >
              <span className="category-tile__image-wrap">
                {image ? (
                  <img
                    src={image}
                    alt=""
                    className="category-tile__image"
                    loading="lazy"
                  />
                ) : null}
              </span>
              <span className="category-tile__name">{category.name}</span>
            </button>
          );
        })}
      </div>

      {customPizza ? (
        <div className="category-feature">
          <button
            type="button"
            onClick={() => onCustomize(customPizza)}
            className="category-tile category-feature__tile"
            aria-label="Configurar Crea tu Pizza"
          >
            <span className="category-tile__image-wrap">
              <img
                src="/images/pizza vacia.jpg"
                alt=""
                className="category-tile__image"
                loading="lazy"
              />
            </span>
            <span className="category-tile__name">Crea tu Pizza</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
