import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Poma Rosa",
  description: "Hotel boutique en el corazón de Laureles-Estadio · Medellín",
  icons: { icon: "/logo-pomarosa-oficial.png", apple: "/logo-pomarosa-oficial.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
