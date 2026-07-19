import { ObjectId } from "mongodb";
import type { UserSnapshot } from "./user.types.js";
import type { CartItem } from "./cart.types.js";

export type OrderStatus = "pending" | "accepted" | "rejected";

export interface OrderUserSnapshot extends UserSnapshot {
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
}

export interface Order {
  _id?: ObjectId;

  user: OrderUserSnapshot;

  shippingAddress: ShippingAddress;

  products: CartItem[];

  totalPrice: number;

  paymentMethod: "Cash On Delivery";

  status: OrderStatus;

  createdAt: Date;
  updatedAt: Date;
}
