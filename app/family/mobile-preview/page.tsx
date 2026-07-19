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
          <span>KinKeep · Family View</span>
          <h1>Family Mobile Experience</h1>
        </div>
        <Link href="/family">Open Desktop View</Link>
      </header>

      <section className="family-preview-workspace">
        <div className="family-preview-device" aria-label="KinKeep family mobile preview">
          <div className="family-preview-speaker" aria-hidden="true" />
          <iframe
            src="/family"
            title="KinKeep family mobile experience"
            loading="eager"
          />
        </div>
      </section>
    </main>
  );
}
