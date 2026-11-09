"use client";

import { useState } from "react";

import { menuProducts } from "../data/menuData";

const flavors = menuProducts.filter(
  (product) =>
    product.category === "pizza" &&
    product.id !== "pizza-personalizada" &&
    product.id !== "pizza-combinada",
);

type PizzaFlavorPickerProps = {
  mode: "multi-pizza" | "half-and-half";
  count: number;
  selectedFlavorIds: string[];
  onChange: (flavorIds: string[]) => void;
};

export function PizzaFlavorPicker({
  mode,
  count,
  selectedFlavorIds,
  onChange,
}: PizzaFlavorPickerProps) {
  const [activeSlot, setActiveSlot] = useState(0);
  const halfAndHalf = mode === "half-and-half";

  const selectFlavor = (flavorId: string) => {
    const updatedIds = Array.from({ length: count }, (_, index) =>
      selectedFlavorIds[index] ?? "",
    );
    updatedIds[activeSlot] = flavorId;
    onChange(updatedIds);

    if (halfAndHalf) {
      setActiveSlot(activeSlot === 0 ? 1 : 0);
      return;
    }

    const nextEmptySlot = updatedIds.findIndex((selectedId) => !selectedId);
    if (nextEmptySlot !== -1) setActiveSlot(nextEmptySlot);
  };

  return (
    <div className="pizza-flavor-picker">
      <div className="pizza-flavor-picker__slots" role="group" aria-label="Pizza a configurar">
        {Array.from({ length: count }, (_, index) => {
          const selectedFlavor = flavors.find(
            (flavor) => flavor.id === selectedFlavorIds[index],
          );
          const slotName = halfAndHalf ? `Mitad ${index + 1}` : `Pizza ${index + 1}`;

          return (
            <button
              key={slotName}
              type="button"
              className={[
                "pizza-flavor-picker__slot",
                activeSlot === index ? "pizza-flavor-picker__slot--active" : "",
                selectedFlavor ? "pizza-flavor-picker__slot--selected" : "",
              ].join(" ")}
              onClick={() => setActiveSlot(index)}
              aria-pressed={activeSlot === index}
            >
              <span>{slotName}</span>
              <strong>{selectedFlavor?.name ?? "Elige un sabor"}</strong>
            </button>
          );
        })}
      </div>

      <div className="pizza-flavor-picker__grid">
        {flavors.map((flavor) => {
          const selectedCount = selectedFlavorIds.filter(
            (selectedId) => selectedId === flavor.id,
          ).length;
          const isSelected = selectedCount > 0;
          const isComplete =
            selectedFlavorIds.length === count && selectedFlavorIds.every(Boolean);
          const isDuplicateHalf =
            halfAndHalf &&
            activeSlot === 1 &&
            Boolean(selectedFlavorIds[0]) &&
            selectedFlavorIds[0] === flavor.id;

          return (
            <button
              key={flavor.id}
              type="button"
              className={[
                "pizza-flavor-card",
                isSelected ? "pizza-flavor-card--selected" : "",
                isSelected && isComplete ? "pizza-flavor-card--complete" : "",
              ].join(" ")}
              onClick={() => selectFlavor(flavor.id)}
              disabled={isDuplicateHalf}
              aria-pressed={isSelected}
            >
              <span className="pizza-flavor-card__image">
                <img src={flavor.image} alt="" loading="lazy" />
              </span>
              <span className="pizza-flavor-card__copy">
                <strong>{flavor.name}</strong>
                <span>{flavor.description}</span>
              </span>
              {selectedCount > 0 && !halfAndHalf ? (
                <span className="pizza-flavor-card__count">
                  x{selectedCount}
                </span>
              ) : null}
              {isSelected && halfAndHalf ? (
                <span className="pizza-flavor-card__check" aria-label="Seleccionada">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
