import app from "./app.js";
import "dotenv/config";
import connectDB from "./database/index.js";
// import connectDB from "./database.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
==================================================
🚀 BookBridge Server is running successfully
🌐 URL   : http://localhost:${PORT}
📦 Environment : ${process.env.NODE_ENV || "development"}
==================================================
`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();