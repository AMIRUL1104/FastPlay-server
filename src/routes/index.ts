import { Router } from "express";

import userRoutes from "./user.route.js";
import productRoutes from "./product.route.js";
import orderRoutes from "./order.route.js";
import aiRoutes from "./ai.route.js";
import cartRoutes from "./cart.route.js";
import dashboardRoutes from "./dashboard.route.js";

const router = Router();

// API Routes
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/ai", aiRoutes);
router.use("/cart", cartRoutes);

router.use("/dashboard", dashboardRoutes);

export default router;
