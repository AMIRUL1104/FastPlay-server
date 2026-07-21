import { Router } from "express";

import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin, verifyUser } from "../middleware/role.middleware.js";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

// User Dashboard
// router.get("/user", verifyToken, verifyUser, getUserDashboard);

// Admin Dashboard
router.get("/admin", verifyToken, verifyAdmin, getAdminDashboard);

export default router;
