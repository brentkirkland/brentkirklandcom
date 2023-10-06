import { fastlyPlugin } from "./fastly-plugin";

Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "bin",
  minify: true,
  plugins: [fastlyPlugin],
  define: {
    "process.env.TEST": JSON.stringify(process.env.TEST),
  },
}).catch(() => process.exit(1));
