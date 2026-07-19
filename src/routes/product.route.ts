import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsForAdmin,
} from "../controllers/product.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/role.middleware.js";

const router = Router();

// Browse Products
router.get("/", getAllProducts);

// Featured Products
router.get("/featured", getFeaturedProducts);

// Products for Admin
router.get("/admin", verifyToken, verifyAdmin, getAllProductsForAdmin);

// Single Product
router.get("/:id", getProductById);

// Create Product
router.post("/", verifyToken, verifyAdmin, createProduct);

// Update Product
router.patch("/:id", verifyToken, verifyAdmin, updateProduct);

// Delete Product
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;

// GET    /api/products
// GET    /api/products/featured
// GET    /api/products/admin
// GET    /api/products/:id

// POST   /api/products

// PATCH  /api/products/:id

// DELETE /api/products/:id
