import { ObjectId } from "mongodb";

import { conversationsCollection } from "../../database/collections.js";
import type { ConversationMessage } from "../../types/conversation.types.js";

import type { UserSnapshot } from "../../types/user.types.js";

export const saveMessage = async (
  user: UserSnapshot,
  messages: ConversationMessage[],
): Promise<void> => {
  const now = new Date();

  await conversationsCollection.updateOne(
    {
      "user.userId": user.userId,
    },
    {
      $setOnInsert: {
        user,
        createdAt: now,
      },
      $push: {
        messages: {
          $each: messages,
        },
      },
      $set: {
        updatedAt: now,
      },
    },
    {
      upsert: true,
    },
  );
};
