import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Casona Hotel Boutique",
  description: "Hotel boutique rodeado de naturaleza en Laureles · Medellín",
  icons: { icon: "/logo-lacasona.jpg", apple: "/logo-lacasona.jpg" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
