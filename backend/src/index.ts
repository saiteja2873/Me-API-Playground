import { Hono } from "hono";
import { cors } from "hono/cors";

import profile from "./routes/profile";
import query from "./routes/query";
import health from "./routes/healthy";

const app = new Hono();

app.use("*", cors({
  origin: [
    "http://localhost:3000", 
    "https://me-api-playground-sooty.vercel.app" 
  ],
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.route("/", health)
app.route("/profile", profile);
app.route("/query", query)

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("Server running!!");
