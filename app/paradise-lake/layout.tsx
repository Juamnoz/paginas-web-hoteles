import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paradise Lake · Pool Party Guatapé",
  description: "1 y 2 de marzo · 6 DJs · 24h de música · Barra libre · Peñol, Antioquia",
  icons: { icon: "/favicon.ico" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
