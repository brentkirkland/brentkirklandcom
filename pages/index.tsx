import Layout from "../components/Layout";
import DrawPad from "../components/DrawPad";

const IndexPage = () => {
  return (
    <Layout title="Brent Kirkland">
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-paper/50">
          Security Products
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Brent Kirkland
        </h1>
        <p className="mt-4 text-lg text-paper/75">
          Currently employed @{" "}
          <a
            className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
            href="https://www.fastly.com"
          >
            Fastly
          </a>
          .
        </p>

        <section className="mt-12">
          <h2 className="text-base font-medium text-paper">Want to say hi?</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/65">
            I don&apos;t give out my email. It turns into trash. Draw a picture
            instead. That&apos;s the proof you&apos;re a person. What happens to
            the image later is a problem for later.
          </p>
          <div className="mt-6">
            <DrawPad />
          </div>
        </section>

        <footer className="mt-16 text-sm text-paper/45">
          <a
            className="hover:text-paper"
            href="https://www.linkedin.com/in/brentland/"
          >
            LinkedIn
          </a>
          <span className="mx-2">·</span>
          <a
            className="hover:text-paper"
            href="https://github.com/brentkirkland/brentkirklandcom"
          >
            Source
          </a>
        </footer>
      </main>
    </Layout>
  );
};

export default IndexPage;
