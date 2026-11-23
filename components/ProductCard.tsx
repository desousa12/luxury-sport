"use client";

import type { Product } from "../types/menu";
import { formatCurrency } from "../utils/whatsapp";

type ProductCardProps = {
  product: Product;
  onCustomize: (product: Product) => void;
};

export function ProductCard({
  product,
  onCustomize,
}: ProductCardProps) {
  return (
    <article className="product-card">
    <button
      type="button"
      className="product-card__hit-target"
      aria-label={`Ver ${product.nombre}`}
      onClick={() => onCustomize(product)}
    />
    <div className="product-card__image-wrap">
        <img src={product.imagen} alt={product.nombre} className="product-card__image" />
      </div>
      <div className="product-card__body">
        <div className="product-card__details">
          <h3>{product.nombre}</h3>
          <p>{product.equipo}</p>
        </div>
        <span className="product-card__price">
          {formatCurrency(product.precio)}
        </span>
        <button
          type="button"
          onClick={() => onCustomize(product)}
          className="product-card__action"
          aria-label={`Ver ${product.nombre}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </article>
  );
}
