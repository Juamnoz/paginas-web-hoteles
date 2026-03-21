import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infinity Hotel",
  description: "Exclusivo y moderno hotel en Laureles · Medellín",
  icons: { icon: "/logo-infinity.png", apple: "/logo-infinity.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
