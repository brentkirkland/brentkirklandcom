import json2toml from "json2toml";

type Configuration = {
  name: string;
  authors: string[];
  description: string;
  language: string;
  manifest_version: number;
  service_id: string;
  scripts: {
    build: string;
  };
  local_server: {
    backends: {
      [key: string]: {
        url: string;
      };
    };
  };
};

export const buildToml = (config: Configuration, path: string) => {
  const toml = json2toml(config, {
    indent: 2,
    newlineAfterSection: true,
  });

  Bun.write(path, toml);
};

buildToml(
  {
    name: "brentkirklandcom",
    authors: [""],
    description: "",
    language: "javascript",
    manifest_version: 2,
    service_id: "",
    scripts: {
      build: "bun build:c@e",
    },
    local_server: {
      backends: {
        db: {
          url: "http://",
        },
      },
    },
  },
  "build.toml",
);
