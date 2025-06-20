import { serve } from "@hono/node-server";
import { Hono } from "hono";
import users from "./routes/users.js";

const app = new Hono();
app.route("/users", users);

// Optional: add a root route for testing
app.get("/", (c) => c.text("Hello from Hono!"));

serve({
  fetch: app.fetch,
  port: 3000, // or any port you want
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
