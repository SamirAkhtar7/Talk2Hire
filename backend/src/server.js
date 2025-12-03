import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express"
import { inngest } from "./lib/inngest.js";
import { functions } from "./lib/inngest.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json())

//credentials : true allows cookies to be sent/received in cross-origin requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))

app.use("/api/inngest", serve({ client: inngest, functions }));


app.get("/", (req, res) => {
  if (ENV.NODE_ENV === "production") {
    const publicPath = path.join(__dirname, "../public");
    return res.sendFile(path.join(publicPath, "index.html"));
  }

  res.json({ message: "Server is running" });
});

app.get("/happy", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/books", (req, res) => {
  res.json({ message: "Server is running" });
});

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  const publicPath = path.join(__dirname, "../public");

  app.use(express.static(publicPath));

  // Catch-all route for client-side routing (use regex to avoid path-to-regexp '*' parsing)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}


const startServer = async () => { 
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
     console.log(`Server running on port ${ENV.PORT}`);
 });

   }
  catch (error) { 
    console.error("💥Error starting server:", error);
    process.exit(1);
  }
}


startServer();