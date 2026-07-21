import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  acceptOrder,
  rejectOrder,
  cancelOrder,
} from "../controllers/order.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/role.middleware.js";

const router = Router();

// My Orders
router.get("/", verifyToken, getMyOrders);

// All Orders (Admin)
router.get("/admin", verifyToken, verifyAdmin, getAllOrders);

// Single Order
router.get("/:id", verifyToken, getOrderById);

// Create Order
router.post("/", verifyToken, createOrder);

// Accept Order
router.patch("/:id/accept", verifyToken, verifyAdmin, acceptOrder);

// Reject Order
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectOrder);

// cancel order
router.patch("/:id/cancel", verifyToken, cancelOrder);

export default router;
