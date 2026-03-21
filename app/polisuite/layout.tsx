import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Polisuite",
  description: "Habitaciones cómodas con atención cordial en Bello · Antioquia",
  icons: { icon: "/logo-polisuite.png", apple: "/logo-polisuite.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
