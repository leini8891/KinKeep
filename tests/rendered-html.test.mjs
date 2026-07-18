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
  assert.doesNotMatch(html, /昨晚睡得比平时少一些/);
  assert.match(html, /href="\/family"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);

  const assetNames = await readdir(new URL("../dist/client/assets/", import.meta.url));
  const parentBundleName = assetNames.find((name) => name.startsWith("parent-health-chat-") && name.endsWith(".js"));
  assert.ok(parentBundleName, "parent client bundle should be emitted");
  const parentBundle = await readFile(new URL(`../dist/client/assets/${parentBundleName}`, import.meta.url), "utf8");
  assert.match(parentBundle, /没有这些情况/);
  assert.match(parentBundle, /None of those/);

  const sharedCareBundleName = assetNames.find((name) => name.startsWith("care-episode-") && name.endsWith(".js"));
  assert.ok(sharedCareBundleName, "shared care data bundle should be emitted");
  const sharedCareBundle = await readFile(new URL(`../dist/client/assets/${sharedCareBundleName}`, import.meta.url), "utf8");
  assert.match(sharedCareBundle, /5h 12m/);
  assert.doesNotMatch(sharedCareBundle, /6h 12m|72 bpm/);
});

test("server-renders the responsive KinKeep family experience", async () => {
  const response = await render("/family");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /家庭总览/);
  assert.match(html, /今日跟进/);
  assert.match(html, /趋势与证据/);
  assert.match(html, /照护日程/);
  assert.match(html, /不是单一心率报警/);
  assert.match(html, /三个跟进方案/);
  assert.match(html, /返回用户端/);
  assert.match(html, /陈家 · 4 位成员/);
  assert.match(html, /弟弟 · David/);
  assert.match(html, /家人健康概览/);
  assert.match(html, /其他智能监测场景/);
  assert.match(html, /体验走失监测/);
  assert.match(html, /通知中心/);
  assert.match(html, /当前健康档案/);
  assert.match(html, /2 个健康档案 · 2 位家属协作者/);
  assert.match(html, /家属端功能/);
  assert.match(html, /5h 12m/);
  assert.match(html, />EN<\/button>/);
  assert.match(html, />中文<\/button>/);
  assert.doesNotMatch(html, /妈妈端/);
  assert.doesNotMatch(html, /最高优先级通知/);
  assert.doesNotMatch(html, /演示走失事件/);
  assert.doesNotMatch(html, /家庭成员与档案/);

  const assetNames = await readdir(new URL("../dist/client/assets/", import.meta.url));
  const familyBundleName = assetNames.find((name) => name.startsWith("family-care-dashboard-") && name.endsWith(".js"));
  assert.ok(familyBundleName, "family client bundle should be emitted");
  const familyBundle = await readFile(new URL(`../dist/client/assets/${familyBundleName}`, import.meta.url), "utf8");
  assert.match(familyBundle, /Family overview/);
  assert.match(familyBundle, /Today&apos;s follow-up|Today's follow-up/);
  assert.match(familyBundle, /Review & act/);
  assert.match(familyBundle, /Back to user view/);
  assert.match(familyBundle, /Brother · family collaborator/);
  assert.match(familyBundle, /Current health profile/);
  assert.match(familyBundle, /View all health profiles/);
  assert.match(familyBundle, /2 health profiles · 2 family caregivers/);
  assert.match(familyBundle, /Family app navigation/);
  assert.match(familyBundle, /Family health overview/);
  assert.match(familyBundle, /Another smart monitoring scenario/);
  assert.match(familyBundle, /Other notifications/);
  assert.match(familyBundle, /breathing difficulty/);
  assert.doesNotMatch(familyBundle, /6h 12m|72 bpm/);
  assert.doesNotMatch(familyBundle, /Highest-priority alert/);
  assert.doesNotMatch(familyBundle, /Demo wandering/);
});

test("server-renders the desktop-friendly family mobile preview", async () => {
  const response = await render("/family/mobile-preview");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /家属端手机效果/);
  assert.match(html, /390 × 844/);
  assert.match(html, /src="\/family"/);
  assert.match(html, /打开 PC 版/);
  assert.match(html, /This preview keeps the live mobile interactions/);
});
