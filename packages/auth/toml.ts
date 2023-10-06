import { buildToml } from "build-toml";

buildToml(
  {
    name: "auth",
    authors: [""],
    description: "",
    language: "javascript",
    manifest_version: 2,
    service_id: process.env.WWW_SERVICE_ID || "",
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
    config_stores: {
      fhth_config: {
        format: "inline-toml",
        contents: {
          DB_URL: process.env.DB_URL as string,
          DB_AUTH_TOKEN: process.env.DB_AUTH_TOKEN as string,
        },
      },
    },
  },
  "fastly.toml",
);
