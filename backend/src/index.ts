import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import profile from "./routes/profile";

const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:3000", 
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.route("/profile", profile);

serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("🚀 Server running at http://localhost:3001");
