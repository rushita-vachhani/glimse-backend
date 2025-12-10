import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import path from "path";
import multer from "multer"; 


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import { protect, authorize } from "./middleware/authMiddleware.js";


const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
// Increase the limit for JSON payloads and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("dev"));

// Swagger docs
const swaggerDocument = YAML.load(
  path.join(process.cwd(), "docs/openapi.yaml")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/password", passwordRoutes);
app.get("/health", (req, res) => res.json({ ok: true }));

app.get('/api/admin-panel', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Panel!' });
});

// ----- Global error handler (keeps invalid image format as 400 JSON) -----
app.use((err, req, res, next) => {
  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  // Handle our custom fileFilter error
  if (err.message.includes("Invalid file format")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Server error" });
});

export default app;
