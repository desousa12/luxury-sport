import type { CartItem, OrderType } from "../types/menu";

export const WHATSAPP_PHONE_NUMBER = "584149574838";

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
    `Hola, mi nombre es ${normalizedName} y quiero realizar el siguiente pedido:`,
    "",
    `📦 *Tipo de pedido: ${orderType}*`,
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
      const sizeText = item.size ? ` · Tamaño: ${item.size}` : "";
      const modifierText = item.modifiers.length > 0 ? ` (${item.modifiers.join(", ")})` : "";
      const flavorText = item.pizzaFlavors?.length
        ? `\n   🍕 Sabores: ${item.pizzaFlavors.join("; ")}`
        : "";
      const noteText = item.notes ? `\n   📝 Nota: ${item.notes}` : "";
      return `• ${item.name}${sizeText} x${item.quantity}${modifierText} - ${formatCurrency(item.price * item.quantity)}${flavorText}${noteText}`;
    }),
    "",
    `💳 Total: ${formatCurrency(total)}`,
  ];

  const message = lines.join("\n");
  const normalizedPhone = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
};
