"use client";

import { useMemo, useState } from "react";

import { menuCategories, menuProducts } from "../data/menuData";
import type {
  CartItem,
  MenuCategory,
  OrderType,
  Product,
  ProductPayload,
} from "../types/menu";
import { createWhatsAppOrderLink } from "../utils/whatsapp";
import { CartDrawer } from "./CartDrawer";
import { CategoryGrid } from "./CategoryGrid";
import { CategoryView } from "./CategoryView";
import { Header } from "./Header";
import { HeroSlider } from "./HeroSlider";
import { ProductModal } from "./ProductModal";
import { SplashScreen } from "./SplashScreen";

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxOp63lKUWG9nHmhKenS-dc9SQfu6rUxAbV37ImqXnnMaNcKFmrWe_wjlT9o8J68Ey6/exec";

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const address =
    "Av. Intercomunal Barquisimeto - Duaca, Km.8 5estrellas 3001, Lara, Tamaca, Lara, Venezuela 3001";

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return menuProducts
      .filter((product) => product.category === selectedCategory.id)
      .sort((first, second) => {
        const priority = (product: Product) =>
          product.id === "pizza-personalizada"
            ? 0
            : product.id === "pizza-pepperoni"
              ? 1
              : 2;

        return priority(first) - priority(second);
      });
  }, [selectedCategory]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const addProductToCart = (payload: ProductPayload) => {
    const newItem: CartItem = {
      id: `${payload.productId}-${Date.now()}`,
      productId: payload.productId,
      name: payload.name,
      price: payload.price,
      quantity: 1,
      modifiers: payload.modifiers,
      selectedModifierIds: payload.selectedModifierIds,
      pizzaFlavors: payload.pizzaFlavors,
      selectedPizzaFlavorIds: payload.selectedPizzaFlavorIds,
      size: payload.size,
      notes: payload.notes,
      image: payload.image,
    };

    setCart((previousCart) => {
      const existingItemIndex = previousCart.findIndex(
        (item) =>
          item.productId === payload.productId &&
          item.size === payload.size &&
          JSON.stringify(item.pizzaFlavors ?? []) ===
            JSON.stringify(payload.pizzaFlavors ?? []) &&
          JSON.stringify(item.selectedPizzaFlavorIds ?? []) ===
            JSON.stringify(payload.selectedPizzaFlavorIds ?? []) &&
          JSON.stringify([...item.selectedModifierIds].sort()) ===
            JSON.stringify([...payload.selectedModifierIds].sort()),
      );

      if (existingItemIndex === -1) return [...previousCart, newItem];

      return previousCart.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + 1,
              notes: payload.notes || item.notes,
              modifiers: payload.modifiers,
              selectedModifierIds: [...payload.selectedModifierIds],
              pizzaFlavors: payload.pizzaFlavors,
              selectedPizzaFlavorIds: payload.selectedPizzaFlavorIds,
            }
          : item,
      );
    });
  };

  const handleAddSimpleProduct = (product: Product) => {
    addProductToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      modifiers: [],
      selectedModifierIds: [],
      size: undefined,
      notes: "",
    });
  };

  const handleSelectCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPromos = () => {
    const promosCategory = menuCategories.find(
      (category) => category.id === "promos",
    );
    if (promosCategory) handleSelectCategory(promosCategory);
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const promoProducts = useMemo(
    () => menuProducts.filter((product) => product.category === "promos"),
    [],
  );

  const handleCustomizeProduct = (product: Product) => {
    setEditingCartItemId(null);
    setSelectedProduct(product);
  };

  const handleConfirmProductModal = (payload: ProductPayload) => {
    if (editingCartItemId) {
      setCart((previousCart) =>
        previousCart.map((item) =>
          item.id === editingCartItemId
            ? {
                ...item,
                name: payload.name,
                price: payload.price,
                image: payload.image,
                modifiers: payload.modifiers,
                selectedModifierIds: payload.selectedModifierIds,
                pizzaFlavors: payload.pizzaFlavors,
                selectedPizzaFlavorIds: payload.selectedPizzaFlavorIds,
                size: payload.size,
                notes: payload.notes,
              }
            : item,
        ),
      );
      setEditingCartItemId(null);
      setSelectedProduct(null);
      setIsCartOpen(true);
      return;
    }

    addProductToCart(payload);
    setSelectedProduct(null);
  };

  const handleEditCartItem = (item: CartItem) => {
    const product = menuProducts.find((candidate) => candidate.id === item.productId);
    if (!product) return;

    setEditingCartItemId(item.id);
    setSelectedProduct(product);
    setIsCartOpen(false);
  };

  const handleCloseProductModal = () => {
    const returnToCart = Boolean(editingCartItemId);
    setSelectedProduct(null);
    setEditingCartItemId(null);
    setIsCartOpen(returnToCart);
  };

  const handleIncrement = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrement = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleOrderSubmit = (order: {
    customerName: string;
    orderType: OrderType;
    deliveryAddress?: string;
  }) => {
    if (cart.length === 0) return;

    const link = createWhatsAppOrderLink({ cart, ...order });
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const orderPayload = {
      clientName: order.customerName,
      orderType: order.orderType,
      address: order.deliveryAddress ?? "",
      items: cart,
      total,
    };

    void fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(orderPayload),
    }).catch((error: unknown) => {
      console.error("No se pudo registrar el pedido en Google Sheets.", error);
    });

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={isDarkMode && !selectedCategory ? "menu-app menu-app--dark" : "menu-app"}>
      <SplashScreen />
      <div className="menu-shell">
        <Header
          totalItems={totalItems}
          categoryName={selectedCategory?.name}
          onBack={handleBackToHome}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {selectedCategory ? (
          <CategoryView
            category={selectedCategory}
            products={filteredProducts}
            onAddToCart={handleAddSimpleProduct}
            onCustomize={handleCustomizeProduct}
            onBackToHome={handleBackToHome}
          />
        ) : (
          <main className="home-view">
            <HeroSlider
              products={promoProducts}
              onSelectPromos={handleSelectPromos}
            />
            <CategoryGrid
              categories={menuCategories}
              products={menuProducts}
              onSelect={handleSelectCategory}
              onCustomize={handleCustomizeProduct}
            />
            <section
              className="about-section"
              aria-labelledby="about-title"
            >
              <span className="section-eyebrow">PISA 62 · BARQUISIMETO</span>
              <h2 id="about-title">¿Quiénes somos?</h2>
              <p className="about-section__statement">
                Somos la mejor pizzería de Barquisimeto.
              </p>
              <address className="about-section__address">{address}</address>
              <div className="about-section__actions">
                <a
                  href="https://maps.app.goo.gl/RYcWBjJXAifwWbZU7"
                  target="_blank"
                  rel="noreferrer"
                  className="about-section__link"
                >
                  <img src="/images/map%20logo.svg" alt="" aria-hidden="true" />
                  Cómo llegar
                </a>
              </div>
              <div className="about-section__contact">
                <h3>Contáctanos</h3>
                <div className="about-section__social-links">
                  <a
                    href="https://wa.me/584149574838"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contáctanos por WhatsApp"
                  >
                    <img src="/images/ws%20logo.svg" alt="" />
                  </a>
                  <a
                    href="https://www.instagram.com/pisa62ca/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visita nuestro Instagram"
                  >
                    <img src="/images/ig%20logo.svg" alt="" />
                  </a>
                </div>
              </div>
            </section>
            <footer className="home-footer">
              <span>PISA 62 · Hecho para disfrutar</span>
              <button
                type="button"
                className="home-footer__theme-toggle"
                onClick={() => setIsDarkMode((previous) => !previous)}
                aria-label={isDarkMode ? "Activar modo claro" : "Activar modo noche"}
                aria-pressed={isDarkMode}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="home-footer__theme-icon"
                >
                  <path
                    d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                </svg>
              </button>
            </footer>
          </main>
        )}
      </div>

      {selectedProduct ? (
        <ProductModal
          key={`${selectedProduct.id}-${editingCartItemId ?? "new"}`}
          product={selectedProduct}
          initialCartItem={
            editingCartItemId
              ? cart.find((item) => item.id === editingCartItemId)
              : undefined
          }
          onClose={handleCloseProductModal}
          onConfirm={handleConfirmProductModal}
        />
      ) : null}

      <CartDrawer
        cart={cart}
        isCartOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onEdit={handleEditCartItem}
        onSubmitOrder={handleOrderSubmit}
      />
    </div>
  );
}
