import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../src/index";

type InsertRow = {
  id: unknown;
  createdAt: unknown;
  ip: unknown;
  userAgent: unknown;
  why: unknown;
  token: unknown;
  tokenMatched: unknown;
  source: unknown;
  rateLimited: unknown;
  country: unknown;
  region: unknown;
  city: unknown;
  asn: unknown;
  asOrganization: unknown;
};

const insertFromBinds = (args: unknown[]): InsertRow => ({
  id: args[0],
  createdAt: args[1],
  ip: args[2],
  userAgent: args[3],
  why: args[4],
  token: args[5],
  tokenMatched: args[6],
  source: args[7],
  rateLimited: args[8],
  country: args[9],
  region: args[10],
  city: args[11],
  asn: args[12],
  asOrganization: args[13],
});

function mockD1(options: { recentCount?: number } = {}) {
  const inserts: InsertRow[] = [];
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async first() {
              if (sql.includes("COUNT(*)")) {
                return { n: options.recentCount ?? 0 };
              }
              return null;
            },
            async run() {
              if (sql.includes("INSERT INTO agent_checkins")) {
                inserts.push(insertFromBinds(args));
              }
              return { success: true };
            },
          };
        },
      };
    },
  };
  return { db, inserts };
}

function createCtx() {
  const pending: Promise<unknown>[] = [];
  const ctx = {
    waitUntil(promise: Promise<unknown>) {
      pending.push(promise);
    },
    passThroughOnException() {},
    props: {},
  };
  return { ctx, flush: () => Promise.all(pending) };
}

function agentRequest(
  body: unknown,
  opts: {
    ip?: string;
    ua?: string;
    cf?: IncomingRequestCfProperties | null;
    raw?: string;
  } = {},
) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (opts.ip) headers.set("CF-Connecting-IP", opts.ip);
  if (opts.ua) headers.set("User-Agent", opts.ua);
  const req = new Request("https://brentkirkland.com/agent", {
    method: "POST",
    headers,
    body: opts.raw ?? JSON.stringify(body),
  });
  if (opts.cf !== undefined) {
    Object.defineProperty(req, "cf", { value: opts.cf ?? undefined, enumerable: true });
  }
  return req;
}

const sampleCf = {
  country: "US",
  region: "California",
  city: "San Francisco",
  asn: 13335,
  asOrganization: "CLOUDFLARENET",
} as IncomingRequestCfProperties;

function envFor(
  db: unknown,
  secrets: { url?: string; secret?: string } = {
    url: "https://webhook.example/agent",
    secret: "hook-secret",
  },
) {
  return {
    DB: db,
    HI: {},
    EMAIL: {},
    AGENT_CHECKPOINT_WEBHOOK_URL: secrets.url,
    AGENT_CHECKPOINT_WEBHOOK_SECRET: secrets.secret,
  } as never;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /agent", () => {
  it("stores request.cf geo/network fields and includes them on the webhook", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();
    const webhookBodies: unknown[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        webhookBodies.push(JSON.parse(String(init?.body)));
        return new Response("ok", { status: 200 });
      }),
    );

    const res = await worker.fetch(
      agentRequest(
        { why: "just passing through", token: "bk-w4n7-agent", source: "llms.txt" },
        { ip: "1.2.3.4", ua: "TestAgent/1.0", cf: sampleCf },
      ),
      envFor(db),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(inserts).toHaveLength(1);
    expect(inserts[0]).toMatchObject({
      ip: "1.2.3.4",
      userAgent: "TestAgent/1.0",
      why: "just passing through",
      token: "bk-w4n7-agent",
      tokenMatched: 1,
      source: "llms.txt",
      rateLimited: 0,
      country: "US",
      region: "California",
      city: "San Francisco",
      asn: 13335,
      asOrganization: "CLOUDFLARENET",
    });
    expect(webhookBodies).toEqual([
      {
        why: "just passing through",
        userAgent: "TestAgent/1.0",
        tokenMatched: true,
        timestamp: inserts[0].createdAt,
        source: "llms.txt",
        ip: "1.2.3.4",
        country: "US",
        region: "California",
        city: "San Francisco",
        asn: 13335,
        asOrganization: "CLOUDFLARENET",
      },
    ]);
  });

  it("stores null geo fields when request.cf is missing", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();
    vi.stubGlobal("fetch", vi.fn());

    const res = await worker.fetch(
      agentRequest({ why: "local wrangler" }),
      envFor(db, {}),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(200);
    expect(inserts).toHaveLength(1);
    expect(inserts[0]).toMatchObject({
      country: null,
      region: null,
      city: null,
      asn: null,
      asOrganization: null,
      tokenMatched: 0,
      rateLimited: 0,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("treats empty cf strings as null", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();

    const res = await worker.fetch(
      agentRequest(
        { why: "empty geo" },
        {
          cf: {
            country: "  ",
            region: "",
            city: null,
            asn: Number.NaN,
            asOrganization: undefined,
          } as unknown as IncomingRequestCfProperties,
        },
      ),
      envFor(db, {}),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(200);
    expect(inserts[0]).toMatchObject({
      country: null,
      region: null,
      city: null,
      asn: null,
      asOrganization: null,
    });
  });

  it("still stores geo on a rate-limited attempt and does not fire the webhook", async () => {
    const { db, inserts } = mockD1({ recentCount: 5 });
    const { ctx, flush } = createCtx();
    vi.stubGlobal("fetch", vi.fn());

    const res = await worker.fetch(
      agentRequest({ why: "too many knocks" }, { ip: "9.9.9.9", cf: sampleCf }),
      envFor(db),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: "rate_limited" });
    expect(inserts).toHaveLength(1);
    expect(inserts[0]).toMatchObject({
      rateLimited: 1,
      country: "US",
      region: "California",
      city: "San Francisco",
      asn: 13335,
      asOrganization: "CLOUDFLARENET",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects empty why without storing a row", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();

    const res = await worker.fetch(
      agentRequest({ why: "   " }),
      envFor(db),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "empty_why" });
    expect(inserts).toHaveLength(0);
  });

  it("rejects invalid JSON without storing a row", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();

    const res = await worker.fetch(
      agentRequest(null, { raw: "{not-json" }),
      envFor(db),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_json" });
    expect(inserts).toHaveLength(0);
  });

  it("records token mismatches without blocking the check-in", async () => {
    const { db, inserts } = mockD1();
    const { ctx, flush } = createCtx();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("ok", { status: 200 })),
    );

    const res = await worker.fetch(
      agentRequest({ why: "wrong token", token: "nope" }),
      envFor(db),
      ctx as ExecutionContext,
    );
    await flush();

    expect(res.status).toBe(200);
    expect(inserts[0].tokenMatched).toBe(0);
    expect(inserts[0].token).toBe("nope");
  });
});
