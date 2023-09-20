import { Hono } from "hono/quick";
import { Auth, type AuthConfig } from "@auth/core";
// import EmailProvider from "@auth/core/providers/email";
// import { SQLiteDrizzleAdapter } from "./drizzle/adapter";
import { schema, type Client, type Drizzle } from "./db";
import { dbMiddleware } from "./middleware/db";

const app = new Hono<{
  Variables: {
    client: Client;
    drizzle: Drizzle;
  };
}>();

// function getAuthConfig(drizzle: Drizzle): AuthConfig {
//   return {
//     providers: [
//       //   EmailProvider({
//       //     server: {
//       //       host: "process.env.EMAIL_SERVER_HOST",
//       //       port: "process.env.EMAIL_SERVER_PORT",
//       //       auth: {
//       //         user: "process.env.EMAIL_SERVER_USER",
//       //         pass: "process.env.EMAIL_SERVER_PASSWORD",
//       //       },
//       //     },
//       //     from: "process.env.EMAIL_FROM",
//       //   }),
//     ],
//     trustHost: true,
//     secret: "secret",
//     // adapter: SQLiteDrizzleAdapter(drizzle as any), // sad
//   };
// }

app.use("*", dbMiddleware);
// app.get("*", async (c) => {
//   const authConfig = getAuthConfig(c.var.drizzle);
//   const response = await Auth(c.req.raw, authConfig);
//   return response;
// });

// app.get("/signin", async (c) => {
//     const response = await Auth(c.req.raw, authConfig);
//     return response;
//   });

//   app.get("/api", async (c) => {
//     console.log("yuuyuyuyuyuyu");
//     return c.html(<div>test</div>);
//   });

//   app.post("/api/auth/*", async (c) => {
//     const response = await Auth(c.req.raw, authConfig);
//     return response;
//   });

// app.post("/api/auth/callback/credentials", async (c) => {
//   const response = await Auth(c.req.raw, authConfig);
//   return response;
// });

app.get("/ha", async (c) => {
  console.log("ha");
  return c.html(<div>haaaa</div>);
});

app.get("/test", async (c) => {
  console.log("ahahah");
  const a = await c.var.drizzle.select().from(schema.users);
  console.log("suhhh");
  console.log("yuuyuyuyuyuyu", a.length);
  //   const response = await Auth(c.req.raw, authConfig);
  //   return response;
  return c.html(<div>test2</div>);
});

// signin
// signout
//

app.fire();

export { app };
