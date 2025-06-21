import { Hono } from "hono";
import prisma from "../db/prisma.js"; // your PrismaClient instance
import type { User } from '../generated/prisma/index.js';



const router = new Hono();

router.post("/", async c => {
  const body = await c.req.json<Partial<User>>();
  const newUser: User = await prisma.user.create({ data: body });
// valid type
  const user = await prisma.user.create({ data: body });
  return c.json(user, 201);
});

// GET by ID
router.get('/:id', async c => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return c.json({ error: "Not found" }, 404);
  return c.json(user);
});

// POST new user
router.post('/', async c => {
  const { name, email, age } = await c.req.json<Partial<{ name: string; email: string; age: number }>>();
  if (!name || !email || typeof age !== 'number') {
    return c.json({ error: "Missing fields" }, 400);
  }
  const user = await prisma.user.create({ data: { name, email, age } });
  return c.json(user, 201);
});

// PUT /users/:id
router.put('/:id', async c => {
  const id = Number(c.req.param('id'));
  const { name, email, age } = await c.req.json<Partial<{ name: string; email: string; age: number }>>();
  try {
    const user = await prisma.user.update({ where: { id }, data: { name, email, age } });
    return c.json(user);
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

// DELETE /users/:id
router.delete('/:id', async c => {
  const id = Number(c.req.param('id'));
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

export default router;
