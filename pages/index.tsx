import { NextPage } from "next";
import Head from "next/head";
import React from "react";

const Home: NextPage<{}> = () => (
  <div className="container">
    <Head>
      <title>Brent Kirkland</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <header>
      <h1 className="title">
        /brentkirklandcom
      </h1>
    </header>

    <main>
      <p>Weedmaps Software Engineer</p>
    </main>

    <footer>Copyright 2020</footer>

    <style jsx>
      {`
      .container {
        padding: 1rem;
      }

      .title {
        margin: 0;
        line-height: 1.15;
        font-size: 2rem;
      }
    `}
    </style>

    <style jsx global>
      {`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: monospace;
      }

      * {
        box-sizing: border-box;
      }
    `}
    </style>
  </div>
);

export default Home;
