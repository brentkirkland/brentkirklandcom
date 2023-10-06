import { createClient as createLibsqlClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import { example } from "./schema";

const config = {
  fetch: async (req: Request) => {
    const newReq = new Request(req, { backend: "db" });
    const res = await fetch(newReq);
    return res;
  },
};

export function createClient({
  authToken,
  url,
}: {
  authToken: string;
  url: string;
}) {
  return createLibsqlClient({
    authToken,
    url,
    ...config,
  });
}

export const schema = {
  example,
};

export const createDrizzle = ({ client }: { client: Client }) =>
  drizzle(client, {
    schema,
  });

export type Client = ReturnType<typeof createClient>;
export type Drizzle = ReturnType<typeof createDrizzle>;
