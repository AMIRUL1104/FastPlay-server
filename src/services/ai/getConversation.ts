import { ObjectId } from "mongodb";

import type { Conversation } from "../../types/conversation.types.js";
import { conversationsCollection } from "../../database/collections.js";

export const getConversation = async (
  userId: string,
): Promise<Conversation | null> => {
  return conversationsCollection.findOne({
    "user.userId": new ObjectId(userId),
  });
};
