"use client";

import { useEffect, useMemo, useState } from "react";

import { products, teamCategories } from "../data/menuData";
import type {
  CartItem,
  OrderType,
  Product,
  ProductPayload,
} from "../types/menu";
import { createWhatsAppOrderLink } from "../utils/whatsapp";
import { CartDrawer } from "./CartDrawer";
import { CategoryTabs } from "./CategoryTabs";
import { Header } from "./Header";
import { ProductModal } from "./ProductModal";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { SplashScreen } from "./SplashScreen";

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<"idle" | "sending" | "sent" | "error" | "not-configured">("idle");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("luxury-sport-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((current) => {
      const next = !current;
      window.localStorage.setItem("luxury-sport-theme", next ? "dark" : "light");
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categoria === selectedCategory;
      const matchesSearch =
        !query ||
        product.nombre.toLowerCase().includes(query) ||
        product.equipo.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const addProductToCart = (payload: ProductPayload) => {
    const newItem: CartItem = {
      id: `${payload.productId}-${Date.now()}`,
      productId: payload.productId,
      name: payload.name,
      team: payload.team,
      price: payload.price,
      quantity: payload.quantity,
      size: payload.size,
      image: payload.image,
    };

    setCart((previousCart) => {
      const existingItemIndex = previousCart.findIndex(
        (item) =>
          item.productId === payload.productId &&
          item.size === payload.size,
      );

      if (existingItemIndex === -1) return [...previousCart, newItem];

      return previousCart.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + payload.quantity,
            }
          : item,
      );
    });
  };

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
                team: payload.team,
                price: payload.price,
                quantity: payload.quantity,
                image: payload.image,
                size: payload.size,
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
    const product = products.find((candidate) => candidate.id === item.productId);
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

  const handleOrderSubmit = async (order: {
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

    if (GOOGLE_SHEETS_URL) {
      setSheetStatus("sending");
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(orderPayload),
        });
        setSheetStatus("sent");
      } catch (error: unknown) {
        console.error("No se pudo registrar el pedido en Google Sheets.", error);
        setSheetStatus("error");
      }
    } else {
      setSheetStatus("not-configured");
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={isDark ? "menu-app menu-app--dark" : "menu-app"}>
      <SplashScreen />
      <div className="menu-shell">
        <Header
          totalItems={totalItems}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="catalog-view">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar equipo o camiseta..."
          />
          <CategoryTabs
            categories={teamCategories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <section className="product-grid" aria-live="polite">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={handleCustomizeProduct}
              />
            ))}
          </section>
          {filteredProducts.length === 0 ? (
            <div className="empty-category">
              No encontramos camisetas con esa búsqueda.
            </div>
          ) : null}
        </main>
      </div>

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        aria-pressed={isDark}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" fill="currentColor" />
          </svg>
        )}
      </button>

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
        sheetStatus={sheetStatus}
      />
    </div>
  );
}
