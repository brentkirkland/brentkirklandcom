declare module "json2toml" {
  export default function json2toml(
    obj: unknown,
    opts: {
      indent: number;
      newlineAfterSection: boolean;
    },
  ): string;
}
