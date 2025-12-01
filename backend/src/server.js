import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

app.get("/happy", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/books", (req, res) => {
  res.json({ message: "Server is running" });
});

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "./public");

  app.use(express.static(publicPath));

  // Catch-all route must be "*", NOT "/{*any}"
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
