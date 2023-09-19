import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";

export function fastlyPlugin() {
  const virtualModuleId = "fastly:env";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "my-plugin", // required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export const env = () => "test-pop"`;
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
});
