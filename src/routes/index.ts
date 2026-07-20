import { Router } from "express";

import userRoutes from "./user.route.js";
import productRoutes from "./product.route.js";
// import orderRoutes from "./order.route.js";
// import conversationRoutes from "./conversation.route.js";
import cartRoutes from "./cart.route.js";

const router = Router();

// API Routes
router.use("/users", userRoutes);
router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);
// router.use("/conversations", conversationRoutes);
router.use("/cart", cartRoutes);

export default router;
