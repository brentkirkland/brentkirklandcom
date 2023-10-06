import { Hono } from "hono/quick";
import type { Client, Drizzle } from "db";
import { dbMiddleware } from "./middleware/db";

const app = new Hono<{
  Variables: {
    client: Client;
    drizzle: Drizzle;
  };
}>();

app.use("*", dbMiddleware);

app.get("/", (c) => {
  const d = <div>haaaa</div>;
  return c.html(d);
});

app.fire();

export { app };
