import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import profile from "./routes/profile";
import query from "./routes/query";

const app = new Hono();

app.use("*", cors({
  origin: "http://localhost:3000", 
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.route("/profile", profile);
app.route("/query", query)
console.log("Query router mounted.");

serve({
  fetch: app.fetch,
  port: 3001,
});

console.log("🚀 Server running at http://localhost:3001");
