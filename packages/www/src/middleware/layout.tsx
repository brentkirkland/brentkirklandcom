import type { MiddlewareHandler } from "hono";

declare module "hono" {
  interface ContextRenderer {
    (content: string, head: { title: string }): Response;
  }
}

export const layoutMiddleware: MiddlewareHandler = async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{head.title}</title>
          <script src="https://unpkg.com/htmx.org@1.9.5"></script>
          <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white dark:bg-black text-black dark:text-white font-mono m-auto max-w-lg">
          {content}
        </body>
      </html>,
    );
  });
  return next();
};
