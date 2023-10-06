import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import path from "path";

export function fastlyPlugin() {
  const virtualModuleId = "fastly:env";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "my-plugin", // required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      if (id === "fastly:config-store") {
        return "\0" + "fastly:config-store";
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export const env = () => "test-pop"`;
      }
      if (id === "\0" + "fastly:config-store") {
        return `export const configStore = () => "test-pop"`;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    fastlyPlugin(),
    devServer({
      entry: "src/vite.tsx", // The file path of your application.
    }),
  ],
  resolve: {
    alias: [
      {
        find: "~/",
        replacement: path.join(__dirname, "src/"),
      },
    ],
  },
});
