import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./server/routes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "CallForge server is running",
  });
});

app.use("/api", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: "API route not found",
  });
});

app.listen(PORT, () => {
  console.log(`CallForge server running on http://localhost:${PORT}`);
});