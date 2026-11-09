"use client";

import type { Product } from "../types/menu";
import { formatCurrency } from "../utils/whatsapp";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
};

export function ProductCard({
  product,
  onAddToCart,
  onCustomize,
}: ProductCardProps) {
  const needsConfiguration = Boolean(
    product.modifiers?.length ||
      product.sizes?.length ||
    product.ingredients?.length ||
      product.pizzaCount,
  );
  const isPizza = product.category === "pizza";
  const isPromo = product.category === "promos";
  const isConfigurable = isPizza || isPromo;

  return (
    <article className="product-card">
      {isConfigurable ? (
        <button
          type="button"
          className="product-card__hit-target"
          aria-label={`Configurar ${product.name}`}
          onClick={() => onCustomize(product)}
        />
      ) : null}
      <div
        className={[
          "product-card__image-wrap",
          isPizza ? "product-card__image-wrap--pizza" : "",
          isPromo ? "product-card__image-wrap--promo" : "",
        ].join(" ")}
      >
        <img src={product.image} alt={product.name} className="product-card__image" />
      </div>
      <div className="product-card__body">
        <div className="product-card__details">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <span className="product-card__price">
          {product.sizes?.length ? "Desde " : ""}
          {formatCurrency(product.price)}
        </span>
        <button
          type="button"
          onClick={() =>
            needsConfiguration ? onCustomize(product) : onAddToCart(product)
          }
          className="product-card__action"
          aria-label={`${needsConfiguration ? "Configurar" : "Agregar"} ${product.name}`}
        >
          <img src="/images/plus%20logo.svg" alt="" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
