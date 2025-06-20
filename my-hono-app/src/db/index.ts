import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";
import "dotenv/config";

const db = drizzle(new Database(process.env.DATABASE_URL!), { schema });
export { db };
