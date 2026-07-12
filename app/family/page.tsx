import type { Metadata } from "next";
import { FamilyCareDashboard } from "./family-care-dashboard";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Family care · KinKeep",
  description: "A calm family view for shared health signals, care coordination, and human-approved actions.",
};

export default function FamilyPage() {
  return <FamilyCareDashboard />;
}
