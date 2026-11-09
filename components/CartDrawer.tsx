"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import type { CartItem, OrderType } from "../types/menu";
import { formatCurrency } from "../utils/whatsapp";

type OrderDetails = {
  customerName: string;
  orderType: OrderType;
  deliveryAddress?: string;
};

type CartDrawerProps = {
  cart: CartItem[];
  isCartOpen: boolean;
  onClose: () => void;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onEdit: (item: CartItem) => void;
  onSubmitOrder: (order: OrderDetails) => void;
};

export function CartDrawer({
  cart,
  isCartOpen,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onEdit,
  onSubmitOrder,
}: CartDrawerProps) {
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isOrderDetailsClosing, setIsOrderDetailsClosing] = useState(false);
  const isOrderDetailsOpenRef = useRef(false);
  const orderDetailsCloseTimerRef = useRef<number | null>(null);

  const closeOrderDetails = () => {
    if (!isOrderDetailsOpenRef.current) return;

    isOrderDetailsOpenRef.current = false;
    setIsOrderDetailsClosing(true);
    orderDetailsCloseTimerRef.current = window.setTimeout(() => {
      setIsOrderDetailsOpen(false);
      setIsOrderDetailsClosing(false);
      orderDetailsCloseTimerRef.current = null;
    }, 200);
  };

  useEffect(() => {
    const savedName = window.sessionStorage.getItem("pisa62-customer-name");
    if (savedName) setCustomerName(savedName);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOrderDetails();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (orderDetailsCloseTimerRef.current !== null) {
        window.clearTimeout(orderDetailsCloseTimerRef.current);
      }
    };
  }, []);

  const updateOrderDetailsOpen = (isOpen: boolean) => {
    if (!isOpen) {
      closeOrderDetails();
      return;
    }

    if (orderDetailsCloseTimerRef.current !== null) {
      window.clearTimeout(orderDetailsCloseTimerRef.current);
      orderDetailsCloseTimerRef.current = null;
    }
    isOrderDetailsOpenRef.current = true;
    setIsOrderDetailsClosing(false);
    setIsOrderDetailsOpen(true);
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const handleOrderSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = customerName.trim();
    const normalizedAddress = deliveryAddress.trim();
    if (
      cart.length === 0 ||
      !normalizedName ||
      !orderType
    ) {
      return;
    }

    window.sessionStorage.setItem("pisa62-customer-name", normalizedName);
    setCustomerName(normalizedName);
    onSubmitOrder({
      customerName: normalizedName,
      orderType,
      ...(orderType === "Delivery" ? { deliveryAddress: normalizedAddress } : {}),
    });
    updateOrderDetailsOpen(false);
  };

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-950/50 transition-opacity",
          isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-[28px] bg-white p-4 shadow-2xl transition-transform duration-200",
          isCartOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Tu pedido</p>
            <h3 className="text-xl font-bold text-slate-800">Carrito</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-2.5 py-1.5 text-sm font-medium text-slate-700"
          >
            Cerrar
          </button>
        </div>

        <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              Tu carrito está vacío.
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.productId}`} className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {[
                          item.size,
                          ...(item.pizzaFlavors ?? []),
                          ...item.modifiers,
                        ].filter(Boolean).join(" · ") || "Sin modificadores"}
                      </p>
                      {item.notes ? (
                        <p className="mt-1 text-xs text-slate-500">Nota: {item.notes}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="cart-item__actions">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Editar ${item.name}`}
                      className="cart-item__icon-action"
                    >
                      <img src="/images/lapiz%20logo.svg" alt="" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                      className="cart-item__icon-action"
                    >
                      <img src="/images/trash%20logo.svg" alt="" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.id)}
                      className="flex h-7 w-7 items-center justify-center text-lg text-slate-700"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-slate-700">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.id)}
                      className="flex h-7 w-7 items-center justify-center text-lg text-slate-700"
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      <img
                        src="/images/plus%20logo.svg"
                        alt=""
                        className="cart-quantity__plus"
                      />
                    </button>
                  </div>

                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-100 p-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-800">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={() => updateOrderDetailsOpen(true)}
          className={[
            "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition",
            cart.length > 0
              ? "bg-green-600 hover:bg-green-500"
              : "cursor-not-allowed bg-slate-300 text-slate-500",
          ].join(" ")}
        >
          <span>Pedir por</span>
          <img
            src="/images/ws%20logo.svg"
            alt="WhatsApp"
            className="h-5 w-5 object-contain"
          />
        </button>
      </aside>

      {isOrderDetailsOpen ? (
        <div
          className="order-checkout-backdrop"
          data-closing={isOrderDetailsClosing}
          onClick={() => updateOrderDetailsOpen(false)}
        >
          <form
            className="order-checkout"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-checkout-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleOrderSubmit}
          >
            <div className="order-checkout__header">
              <div>
                <span className="section-eyebrow">UN ÚLTIMO PASO</span>
                <h2 id="order-checkout-title">¿Cómo quieres tu pedido?</h2>
              </div>
              <button
                type="button"
                className="order-checkout__close"
                aria-label="Cerrar"
                onClick={() => updateOrderDetailsOpen(false)}
              >
                ×
              </button>
            </div>

            <label className="order-checkout__label" htmlFor="order-customer-name">
              Tu nombre
            </label>
            <input
              id="order-customer-name"
              type="text"
              autoComplete="name"
              autoFocus
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="¿A nombre de quién?"
              className="order-checkout__input"
            />

            <fieldset className="order-checkout__types">
              <legend className="order-checkout__label">Tipo de pedido</legend>
              <div className="order-checkout__type-options">
                {(["Delivery", "Pick Up", "Comer aquí"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={[
                      "order-checkout__type",
                      orderType === type ? "order-checkout__type--selected" : "",
                    ].join(" ")}
                    aria-pressed={orderType === type}
                    onClick={() => setOrderType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </fieldset>

            <div
              className="order-checkout__delivery"
              data-expanded={orderType === "Delivery"}
              aria-hidden={orderType !== "Delivery"}
            >
              <div className="order-checkout__delivery-inner">
                <label className="order-checkout__label" htmlFor="delivery-address">
                  Dirección o punto de referencia
                </label>
                <textarea
                  id="delivery-address"
                  rows={3}
                  disabled={orderType !== "Delivery"}
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Escribe la dirección completa para la entrega"
                  className="order-checkout__input order-checkout__textarea"
                />
                <p className="order-checkout__helper">
                  Opcional: Puedes dejarlo en blanco y compartir tu ubicación
                  directamente en el chat
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !customerName.trim() ||
                !orderType
              }
              className="order-checkout__submit"
            >
              Enviar pedido por WhatsApp
              <img src="/images/ws%20logo.svg" alt="" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
