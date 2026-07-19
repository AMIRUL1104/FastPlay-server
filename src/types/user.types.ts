import type { ObjectId } from "mongodb";

export type UserRole = "user" | "admin";

export interface UserProfile {
  _id: string;

  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;

  role: UserRole;
  isBlocked: boolean;

  emailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserSnapshot {
  userId: ObjectId;
  name: string;
  email: string;
}
