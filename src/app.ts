import routes from "./routes/index.js";
import "dotenv/config";
import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL!],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);
// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FastPlay Server 🚀",
  });
});

export default app;
