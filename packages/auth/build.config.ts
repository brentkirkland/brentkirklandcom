import { fastlyPlugin } from "fastly-plugin";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "bin",
  minify: false,
  plugins: [
    fastlyPlugin,
    // @ts-expect-error plugin is compatible
    polyfillNode({
      globals: {
        navigator: true,
      },
    }),
  ],
}).catch(() => process.exit(1));
