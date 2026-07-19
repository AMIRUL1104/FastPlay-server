import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the .env file.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async (): Promise<void> => {
  try {
    await client.connect();

    // Ping the database to verify the connection
    await client.db("admin").command({ ping: 1 });

    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);

    process.exit(1);
  }
};

export { client };
export default connectDB;