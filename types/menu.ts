export type TeamCategoryId =
  | "barcelona"
  | "real-madrid"
  | "bayern-munich"
  | "espana"
  | "psg"
  | "inter-miami"
  | "chelsea";

export type Product = {
  id: string;
  nombre: string;
  equipo: string;
  categoria: TeamCategoryId;
  precio: number;
  imagen: string;
  tallas: string[];
  descripcion?: string;
};

export type TeamCategory = {
  id: TeamCategoryId | "all";
  name: string;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  team: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

export type OrderType = "Delivery" | "Retiro" | "Envío nacional";

export type ProductPayload = {
  productId: string;
  name: string;
  team: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
};
