import { Router } from "express";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyUser } from "../middleware/role.middleware.js";
import {
  createUser,
  deleteUser,
  getUserProfile,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

// Create User when a new user signs up
router.post("/", verifyToken, createUser);

// Get User by userId
router.get("/", verifyToken, getUserProfile);

// Get All Users for admin
router.get("/admin", verifyToken, getUsers);

// Update User by profile data id
router.patch("/", verifyToken, updateUser);

// Delete User by userId
router.delete("/:id", verifyToken, verifyUser, deleteUser);

export default router;
