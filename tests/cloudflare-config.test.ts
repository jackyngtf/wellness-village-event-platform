import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(".");
const websiteConfigFiles = [
  "wrangler.jsonc",
  "wrangler.preview.jsonc",
  "worker-configuration.d.ts",
  ".env.example",
] as const;

type JsonObject = Record<string, unknown>;

async function fileExists(relativePath: string): Promise<boolean> {
  try {
    await access(path.join(projectRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readRequiredText(relativePath: string): Promise<string | null> {
  if (!(await fileExists(relativePath))) return null;
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

async function readRequiredJson(relativePath: string): Promise<JsonObject | null> {
  const text = await readRequiredText(relativePath);
  return text === null ? null : (JSON.parse(text) as JsonObject);
}

function expectRequired<T>(
  value: T | null,
  relativePath: string,
): asserts value is T {
  expect(value, `${relativePath} must exist`).not.toBeNull();
}

function collectStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStringValues);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap(collectStringValues);
  }
  return [];
}

async function inspectOpenNextConfig(
  previewValue: string | undefined,
): Promise<{ incrementalCache: string; queue: string } | null> {
  const configPath = path.join(projectRoot, "open-next.config.ts");
  if (!(await fileExists("open-next.config.ts"))) return null;

  const script = `
    const module = await import(${JSON.stringify(pathToFileURL(configPath).href)});
    const override = module.default.default.override;
    const resolveOverride = async (value) =>
      typeof value === "function" ? await value() : value;
    const incrementalCache = await resolveOverride(override.incrementalCache);
    const queue = await resolveOverride(override.queue);
    process.stdout.write(JSON.stringify({
      incrementalCache: incrementalCache?.name ?? incrementalCache,
      queue: queue?.name ?? queue,
    }));
  `;
  const environment = { ...process.env };
  if (previewValue === undefined) {
    delete environment.OPEN_NEXT_LOCAL_PREVIEW;
  } else {
    environment.OPEN_NEXT_LOCAL_PREVIEW = previewValue;
  }
  const { stdout } = await execFileAsync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    { cwd: projectRoot, env: environment },
  );
  return JSON.parse(stdout) as {
    incrementalCache: string;
    queue: string;
  };
}

describe("Cloudflare website configuration", () => {
  it("uses R2 and the Durable Object queue for normal OpenNext builds", async () => {
    const config = await inspectOpenNextConfig(undefined);
    expectRequired(config, "open-next.config.ts");
    expect(config).toEqual({
      incrementalCache: "cf-r2-incremental-cache",
      queue: "durable-queue",
    });
  });

  it("uses the direct queue only for an explicitly local workerd preview", async () => {
    const explicitPreview = await inspectOpenNextConfig("true");
    const ambiguousValue = await inspectOpenNextConfig("1");
    expectRequired(explicitPreview, "open-next.config.ts");
    expectRequired(ambiguousValue, "open-next.config.ts");
    expect(explicitPreview).toEqual({
      incrementalCache: "cf-r2-incremental-cache",
      queue: "direct",
    });
    expect(ambiguousValue.queue).toBe("durable-queue");
  });

  it("defines the neutral production-shaped Worker bindings without an account id", async () => {
    const config = await readRequiredJson("wrangler.jsonc");
    expectRequired(config, "wrangler.jsonc");

    expect(config).not.toHaveProperty("account_id");
    expect(config).not.toHaveProperty("route");
    expect(config).not.toHaveProperty("routes");
    expect(config).not.toHaveProperty("images");
    expect(config).toMatchObject({
      name: "portfolio-demo-wellness-village-worker",
      main: ".open-next/worker.js",
      workers_dev: false,
      compatibility_date: "2026-09-17",
      compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"],
      assets: {
        directory: ".open-next/assets",
        binding: "ASSETS",
      },
      services: [
        {
          binding: "WORKER_SELF_REFERENCE",
          service: "portfolio-demo-wellness-village-worker",
        },
      ],
      r2_buckets: [
        {
          binding: "NEXT_INC_CACHE_R2_BUCKET",
          bucket_name: "portfolio-demo-next-incremental-cache",
        },
      ],
      durable_objects: {
        bindings: [
          { name: "NEXT_CACHE_DO_QUEUE", class_name: "DOQueueHandler" },
        ],
      },
      migrations: [
        { tag: "v1", new_sqlite_classes: ["DOQueueHandler"] },
      ],
      queues: {
        producers: [
          {
            binding: "PORTFOLIO_CONTACT_SUBMISSIONS_QUEUE",
            queue: "portfolio-demo-contact-submissions",
          },
        ],
      },
      vars: {
        THE_GROUND_LIVE_ENABLED: "false",
        THE_GROUND_ORGANIZATION_ID: "",
        PORTFOLIO_CONTACT_COLLECTION_ENABLED: "false",
        PORTFOLIO_CONTACT_CONSENT_VERSION: "portfolio-demo-contact-v1",
        PORTFOLIO_TURNSTILE_EXPECTED_HOSTNAME: "portfolio.example.com",
      },
      observability: { enabled: true },
    });

    const rateLimits = config.ratelimits as
      | Array<{
          name?: unknown;
          namespace_id?: unknown;
          simple?: { limit?: unknown; period?: unknown };
        }>
      | undefined;
    expect(rateLimits).toHaveLength(2);
    expect(rateLimits?.map(({ name }) => name)).toEqual([
      "PORTFOLIO_CONTACT_PRE_RATE_LIMITER",
      "PORTFOLIO_CONTACT_RATE_LIMITER",
    ]);
    expect(rateLimits?.map(({ namespace_id }) => namespace_id)).toEqual([
      "1001",
      "1002",
    ]);
    for (const rateLimit of rateLimits ?? []) {
      expect(rateLimit.simple?.limit).toEqual(expect.any(Number));
      expect([10, 60]).toContain(rateLimit.simple?.period);
    }

    const neutralResources = collectStringValues({
      name: config.name,
      services: config.services,
      r2_buckets: config.r2_buckets,
      queues: config.queues,
    }).filter((value) => value.includes("portfolio-"));
    expect(neutralResources.length).toBeGreaterThan(0);
    expect(neutralResources.every((value) => value.startsWith("portfolio-demo-"))).toBe(
      true,
    );
  });

  it("keeps the local preview self-contained and excludes live contact and DO queue bindings", async () => {
    const config = await readRequiredJson("wrangler.preview.jsonc");
    expectRequired(config, "wrangler.preview.jsonc");

    expect(config).not.toHaveProperty("account_id");
    expect(config).toMatchObject({
      name: "portfolio-demo-wellness-village-preview",
      main: ".open-next/worker.js",
      workers_dev: false,
      compatibility_date: "2026-09-17",
      compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"],
      assets: {
        directory: ".open-next/assets",
        binding: "ASSETS",
      },
      services: [
        {
          binding: "WORKER_SELF_REFERENCE",
          service: "portfolio-demo-wellness-village-preview",
        },
      ],
      r2_buckets: [
        {
          binding: "NEXT_INC_CACHE_R2_BUCKET",
          bucket_name: "portfolio-demo-preview-next-cache",
        },
      ],
      vars: {
        THE_GROUND_LIVE_ENABLED: "false",
        THE_GROUND_ORGANIZATION_ID: "",
        PORTFOLIO_CONTACT_COLLECTION_ENABLED: "false",
        PORTFOLIO_CONTACT_CONSENT_VERSION: "portfolio-demo-contact-v1",
        PORTFOLIO_TURNSTILE_EXPECTED_HOSTNAME: "preview.portfolio.example.com",
      },
    });
    expect(config).not.toHaveProperty("durable_objects");
    expect(config).not.toHaveProperty("migrations");
    expect(config).not.toHaveProperty("queues");
    expect(config).not.toHaveProperty("ratelimits");
    expect(config).not.toHaveProperty("route");
    expect(config).not.toHaveProperty("routes");
    expect(config).not.toHaveProperty("images");

    const normalConfig = await readRequiredJson("wrangler.jsonc");
    expectRequired(normalConfig, "wrangler.jsonc");
    expect(config.compatibility_date).toBe(normalConfig.compatibility_date);
  });

  it("keeps both optional website integrations disabled in every checked-in environment example", async () => {
    for (const relativePath of [
      "wrangler.jsonc",
      "wrangler.preview.jsonc",
      ".env.example",
    ]) {
      const text = await readRequiredText(relativePath);
      expectRequired(text, relativePath);
      expect(text).toMatch(/THE_GROUND_LIVE_ENABLED["=:\s]+false/);
      expect(text).toMatch(
        /PORTFOLIO_CONTACT_COLLECTION_ENABLED["=:\s]+false/,
      );
    }
  });

  it("keeps Google configuration exclusively in the private consumer", async () => {
    for (const relativePath of websiteConfigFiles) {
      const text = await readRequiredText(relativePath);
      expectRequired(text, relativePath);
      expect(text).not.toMatch(/GOOGLE_(?:SERVICE_ACCOUNT|SHEET)/);
    }

    const consumerConfig = await readRequiredText(
      "workers/contact-sheet-consumer/wrangler.jsonc",
    );
    expectRequired(
      consumerConfig,
      "workers/contact-sheet-consumer/wrangler.jsonc",
    );
    expect(consumerConfig).toContain("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON");
    expect(consumerConfig).toContain("GOOGLE_SHEET_ID");
    expect(consumerConfig).toContain("GOOGLE_SHEET_RANGE");
  });

  it("provides reproducible build, dry-run, local-preview, and type commands", async () => {
    const packageJson = await readRequiredJson("package.json");
    expectRequired(packageJson, "package.json");
    const scripts = packageJson.scripts as Record<string, string> | undefined;

    expect(scripts).toMatchObject({
      "cf:build": "opennextjs-cloudflare build",
      "cf:typegen":
        "wrangler types --config wrangler.jsonc --env-interface GeneratedWebsiteEnv --include-runtime false worker-configuration.d.ts",
      "cf:typegen:check":
        "wrangler types --check --config wrangler.jsonc --env-interface GeneratedWebsiteEnv --include-runtime false worker-configuration.d.ts",
      "contact-consumer:test": expect.any(String),
      "contact-consumer:typecheck": expect.any(String),
      "contact-consumer:dry-run": expect.any(String),
    });
    expect(scripts?.["cf:dry-run"]).toMatch(
      /^npm run cf:build && wrangler deploy --dry-run --config wrangler\.jsonc$/,
    );
    expect(scripts?.["cf:preview"]).toBe(
      "OPEN_NEXT_LOCAL_PREVIEW=true opennextjs-cloudflare build --config wrangler.preview.jsonc && opennextjs-cloudflare preview --config wrangler.preview.jsonc",
    );
    expect(scripts?.["cf:preview"]).not.toContain("wrangler dev");
    expect(scripts?.["cf:preview"]).not.toContain("--remote");

    const gitignore = await readRequiredText(".gitignore");
    expectRequired(gitignore, ".gitignore");
    expect(gitignore).toMatch(/^\.open-next\/$/m);
    expect(gitignore).toMatch(/^\.wrangler\/$/m);
    expect(gitignore).toMatch(/^\.playwright-cli\/$/m);
    expect(gitignore).toMatch(/^output\/$/m);
    expect(gitignore).toMatch(/^\.dev\.vars\*$/m);

    const tsconfig = await readRequiredJson("tsconfig.json");
    expectRequired(tsconfig, "tsconfig.json");
    expect(tsconfig.include).toEqual(
      expect.arrayContaining(["worker-configuration.d.ts"]),
    );
  });

  it("initialises Next development bindings from the local-only preview config", async () => {
    const nextConfig = await readRequiredText("next.config.ts");
    expectRequired(nextConfig, "next.config.ts");
    expect(nextConfig).toContain(
      'configPath: "wrangler.preview.jsonc"',
    );
    expect(nextConfig).toContain("remoteBindings: false");
    expect(nextConfig).toContain("persist: false");
  });
});

describe("Cloudflare delivery documentation", () => {
  it("describes R2 and Durable Objects only as Next cache and revalidation infrastructure", async () => {
    const documents = await Promise.all(
      [
        "README.md",
        "README.zh-Hant.md",
        "docs/case-study/06-cloudflare-delivery.md",
        "docs/decisions/002-workers-not-static-pages.md",
      ].map(async (relativePath) => ({
        relativePath,
        text: await readRequiredText(relativePath),
      })),
    );

    for (const document of documents) {
      expectRequired(document.text, document.relativePath);
      expect(document.text).toMatch(/R2/i);
      expect(document.text).toMatch(/Durable Object/i);
      expect(document.text).toMatch(
        /(?:not (?:used to )?store.*contact submissions|do not store contact submissions|not lead storage|不會儲存聯絡表格內容|並非.*(?:潛在客戶資料儲存|客戶資料))/i,
      );
    }
  });

  it("separates local direct preview evidence from production DO revalidation and future deployment", async () => {
    const delivery = await readRequiredText(
      "docs/case-study/06-cloudflare-delivery.md",
    );
    const checklist = await readRequiredText(
      "docs/agent-workflow/release-checklist.md",
    );
    expectRequired(delivery, "docs/case-study/06-cloudflare-delivery.md");
    expectRequired(checklist, "docs/agent-workflow/release-checklist.md");
    expect(delivery).toMatch(/local workerd preview[\s\S]*direct revalidation queue/i);
    expect(delivery).toMatch(/Production retains[\s\S]*Durable Object/i);
    expect(delivery).toMatch(/vinext/i);
    expect(checklist).toMatch(/build and dry-run evidence/i);
    expect(checklist).toMatch(/future deployment/i);
  });

  it("states in both landing pages that the synthetic demo needs no production credentials or live services", async () => {
    const english = await readRequiredText("README.md");
    const traditionalChinese = await readRequiredText("README.zh-Hant.md");
    expectRequired(english, "README.md");
    expectRequired(traditionalChinese, "README.zh-Hant.md");
    expect(english).toMatch(
      /demo uses synthetic events and brands by default[\s\S]*does not need production credentials or a live connection to The Ground, Google or Cloudflare/i,
    );
    expect(traditionalChinese).toMatch(
      /示範版本預設使用合成活動及品牌資料[\s\S]*不需要正式環境憑證[\s\S]*不需要連接 The Ground、Google 或 Cloudflare/,
    );
  });
});
