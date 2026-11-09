"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { menuProducts } from "../data/menuData";
import type { CartItem, Product, ProductPayload } from "../types/menu";
import { formatCurrency } from "../utils/whatsapp";
import { PizzaFlavorPicker } from "./PizzaFlavorPicker";

type ProductModalProps = {
  product: Product | null;
  initialCartItem?: CartItem;
  onClose: () => void;
  onConfirm: (payload: ProductPayload) => void;
};

export function ProductModal({
  product,
  initialCartItem,
  onClose,
  onConfirm,
}: ProductModalProps) {
  const [selectedModifierIds, setSelectedModifierIds] = useState<string[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedPizzaFlavorIds, setSelectedPizzaFlavorIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeModal = () => {
    if (closeTimerRef.current !== null) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onClose();
      closeTimerRef.current = null;
    }, 200);
  };

  useEffect(() => {
    if (!product) return;

    setSelectedModifierIds(initialCartItem?.selectedModifierIds ?? []);
    setSelectedSizeId(
      product.sizes?.find((size) => size.label === initialCartItem?.size)?.id ?? "",
    );
    setSelectedPizzaFlavorIds(
      Array.from(
        { length: product.pizzaCount ?? (product.pizzaHalfAndHalf ? 2 : 0) },
        (_, index) => initialCartItem?.selectedPizzaFlavorIds?.[index] ?? "",
      ),
    );
    setNotes(initialCartItem?.notes ?? "");
  }, [product?.id, initialCartItem?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const availableModifiers = useMemo(() => {
    if (!product) return [];
    return [
      ...(product.modifiers ?? []),
      ...(product.ingredients ?? []),
    ];
  }, [product]);

  if (!product) return null;

  const isPromo = Boolean(product.pizzaCount);
  const selectedModifiers = availableModifiers.filter((modifier) =>
    selectedModifierIds.includes(modifier.id),
  );
  const selectedSize = product.sizes?.find((size) => size.id === selectedSizeId);
  const extraPrice = selectedModifiers.reduce((sum, modifier) => {
    const isIngredient = product.ingredients?.some(
      (ingredient) => ingredient.id === modifier.id,
    );
    return sum + (isIngredient ? 0 : modifier.extraPrice ?? 0);
  }, 0);
  const finalPrice = (selectedSize?.price ?? product.price) + extraPrice;
  const flavorCount = product.pizzaCount ?? (product.pizzaHalfAndHalf ? 2 : 0);
  const hasSelectedAllFlavors =
    selectedPizzaFlavorIds.length === flavorCount &&
    selectedPizzaFlavorIds.every(Boolean);
  const hasDistinctHalfFlavors =
    !product.pizzaHalfAndHalf ||
    new Set(selectedPizzaFlavorIds).size === 2;
  const canConfirm =
    (!product.sizes?.length || Boolean(selectedSize)) &&
    (!flavorCount || (hasSelectedAllFlavors && hasDistinctHalfFlavors));

  const toggleModifier = (modifierId: string) => {
    setSelectedModifierIds((previous) =>
      previous.includes(modifierId)
        ? previous.filter((id) => id !== modifierId)
        : [...previous, modifierId],
    );
  };

  const handlePizzaFlavorChange = (flavorIds: string[]) => {
    const wasComplete =
      selectedPizzaFlavorIds.length === flavorCount &&
      selectedPizzaFlavorIds.every(Boolean);
    const isComplete =
      flavorIds.length === flavorCount && flavorIds.every(Boolean);

    setSelectedPizzaFlavorIds(flavorIds);

    if (product.pizzaCount && flavorCount > 1 && !wasComplete && isComplete) {
      window.requestAnimationFrame(() => {
        confirmButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  const confirmProduct = () => {
    if (closeTimerRef.current !== null) return;

    const flavorNames = selectedPizzaFlavorIds.map((flavorId) =>
      availableFlavorProducts.find((flavor) => flavor.id === flavorId)?.name ?? "",
    );
    let pizzaFlavors: string[] | undefined;

    if (product.pizzaHalfAndHalf) {
      pizzaFlavors = [
        `Pizza mitad y mitad: Mitad 1 (${flavorNames[0]}) / Mitad 2 (${flavorNames[1]})`,
      ];
    } else if (product.pizzaCount) {
      pizzaFlavors = flavorNames.map(
        (flavorName, index) =>
          `Pizza ${index + 1} (${product.pizzaSize}): ${flavorName}`,
      );
    }

    const payload: ProductPayload = {
      productId: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      modifiers: selectedModifiers.map((modifier) => modifier.name),
      selectedModifierIds,
      pizzaFlavors,
      selectedPizzaFlavorIds,
      size: product.pizzaCount
        ? `${product.pizzaCount} × ${product.pizzaSize ?? "Pizza"}`
        : selectedSize?.label,
      notes,
    };

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onConfirm(payload);
      closeTimerRef.current = null;
    }, 200);
  };

  return (
    <div
      className="product-modal-backdrop"
      data-closing={isClosing}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        className={[
          "product-modal",
          isPromo ? "product-modal--promo" : "",
          isClosing ? "product-modal--closing" : "",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={isPromo ? `Configurar ${product.name}` : undefined}
        aria-labelledby={isPromo ? undefined : "product-modal-title"}
      >
        <div className="product-modal__image-wrap">
          <img
            src={isPromo ? product.carouselImage ?? product.image : product.image}
            alt={product.name}
            className="product-modal__image"
          />
          <button
            type="button"
            onClick={closeModal}
            aria-label="Cerrar"
            className="product-modal__close"
          >
            ✕
          </button>
        </div>

        <div className="product-modal__content">
          {isPromo ? (
            <fieldset className="product-modal__section">
              <legend>Elige el sabor de tus pizzas</legend>
              <PizzaFlavorPicker
                key={`${product.id}-${initialCartItem?.id ?? "new"}`}
                mode={product.pizzaHalfAndHalf ? "half-and-half" : "multi-pizza"}
                count={flavorCount}
                selectedFlavorIds={selectedPizzaFlavorIds}
                onChange={handlePizzaFlavorChange}
              />
            </fieldset>
          ) : (
            <>
              <div>
                <h3 id="product-modal-title">{product.name}</h3>
                <p className="product-modal__description">{product.description}</p>
              </div>

              {product.sizes?.length ? (
                <fieldset className="product-modal__section">
                  <legend>Tamaño <span>Obligatorio</span></legend>
                  <div className="product-modal__options">
                    {product.sizes.map((size) => (
                      <label key={size.id} className="product-option">
                        <input
                          type="radio"
                          name={`size-${product.id}`}
                          value={size.id}
                          checked={selectedSizeId === size.id}
                          onChange={() => setSelectedSizeId(size.id)}
                        />
                        <span>{size.label}</span>
                        <strong>{formatCurrency(size.price)}</strong>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {product.pizzaSize ? (
                <div className="product-modal__locked-size">
                  <span>Tamaño incluido</span>
                  <strong>{product.pizzaSize}</strong>
                  <span aria-hidden="true">🔒</span>
                </div>
              ) : null}

              {flavorCount > 0 ? (
                <fieldset className="product-modal__section">
                  <legend>
                    {product.pizzaHalfAndHalf
                      ? "Combina dos sabores distintos"
                      : "Elige el sabor de tus pizzas"}
                    <span>Obligatorio</span>
                  </legend>
                  <PizzaFlavorPicker
                    key={`${product.id}-${initialCartItem?.id ?? "new"}`}
                    mode={product.pizzaHalfAndHalf ? "half-and-half" : "multi-pizza"}
                    count={flavorCount}
                    selectedFlavorIds={selectedPizzaFlavorIds}
                    onChange={handlePizzaFlavorChange}
                  />
                </fieldset>
              ) : null}

              {product.ingredients?.length ? (
                <fieldset className="product-modal__section">
                  <legend>Ingredientes</legend>
                  <div className="product-modal__ingredient-grid">
                    {product.ingredients.map((ingredient) => (
                      <label key={ingredient.id} className="product-ingredient">
                        <input
                          type="checkbox"
                          checked={selectedModifierIds.includes(ingredient.id)}
                          onChange={() => toggleModifier(ingredient.id)}
                        />
                        {ingredient.name}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {product.modifiers?.length ? (
                <fieldset className="product-modal__section">
                  <legend>Personaliza tu pedido</legend>
                  <div className="product-modal__options">
                    {product.modifiers.map((modifier) => (
                      <label key={modifier.id} className="product-option">
                        <span>
                          <input
                            type="checkbox"
                            checked={selectedModifierIds.includes(modifier.id)}
                            onChange={() => toggleModifier(modifier.id)}
                          />
                          {modifier.name}
                        </span>
                        {modifier.extraPrice ? (
                          <strong>+{formatCurrency(modifier.extraPrice)}</strong>
                        ) : null}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className="product-modal__notes">
                <label htmlFor="product-notes">Notas especiales</label>
                <textarea
                  id="product-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="Ej: sin cebolla, bien cocido..."
                />
              </div>

              <div className="product-modal__total">
                {product.sizes?.length && !selectedSize ? (
                  <p>Selecciona un tamaño para continuar.</p>
                ) : null}
                {flavorCount > 0 && !hasSelectedAllFlavors ? (
                  <p>Elige todos los sabores para continuar.</p>
                ) : null}
                {product.pizzaHalfAndHalf && !hasDistinctHalfFlavors ? (
                  <p>Elige dos sabores diferentes.</p>
                ) : null}
                {selectedSize && extraPrice > 0 ? (
                  <div>
                    <span>Extras</span>
                    <span>{formatCurrency(extraPrice)}</span>
                  </div>
                ) : null}
                <div className="product-modal__total-line">
                  <span>Total</span>
                  <strong>{formatCurrency(finalPrice)}</strong>
                </div>
              </div>
            </>
          )}

          <button
            ref={confirmButtonRef}
            type="button"
            disabled={!canConfirm}
            onClick={confirmProduct}
            className="product-modal__confirm"
          >
            {canConfirm
              ? initialCartItem
                ? "Guardar cambios"
                : "Agregar al carrito"
              : "Completa tu selección"}
          </button>
        </div>
      </div>
    </div>
  );
}

const availableFlavorProducts = menuProducts.filter(
  (item) =>
    item.category === "pizza" &&
    item.id !== "pizza-personalizada" &&
    item.id !== "pizza-combinada",
);
