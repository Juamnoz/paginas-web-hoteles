import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiesta el 1 y 2 de mayo · Paradise Lake",
  description: "1 y 2 de mayo · Techno & Techno House · 6 DJs · 24h de música · Barra libre · Peñol, Antioquia",
  icons: { icon: "/logo-paradise-lake.jpeg" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
