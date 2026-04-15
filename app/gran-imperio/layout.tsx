import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Gran Imperio",
  description: "A solo 2 cuadras de la 70, te ofrecemos la mejor ubicación al mejor precio.",
  icons: { icon: "/hotels/gran-imperio/logo.png", apple: "/hotels/gran-imperio/logo.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
