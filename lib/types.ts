export type Role = "seller" | "manager" | "admin";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at: string;
};

export type Sale = {
  id: string;
  product_id: string;
  seller_id: string;
  price: number;
  created_at: string;
};
