import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eco Hotel Terrabella",
  description: "Refugio de naturaleza y bienestar en las montañas de Antioquia · Santa Elena",
  icons: { icon: "/logo-terrabella.png", apple: "/logo-terrabella.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
