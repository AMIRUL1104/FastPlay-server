import type { ConversationMessage } from "../../types/conversation.types.js";
import type { Product } from "../../types/product.types.js";
import { generateText } from "./gemini.js";

export const generateResponse = async (
  userMessage: string,
  products: Product[],
  previousMessages: ConversationMessage[],
): Promise<string> => {
  const recentConversation = previousMessages
    .map(
      (message) =>
        `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`,
    )
    .join("\n");

  const prompt = `
You are FastPlay AI, a helpful shopping assistant.

The following is the recent conversation history.

${recentConversation || "No previous conversation."}

----------------------------

Current User Message:

"${userMessage}"

----------------------------

Matching Products:

${JSON.stringify(products, null, 2)}

----------------------------

Instructions:

- Answer based ONLY on the provided products.
- Use the recent conversation to understand the user's context.
- If the user refers to "this", "that", "another one", or similar words, use the conversation history to understand what they mean.
- Recommend the most relevant products.
- Mention product names and prices when appropriate.
- If no matching products exist, politely inform the user.
- Keep the response concise and natural.
- Do not invent products or prices.
- Reply in the same language the user used.

If the user asks a question that is unrelated to shopping or FastPlay products,
politely explain that you can only help with product search,
recommendations, comparisons, and shopping-related questions.
`;

  return await generateText(prompt);
};
