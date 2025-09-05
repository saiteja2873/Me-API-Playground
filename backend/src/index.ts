import { Hono } from "hono";
import { cors } from "hono/cors";

import profile from "./routes/profile";
import query from "./routes/query";

const app = new Hono();

app.use("*", cors({
  origin: [
    "http://localhost:3000", // local dev
    "https://me-api-playground-sooty.vercel.app" 
  ],
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.route("/profile", profile);
app.route("/query", query)
console.log("Query router mounted.");

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("🚀 Server running at https://me-api-playground-3-hlsg.onrender.com");
