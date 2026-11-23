import type { CartItem, OrderType } from "../types/menu";

export const WHATSAPP_PHONE_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ?? "584149574838";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const createWhatsAppOrderLink = ({
  phoneNumber = WHATSAPP_PHONE_NUMBER,
  cart,
  customerName,
  orderType,
  deliveryAddress,
}: {
  phoneNumber?: string;
  cart: CartItem[];
  customerName: string;
  orderType: OrderType;
  deliveryAddress?: string;
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const normalizedName = customerName.trim();
  const normalizedAddress = deliveryAddress?.trim();

  if (!normalizedName) {
    throw new Error("Se requiere el nombre del cliente para crear el pedido.");
  }

  const lines = [
    `Hola, soy ${normalizedName} y quiero realizar el siguiente pedido de camisetas:`,
    "",
    `📦 *Entrega: ${orderType === "Delivery" ? "Delivery" : orderType}*`,
    ...(orderType === "Delivery"
      ? [
          `🏠 Dirección: ${
            normalizedAddress ||
            "Se enviará ubicación por chat de WhatsApp"
          }`,
        ]
      : []),
    "",
    ...cart.map((item) => {
      return `• ${item.quantity}x ${item.name} (${item.team}) - Talla ${item.size} - ${formatCurrency(item.price * item.quantity)}`;
    }),
    "",
    `💳 Total: ${formatCurrency(total)}`,
  ];

  const message = lines.join("\n");
  const normalizedPhone = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
};
