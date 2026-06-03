import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import FanPulseDashboard from "@/components/fan-pulse/dashboard";

export const metadata: Metadata = {
  title: "Fan Pulse — Football Nexus",
  description:
    "Real-time football sentiment intelligence. See what fans are feeling, about whom, and why — powered by AI.",
  openGraph: {
    title: "Fan Pulse — Football Nexus",
    description:
      "Real-time football sentiment intelligence. See what fans are feeling, about whom, and why — powered by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fan Pulse — Football Nexus",
    description:
      "Real-time football sentiment intelligence powered by AI.",
  },
};

export default function FanPulsePage() {
  return (
    <>
      <Navbar />
      <FanPulseDashboard />
      <Footer />
    </>
  );
}
