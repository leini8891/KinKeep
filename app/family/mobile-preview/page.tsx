import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mobile preview · KinKeep family care",
  description: "A desktop-friendly preview of the KinKeep family mobile experience.",
};

export default function FamilyMobilePreviewPage() {
  return (
    <main className="family-preview-stage">
      <header className="family-preview-header">
        <div>
          <span>KinKeep · Mobile Preview</span>
          <h1>家属端手机效果</h1>
          <p>桌面演示视口 390 × 844 · 可直接点击和切换中英文</p>
        </div>
        <Link href="/family">打开 PC 版</Link>
      </header>

      <section className="family-preview-workspace">
        <div className="family-preview-device" aria-label="KinKeep 家属端手机预览">
          <div className="family-preview-speaker" aria-hidden="true" />
          <iframe
            src="/family"
            title="KinKeep family mobile experience"
            loading="eager"
          />
        </div>
        <aside className="family-preview-note">
          <strong>这个链接只用于演示</strong>
          <p>正式家属端仍然使用同一个地址，并根据手机或电脑屏幕自动显示对应界面。</p>
          <p>演示时建议先打开 PC 版，再用此页讲解健康档案选择器、通知和家庭分工。</p>
          <small>This preview keeps the live mobile interactions inside a 390 px viewport.</small>
        </aside>
      </section>
    </main>
  );
}
