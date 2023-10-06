import { dbMiddleware, hono } from "hono-local";

const app = hono();

app.use("*", dbMiddleware);

app.get("/", (c) => {
  const d = <div>haaaa</div>;
  return c.html(d);
});

app.fire();

export { app };
