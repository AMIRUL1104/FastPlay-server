import type { ObjectId } from "mongodb";

// ===== আগের টাইপগুলো অপরিবর্তিত রাখা হলো =====
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

// ===== নতুন Schema: userProfileCollection-এর জন্য =====
export interface UserProfileDetail {
  _id?: ObjectId;
  userId: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  district: string;
  area: string;
  avatarUrl: string | null;
  role: UserRole;
  memberSince: Date;
}
