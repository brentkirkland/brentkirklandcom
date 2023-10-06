import { hono } from "hono-local";
import { layoutMiddleware } from "~/middleware/layout";
import { Workplace } from "./components/workplace";

const app = hono();

app.get("/", layoutMiddleware, (c) => {
  return c.render(
    <div class="p-6">
      <div class="flex items-end justify-between  pt-4 pb-4">
        <h1 class="text-xl">brentkirklandcom</h1>
        <a
          href="https://github.com/brentkirkland/brentkirklandcom"
          class="text-indigo-600 dark:text-indigo-300"
        >
          GitHub
        </a>
      </div>

      <div class="py-4">
        <h2 class="font-bold">Work Experience</h2>
        <ul class="py-4 list-disc px-7 space-y-1">
          <li>
            <Workplace
              name="Fastly"
              url="https://fastly.com"
              title="Software Engineer"
              from="2023"
              to="Curr"
            />
          </li>
          <li>
            <Workplace
              name="Weedmaps"
              url="https://weedmaps.com"
              title="Software Engineer"
              from="2019"
              to="2023"
            />
          </li>
          <li>
            <Workplace
              name="Bitfinex"
              url="https://bitfinex.com"
              title="Software Engineer"
              from="2017"
              to="2019"
            />
          </li>
        </ul>
      </div>
      <div class="py-4">
        <h2 class="font-bold">Education</h2>

        <ul class="py-4 list-disc px-7">
          <li>Computer Science BS from UCSB</li>
        </ul>
      </div>
    </div>,
    {
      title: "Brent Kirkland | brentkirklandcom",
    },
  );
});

export { app };
