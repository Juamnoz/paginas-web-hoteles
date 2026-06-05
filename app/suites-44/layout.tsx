import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Suites 44 Laureles",
  description: "Hotel boutique en el corazón de Laureles · Medellín",
  icons: { icon: "/hotels/suites-44/logo-suites-44.PNG", apple: "/hotels/suites-44/logo-suites-44.PNG" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
