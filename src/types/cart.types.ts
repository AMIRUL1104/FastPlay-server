import { ObjectId } from "mongodb";
import type { ProductCategory } from "./product.types.js";
import type { UserSnapshot } from "./user.types.js";

export interface CartItem {
  productId: ObjectId;

  name: string;
  brand: string;
  category: ProductCategory;

  image: string;

  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id?: ObjectId;

  user: UserSnapshot;

  items: CartItem[];

  totalItems: number;
  totalPrice: number;

  updatedAt: Date;
}
