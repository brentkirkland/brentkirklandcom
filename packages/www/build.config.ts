import { fastlyPlugin } from "./fastly-plugin";

Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "bin",
  minify: true,
  plugins: [fastlyPlugin],
});
