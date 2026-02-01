import express from "express";
import cors from "cors";
const app = express();
import healthCheckRouter from "./routes/healthCheck.routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
   cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);

app.get("/", (req, res) => {
   res.send("Hello, World!");
});

export default app;
