"use client";

import type { MenuCategory, Product } from "../types/menu";
import { ProductCard } from "./ProductCard";

type CategoryViewProps = {
  category: MenuCategory;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onCustomize: (product: Product) => void;
  onBackToHome: () => void;
};

export function CategoryView({
  category,
  products,
  onAddToCart,
  onCustomize,
  onBackToHome,
}: CategoryViewProps) {
  return (
    <main className="category-view">
      <div className="category-view__intro">
        <span className="section-eyebrow">NUESTRO MENÚ</span>
        <h2>{category.name}</h2>
        <p>
          {category.id === "pizza"
            ? "Todas incluyen una porción de pan al ajillo de cortesía."
            : "Preparado con cariño, para disfrutar sin apuro."}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      ) : (
        <div className="empty-category">
          Próximamente disponible. Estamos preparando esta categoría para ti.
        </div>
      )}

      <footer className="category-footer">
        <button type="button" onClick={onBackToHome}>
          Volver al inicio
        </button>
      </footer>
    </main>
  );
}
