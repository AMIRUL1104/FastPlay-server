import { client } from "./index.js";

const db = client.db("FastPlay");

// Collections
export const userCollection = db.collection("user");

export const userProfileCollection = db.collection("userProfile");

export const sessionCollection = db.collection("session");
