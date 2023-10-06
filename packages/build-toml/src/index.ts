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
  local_server?: {
    backends: {
      [key: string]: {
        url: string;
      };
    };
  };
  config_stores?: {
    [key: string]: {
      format: string;
      contents: {
        [key: string]: string;
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
