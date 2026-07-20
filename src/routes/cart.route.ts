import { Router } from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Get User Cart
router.get("/", verifyToken, getCart);

// Add Product to Cart
router.post("/", verifyToken, addToCart);

// Update Cart Item Quantity
router.patch("/:productId", verifyToken, updateCartItem);

// Remove Single Cart Item
router.delete("/:productId", verifyToken, removeCartItem);

// Clear Entire Cart
router.delete("/", verifyToken, clearCart);

export default router;
