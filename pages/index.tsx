import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Brent Kirkland">
    <>
      <h1 className="text-2xl">Brent Kirkland</h1>
      <div className="py-4">
        <h2 className="font-bold">Projects</h2>
        <p>
          <a className="text-indigo-600" href="https://goerli.pixxiti.com">
            Pixxiti
          </a>
          , Your NFT here
        </p>
      </div>
      <div>
        <h2 className="font-bold">Work Experience</h2>
        <ul>
          <li>
            Software Engineer at{" "}
            <a className="text-indigo-600" href="https://weedmaps.com">
              Weedmaps
            </a>
            , <i>2019 - Present</i>
          </li>
          <li>
            Software Engineer at{" "}
            <a className="text-indigo-600" href="https://bitfinex.com">
              Bitfinex
            </a>
            , <i>2017 - 2019</i>
          </li>
          <li></li>
        </ul>
      </div>
      <div className="py-4">
        <h2 className="font-bold">Education</h2>
        <p>Computer Science BS from UCSB</p>
      </div>
      <div>
        <p>
          Contact me on{" "}
          <a
            className="text-indigo-600"
            href="https://www.linkedin.com/in/brentland/"
          >
            LinkedIn
          </a>
        </p>
        <p>
          View website source code on{" "}
          <a
            className="text-indigo-600"
            href="https://github.com/brentkirkland/brentkirklandcom"
          >
            Github
          </a>
        </p>
      </div>
    </>
  </Layout>
);

export default IndexPage;
