import { ObjectId } from "mongodb";
import type { UserSnapshot } from "./user.types.js";

export type MessageRole = "user" | "assistant";

export interface ConversationMessage {
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  _id?: ObjectId;

  user: UserSnapshot;

  messages: ConversationMessage[];

  createdAt: Date;
  updatedAt: Date;
}
