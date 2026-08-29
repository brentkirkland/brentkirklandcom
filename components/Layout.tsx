import { ReactNode } from "react";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Brent Kirkland" }: Props) => (
  <div className="font-sans min-h-screen">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Brent Kirkland. Security Products at Fastly. No email — draw a picture."
      />
    </Head>
    {children}
  </div>
);

export default Layout;
