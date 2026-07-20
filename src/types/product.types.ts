import { ObjectId } from "mongodb";

export type ProductCategory =
  | "football"
  | "cricket"
  | "badminton"
  | "gym-equipment";

export interface Product {
  _id?: ObjectId;

  name: string;
  slug: string;

  category: ProductCategory;
  brand: string;

  price: number;
  stock: number;

  description: string;

  image: string;

  featured: boolean;

  createdAt: Date;
  updatedAt: Date;
}
