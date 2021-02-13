import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Brent Kirkland">
    <>
      <h1 className="text-2xl">Brent Kirkland</h1>
      <ul>
        <li>
          Software Engineer at{" "}
          <a className="text-indigo-600" href="https://weedmaps.com">
            Weedmaps
          </a>
        </li>
        <li>
          Previous Engineer at{" "}
          <a className="text-indigo-600" href="https://bitfinex.com">
            Bitfinex
          </a>
        </li>
        <li>Computer Science BS from UCSB</li>
        <li>
          Contact me on{" "}
          <a
            className="text-indigo-600"
            href="https://www.linkedin.com/in/brentland/"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </>
  </Layout>
);

export default IndexPage;
