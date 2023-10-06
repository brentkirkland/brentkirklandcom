import { buildToml } from "build-toml";

buildToml(
  {
    name: "brentkirklandcom",
    authors: [""],
    description: "",
    language: "javascript",
    manifest_version: 2,
    service_id: "",
    scripts: {
      build: "bun run build",
    },
    local_server: {
      backends: {
        db: {
          url: process.env.DB_URL as string,
        },
      },
    },
  },
  "fastly.toml",
);
