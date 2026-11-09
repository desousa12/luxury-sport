export type ProductModifier = {
  id: string;
  name: string;
  extraPrice?: number;
};

export type ProductSize = {
  id: string;
  label: string;
  price: number;
};

export type MenuCategoryId =
  | "pizza"
  | "ice-cream"
  | "drinks"
  | "promos";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  carouselImage?: string;
  category: MenuCategoryId;
  modifiers?: ProductModifier[];
  sizes?: ProductSize[];
  ingredients?: ProductModifier[];
  pizzaCount?: number;
  pizzaSize?: string;
  pizzaHalfAndHalf?: boolean;
};

export type MenuCategory = {
  id: MenuCategoryId;
  name: string;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  selectedModifierIds: string[];
  pizzaFlavors?: string[];
  selectedPizzaFlavorIds?: string[];
  size?: string;
  notes?: string;
  image: string;
};

export type OrderType = "Delivery" | "Pick Up" | "Comer aquí";

export type ProductPayload = {
  productId: string;
  name: string;
  price: number;
  image: string;
  modifiers: string[];
  selectedModifierIds: string[];
  pizzaFlavors?: string[];
  selectedPizzaFlavorIds?: string[];
  size?: string;
  notes: string;
};
