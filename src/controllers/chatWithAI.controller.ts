import type { Response } from "express";

import type { AuthRequest } from "../types/auth.types.js";

import { getConversation } from "../services/ai/getConversation.js";
import { saveMessage } from "../services/ai/saveMessage.js";
import { extractIntent } from "../services/ai/extractIntent.js";
import { generateResponse } from "../services/ai/generateResponse.js";
import { searchProducts } from "../services/searchproducts.js";
import { ObjectId } from "mongodb";

export const chatWithAI = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;
    // console.log(user);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    const message = req.body.message;

    // console.log(message);

    if (!message) {
      res.status(400).json({
        success: false,
        message: "Message is required.",
      });
      return;
    }

    const conversation = await getConversation(user._id);
    // console.log(conversation);

    const recentMessages = conversation?.messages.slice(-10) ?? [];
    // console.log(recentMessages);
    const filters = await extractIntent(message);
    // console.log(filters);
    const products = await searchProducts(filters);
    // console.log(products);
    const answer = await generateResponse(message, products, recentMessages);
    // console.log(answer);
    const userSnapshot = {
      userId: new ObjectId(user._id),
      name: user.name,
      email: user.email,
    };

    await saveMessage(userSnapshot, [
      {
        role: "user",
        content: message,
        createdAt: new Date(),
      },
      {
        role: "assistant",
        content: answer,
        createdAt: new Date(),
      },
    ]);

    res.status(200).json({
      success: true,
      answer,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const getConversationHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    const conversation = await getConversation(user._id);

    if (!conversation) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: conversation.messages,
    });
  } catch (error) {
    console.error("GET /api/ai/conversation:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation history.",
    });
  }
};
