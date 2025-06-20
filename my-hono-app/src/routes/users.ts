import { Hono } from "hono";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { InsertUser } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = new Hono();

// GET /users
router.get("/", async c => {
  const all = await db.select().from(users);
  return c.json(all);
});

// GET /users/:id
router.get("/:id", async c => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const user = await db.select().from(users).where(eq(users.id, id)).get();
  if (!user) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(user);
});

// POST /users
router.post("/", async c => {
  const body = await c.req.json<InsertUser>();
  if (!body.name || !body.email || typeof body.age !== "number") {
    return c.json({ error: "Missing required fields" }, 400);
  }
  const [res] = await db.insert(users).values(body).returning();
  return c.json(res, 201);
});

// PUT /users/:id
router.put("/:id", async c => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const body = await c.req.json<Partial<InsertUser>>();
  const [res] = await db.update(users).set(body).where(eq(users.id, id)).returning();
  if (!res) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json(res);
});

// DELETE /users/:id
// DELETE handler
router.delete("/:id", async c => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid user ID", 400);

  // Assuming delete returns array of deleted rows
  const deleted = await db.delete(users).where(eq(users.id, id)).returning();

  if (deleted.length === 0) {
    return c.text("Not found", 404);
  }

});

export default router;
