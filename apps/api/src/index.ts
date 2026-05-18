import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pool from "./db";
import { tenantMiddleware } from "./middleware/tenant";
import leadsRouter from "./routes/leads";
import contractorsRouter from "./routes/contractors";
import reviewsRouter from "./routes/reviews";
import tiledeskRouter from "./routes/tiledesk";
import twilioRouter from "./routes/twilio";
import voiceRouter from "./routes/voice";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (before tenant middleware to avoid DB check if not needed, 
// but actually we want to check DB)
app.get("/api/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "healthy", database: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", database: "error", timestamp: new Date().toISOString() });
  }
});

app.use(tenantMiddleware);

// API routes
app.use("/api/leads", leadsRouter);
app.use("/api/contractors", contractorsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/tiledesk", tiledeskRouter);
app.use("/api/twilio", twilioRouter);
app.use("/api/voice", voiceRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});