import type { MiddlewareHandler } from "hono";
import { createDrizzle, createClient } from "db";
import { ConfigStore } from "fastly:config-store";

export const dbMiddleware: MiddlewareHandler = async (c, next) => {
  const configStore = new ConfigStore("fhth_config");
  const authToken = await configStore.get("DB_AUTH_TOKEN");
  const url = await configStore.get("DB_URL");

  if (!authToken || !url) {
    return c.text("Missing env", 500);
  }

  // todo
  const client = createClient({
    authToken,
    url,
  });

  c.set("client", client);
  c.set("drizzle", createDrizzle({ client }));

  return next();
};
