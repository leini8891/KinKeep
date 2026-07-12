import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the KinKeep parent companion", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KinKeep · Family health companion<\/title>/i);
  assert.match(html, /陈阿姨/);
  assert.match(html, /Apple Watch/);
  assert.match(html, /今早健康概览/);
  assert.match(html, /需要帮助/);
  assert.match(html, /href="\/family"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders the responsive KinKeep family experience", async () => {
  const response = await render("/family");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /家庭总览/);
  assert.match(html, /趋势与证据/);
  assert.match(html, /照护日程/);
  assert.match(html, /待批准/);
  assert.match(html, /不是单一心率报警/);
  assert.match(html, /高影响行动闸门/);
});
