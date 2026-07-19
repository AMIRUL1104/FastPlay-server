import { client } from "./index.js";

import type { Cart } from "../types/cart.types.js";
import type { Order } from "../types/order.types.js";
import type { Product } from "../types/product.types.js";
import type { UserProfile } from "../types/user.types.js";

const db = client.db("FastPlay");

export const userCollection = db.collection("user");

export const userProfileCollection = db.collection<UserProfile>("userProfile");

export const sessionCollection = db.collection("session");

export const productsCollection = db.collection<Product>("products");

export const orderCollection = db.collection<Order>("orders");

export const cartCollection = db.collection<Cart>("carts");
