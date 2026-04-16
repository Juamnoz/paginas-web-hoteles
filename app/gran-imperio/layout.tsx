import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Gran Imperio | Laureles · Medellín",
  description:
    "Hotel 3 estrellas en el corazón de Laureles-Estadio. A 2 cuadras de la 70 y 450 m del metro. 58 habitaciones, desayuno americano incluido, WiFi, parqueadero y seguridad 24h.",
  keywords: ["hotel gran imperio", "hotel medellin", "hotel laureles", "hotel estadio medellin", "hotel cerca 70 medellin"],
  icons: {
    icon:  "/hotels/gran-imperio/logo.png",
    apple: "/hotels/gran-imperio/logo.png",
  },
  openGraph: {
    title: "Hotel Gran Imperio | Laureles · Medellín",
    description: "Hotel 3★ en Laureles-Estadio. Desayuno incluido, WiFi, parqueadero y seguridad 24h.",
    images: ["/hotels/gran-imperio/hab-multiple.jpeg"],
    locale: "es_CO",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
