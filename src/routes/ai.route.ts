import { Router } from "express";

import { verifyToken } from "../middleware/auth.middleware.js";
import {
  chatWithAI,
  getConversationHistory,
} from "../controllers/chatWithAI.controller.js";

const router = Router();

// AI Chat
router.post("/chat", verifyToken, chatWithAI);
// Get User Conversation
router.get("/conversation", verifyToken, getConversationHistory);
export default router;
