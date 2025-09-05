import { Hono } from "hono";

const healthy = new Hono();

healthy.get("/health", (c : any) => {
  return c.json({ status: "ok", message: "Server is healthy" }, 200);
});

export default healthy;
