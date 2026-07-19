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
  assert.match(html, /点麦克风说话，或输入文字…/);
  assert.doesNotMatch(html, /只有经过你同意的更新才会与 Elena 共享/);
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
  assert.match(parentBundle, /陪伴助手正在分析您的健康数据/);
  assert.match(parentBundle, /午餐吃了吗？/);
  assert.match(parentBundle, /晚餐吃了吗？/);
  assert.match(parentBundle, /有其中一种/);
  assert.match(parentBundle, /现在遇到了什么问题？/);
  assert.match(parentBundle, /跌倒、胸闷或呼吸困难/);
  assert.match(parentBundle, /我现在联系你的家属好吗？/);
  assert.match(parentBundle, /儿子 David · 约 3 km/);
  assert.match(parentBundle, /已授权共享 · 更新于 2 分钟前/);
  assert.match(parentBundle, /女儿 Elena/);
  assert.match(parentBundle, /未授权位置共享/);
  assert.match(parentBundle, /联系女儿 Elena/);
  assert.match(parentBundle, /暂不联系家属/);
  assert.doesNotMatch(parentBundle, /住得更近|lives nearby/);
  assert.doesNotMatch(parentBundle, /演示位置数据|系统不会自动选择联系人/);
  assert.match(parentBundle, /朗读建议/);
  assert.match(parentBundle, /NurseFirst 6262 6262/);
  assert.doesNotMatch(parentBundle, /请先留在安全位置/);
  assert.doesNotMatch(parentBundle, /你现在有紧急危险吗？/);
  assert.doesNotMatch(parentBundle, /App 推送/);
  assert.doesNotMatch(parentBundle, /30 分钟后|3 分钟后/);
  assert.doesNotMatch(parentBundle, /短信 \+ 电话通知/);
  assert.doesNotMatch(parentBundle, /本地 Demo/);
  assert.doesNotMatch(parentBundle, /90 秒未确认/);

  const sharedCareBundleName = assetNames.find((name) => name.startsWith("care-episode-") && name.endsWith(".js"));
  assert.ok(sharedCareBundleName, "shared care data bundle should be emitted");
  const sharedCareBundle = await readFile(new URL(`../dist/client/assets/${sharedCareBundleName}`, import.meta.url), "utf8");
  assert.match(sharedCareBundle, /5h 12m/);
  assert.match(sharedCareBundle, /消息已准备好/);
  assert.match(sharedCareBundle, /我已在 WhatsApp 发送/);
  assert.match(sharedCareBundle, /拨打妈妈并接手/);
  assert.doesNotMatch(sharedCareBundle, /照护提醒已创建/);
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
  assert.match(familyBundle, /Nearby responder · family caregiver/);
  assert.match(familyBundle, /Current health profile/);
  assert.match(familyBundle, /View all health profiles/);
  assert.match(familyBundle, /2 health profiles · 2 family caregivers/);
  assert.match(familyBundle, /Family app navigation/);
  assert.match(familyBundle, /Family health overview/);
  assert.match(familyBundle, /Another smart monitoring scenario/);
  assert.match(familyBundle, /Other notifications/);
  assert.match(familyBundle, /breathing difficulty/);
  assert.match(familyBundle, /家庭管理员 · 照护决策人/);
  assert.match(familyBundle, /就近响应联系人 · 家属协作者/);
  assert.doesNotMatch(familyBundle, /6h 12m|72 bpm/);
  assert.doesNotMatch(familyBundle, /Highest-priority alert/);
  assert.doesNotMatch(familyBundle, /Demo wandering/);
});

test("server-renders the desktop-friendly family mobile preview", async () => {
  const response = await render("/family/mobile-preview");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Family Mobile Experience/);
  assert.match(html, /KinKeep · Family View/);
  assert.match(html, /src="\/family"/);
  assert.match(html, /Open Desktop View/);
  assert.doesNotMatch(html, /家属端手机效果|桌面演示视口|这个链接只用于演示|演示时建议先打开 PC 版|This preview keeps the live mobile interactions/);

  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.family-preview-workspace\s*\{[^}]*align-items:\s*flex-start;/s);
  assert.match(styles, /\.family-preview-device\s*\{[^}]*flex:\s*0 0 auto;/s);
});
