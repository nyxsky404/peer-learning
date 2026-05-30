import dotenv from "dotenv";
// import authRoutes from "./routers/authRoutes.js";
// import chatRoutes from "./routers/chatRoutes.js";  // 👈 ADD THIS
// import aiRoutes from "./routers/aiRoutes.js";
import express from "express";
import mongoose from "mongoose";

dotenv.config(); // must be first
import { env } from "./config.js";
import authRoutes from "./routers/authRoutes.js";
import chatRoutes from "./routers/chatRoutes.js";
import aiRoutes from "./routers/aiRoutes.js";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
const PORT = env.PORT || 5000;

const mongoUri = env.MONGO_URI || env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
    });
} else {
  console.warn("MONGO_URI is not configured; auth routes will fail until it is set.");
}
app.use("/api/ai", aiRoutes);
app.use("/api", authRoutes);
app.use("/api", chatRoutes);

// app.use("/api/ai", aiRoutes);
// app.use("/api", authRoutes);
// app.use("/api", chatRoutes); // 👈 ADD THIS

console.log("SUPABASE_URL:", env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", env.SUPABASE_ANON_KEY?.slice(0, 15) + "...");
console.log("OPENROUTER_API_KEY:", env.OPENROUTER_API_KEY?.slice(0, 10) + "...");

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});