import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // must be first
const PORT = process.env.PORT || 5000;

console.log("Backend server initialized");

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
