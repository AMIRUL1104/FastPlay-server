import { Router } from "express";

import userRoutes from "./user.route.js";
// import postRoutes from "./post.route.js";

const router = Router();

// API Routes
router.use("/users", userRoutes);
// router.use("/posts", postRoutes);

export default router;
