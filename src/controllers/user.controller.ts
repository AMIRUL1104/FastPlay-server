import type { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { userProfileCollection } from "../database/collections.js";

import type { AuthRequest } from "../types/auth.types.js";

// Create User
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const userData = {
      userId: req.user!._id,
      fullName: req.user!.name,
      email: req.user!.email,
      phoneNumber: "",
      district: "",
      area: "",
      avatarUrl: null,
      role: req.user!.role,
      memberSince: new Date(),
    };

    const result = await userProfileCollection.insertOne(userData);
    if (result.insertedId) {
      res.status(201).json({
        success: true,
        message: "User created successfully.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create user.",
      });
    }
  } catch (error) {
    console.error("Failed to create user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user.",
    });
  }
};

// Get User
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    const user = await userProfileCollection.findOne({
      userId: userId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Failed to get user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get user.",
    });
  }
};

// Get All Users for admin . this api will be call when admin search, filter, sort, and pagination

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const search = (req.query.search as string) || "";
    const sort = (req.query.sort as string) || "newest";
    const role = (req.query.role as string) || "";
    const status = (req.query.status as string) || "";

    const query: Record<string, unknown> = {};

    // Search: fullName or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Role filter: "admin" | "user"
    if (role && role !== "all") {
      query.role = role;
    }

    // Status filter: "active" | "suspended"
    // Assumes UserProfile has an `isBlocked` boolean field
    // if (status && status !== "all") {
    //   query.isBlocked = status === "suspended";
    // }

    // Sort direction — goes into .sort(), NOT into the query object
    const sortDirection = sort === "oldest" ? 1 : -1;

    const [users, total] = await Promise.all([
      userProfileCollection
        .find(query)
        .sort({ updatedAt: sortDirection })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      userProfileCollection.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page, // now a number, not a string
    });
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get users.",
    });
  }
};

// Update User
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }
    const updatedUserData = {
      ...req.body,
      updatedAt: new Date(),
    };
    const result = await userProfileCollection.updateOne(
      { userId: userId },
      { $set: updatedUserData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Your Profile updated successfully.",
      });
    }
  } catch (error) {
    console.error("Failed to update user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id.",
      });
    }

    const result = await userProfileCollection.deleteOne({
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};
