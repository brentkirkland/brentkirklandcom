import { Hono } from "hono/quick";
import type { Client, Drizzle } from "db";

export { dbMiddleware } from "./middleware/db";

export const hono = () =>
  new Hono<{
    Variables: {
      client: Client;
      drizzle: Drizzle;
    };
  }>();
