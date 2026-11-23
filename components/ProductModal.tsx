"use client";

import { useEffect, useRef, useState } from "react";

import type { CartItem, Product, ProductPayload } from "../types/menu";
import { formatCurrency } from "../utils/whatsapp";

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
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
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
    setSelectedSize(initialCartItem?.size ?? "");
    setQuantity(initialCartItem?.quantity ?? 1);
  }, [product?.id, initialCartItem?.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  if (!product) return null;

  const canConfirm =
    Boolean(selectedSize) &&
    product.tallas.includes(selectedSize) &&
    quantity > 0;

  const confirmProduct = () => {
    if (!canConfirm || closeTimerRef.current !== null) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      onConfirm({
        productId: product.id,
        name: product.nombre,
        team: product.equipo,
        price: product.precio,
        image: product.imagen,
        quantity,
        size: selectedSize,
      });
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
        className={`product-modal${isClosing ? " product-modal--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="product-modal__image-wrap">
          <img
            src={product.imagen}
            alt={product.nombre}
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
          <div>
            <h3 id="product-modal-title">{product.nombre}</h3>
            <p className="product-modal__description">{product.equipo}</p>
            <strong className="product-modal__price">{formatCurrency(product.precio)}</strong>
          </div>

          <fieldset className="product-modal__section">
            <legend>Talla <span>Obligatorio</span></legend>
            <div className="product-modal__sizes">
              {product.tallas.map((size) => (
                <label
                  key={size}
                  className={`product-modal__size${selectedSize === size ? " product-modal__size--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name={`size-${product.id}`}
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="product-modal__quantity">
            <span>Cantidad</span>
            <div>
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-modal__total">
            {!selectedSize ? <p>Selecciona una talla para continuar.</p> : null}
            <div className="product-modal__total-line">
              <span>Total</span>
              <strong>{formatCurrency(product.precio * quantity)}</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={!canConfirm}
            onClick={confirmProduct}
            className="product-modal__confirm"
          >
            {initialCartItem ? "Guardar cambios" : "Agregar al Carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
