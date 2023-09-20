import { fastlyPlugin } from "./fastly-plugin";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "bin",
  minify: true,
  plugins: [
    fastlyPlugin,
    polyfillNode({
      globals: {
        navigator: true,
      },
    }),
  ],
});
