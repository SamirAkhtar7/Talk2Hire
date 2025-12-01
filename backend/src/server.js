import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./lib/env.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/happy", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/books", (req, res) => {
  res.json({ message: "Server is running" });
});

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  // serve frontend build from repo-root/frontend/dist
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // catch-all route for client-side routing
  // use a regex to avoid path-to-regexp treating '*' as a malformed parameter
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
