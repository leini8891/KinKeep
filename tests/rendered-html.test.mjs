import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  assert.match(html, /连接 Apple Watch/);
  assert.match(html, /同步健康数据/);
  assert.doesNotMatch(html, /今早健康概览/);
  assert.match(html, /用户端/);
  assert.match(html, /家属端/);
  assert.doesNotMatch(html, /妈妈端/);
  assert.match(html, /点麦克风说话；录音仅用于本次转写/);
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
  assert.match(html, /返回用户端/);
  assert.match(html, /陈家 · 4 位成员/);
  assert.match(html, /弟弟 · 家属协作者/);
  assert.match(html, /当前健康档案/);
  assert.match(html, /2 个健康档案 · 2 位家属协作者/);
  assert.match(html, /家属端功能/);
  assert.match(html, />EN<\/button>/);
  assert.match(html, />中文<\/button>/);
  assert.doesNotMatch(html, /妈妈端/);

  const assetNames = await readdir(new URL("../dist/client/assets/", import.meta.url));
  const familyBundleName = assetNames.find((name) => name.startsWith("family-care-dashboard-") && name.endsWith(".js"));
  assert.ok(familyBundleName, "family client bundle should be emitted");
  const familyBundle = await readFile(new URL(`../dist/client/assets/${familyBundleName}`, import.meta.url), "utf8");
  assert.match(familyBundle, /Family overview/);
  assert.match(familyBundle, /Actions awaiting approval/);
  assert.match(familyBundle, /Back to user view/);
  assert.match(familyBundle, /Brother · family collaborator/);
  assert.match(familyBundle, /Current health profile/);
  assert.match(familyBundle, /View all health profiles/);
  assert.match(familyBundle, /2 health profiles · 2 family caregivers/);
  assert.match(familyBundle, /Family app navigation/);
});
