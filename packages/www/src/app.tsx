import { hono } from "hono-local";
import { layoutMiddleware } from "~/middleware/layout";

const app = hono();

app.get("/", layoutMiddleware, (c) => {
  return c.render(
    <div class="p-4">
      <h1 class="text-2xl py-4">Brent Kirkland</h1>
      <div>
        <h2 class="font-bold">Work Experience</h2>
        <ul>
          <li>
            Software Engineer at{" "}
            <a
              class="text-indigo-600 dark:text-indigo-300"
              href="https://Fastly.com"
            >
              Fastly
            </a>
            , <i>2023 - Present</i>
          </li>
          <li>
            Software Engineer at{" "}
            <a
              class="text-indigo-600 dark:text-indigo-300"
              href="https://weedmaps.com"
            >
              Weedmaps
            </a>
            , <i>2019 - 2023</i>
          </li>
          <li>
            Software Engineer at{" "}
            <a
              class="text-indigo-600 dark:text-indigo-300"
              href="https://bitfinex.com"
            >
              Bitfinex
            </a>
            , <i>2017 - 2019</i>
          </li>
        </ul>
      </div>
      <div class="py-4">
        <h2 class="font-bold">Education</h2>
        <p>Computer Science BS from UCSB</p>
      </div>
      <div>
        <p>
          Contact me on{" "}
          <a
            class="text-indigo-600 dark:text-indigo-300"
            href="https://www.linkedin.com/in/brentland/"
          >
            LinkedIn
          </a>
        </p>
        <p>
          View website source code on{" "}
          <a
            class="text-indigo-600 dark:text-indigo-300"
            href="https://github.com/brentkirkland/brentkirklandcom"
          >
            Github
          </a>
        </p>
      </div>
    </div>,
    {
      title: "Brent Kirkland",
    },
  );
});

export { app };
