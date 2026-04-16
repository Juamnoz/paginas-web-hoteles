"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Menu, X,
  Wifi, Coffee, Car, Shield,
  UtensilsCrossed, PawPrint, MapPin,
  Phone, Mail, Users,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const HOSROOM  = "https://sys.hosroom.com/booking/148-hotel-gran-imperio";
const WA       = "https://wa.me/573128369410?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20Hotel%20Gran%20Imperio";
const PHONE_   = "tel:+573128369410";
const EMAIL_   = "mailto:hotelgranimperio1@gmail.com";
const IG       = "https://www.instagram.com/hotelgranimperio";
const GOLD     = "#d4af37";
const GOLD_DK  = "#a88e32";
const EASE     = [0.22, 1, 0.36, 1] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#reservar",     label: "Reservar"      },
  { href: "#galeria",      label: "Galería"       },
  { href: "#servicios",    label: "Servicios"     },
  { href: "#ubicacion",    label: "Ubicación"     },
  { href: "#contacto",     label: "Contacto"      },
];

const ROOMS = [
  {
    id: "doble",
    name: "Habitación Doble",
    capacity: "1 – 2 personas",
    description:
      "Acogedora habitación con cama doble o dos sencillas, baño privado en mármol negro, TV satelital y WiFi. Ideal para viajeros y parejas.",
    amenities: ["Baño privado", "TV satelital", "WiFi", "Agua caliente", "A/C"],
    images: [
      "/hotels/gran-imperio/img-1.jpeg",
      "/hotels/gran-imperio/heic-1.jpeg",
      "/hotels/gran-imperio/bano-1.jpeg",
    ],
  },
  {
    id: "triple",
    name: "Habitación Triple",
    capacity: "Hasta 3 personas",
    description:
      "Habitación espaciosa con tres camas individuales, perfecta para amigos o familias pequeñas. Baño privado de lujo y todos los servicios incluidos.",
    amenities: ["Baño privado", "TV satelital", "WiFi", "Agua caliente", "A/C"],
    images: [
      "/hotels/gran-imperio/heic-3.jpeg",
      "/hotels/gran-imperio/hab-multiple.jpeg",
      "/hotels/gran-imperio/bano-2.jpeg",
    ],
  },
  {
    id: "multiple",
    name: "Habitación Múltiple",
    capacity: "Hasta 5 personas",
    description:
      "Nuestra habitación más amplia para grupos y familias. Varias camas dobles, baño privado premium y espacio para todos. La estadía perfecta en Medellín.",
    amenities: ["Baño privado", "TV satelital", "WiFi", "Agua caliente", "A/C", "Ventilador"],
    images: [
      "/hotels/gran-imperio/hab-multiple.jpeg",
      "/hotels/gran-imperio/heic-1.jpeg",
      "/hotels/gran-imperio/bano-3.jpeg",
    ],
  },
];

const GALLERY = [
  { src: "/hotels/gran-imperio/hab-multiple.jpeg", alt: "Habitación múltiple" },
  { src: "/hotels/gran-imperio/bano-1.jpeg",       alt: "Baño de lujo"        },
  { src: "/hotels/gran-imperio/heic-1.jpeg",       alt: "Habitación doble"    },
  { src: "/hotels/gran-imperio/bano-2.jpeg",       alt: "Ducha en vidrio"     },
  { src: "/hotels/gran-imperio/heic-3.jpeg",       alt: "Habitación triple"   },
  { src: "/hotels/gran-imperio/bano-3.jpeg",       alt: "Baño completo"       },
];

const AMENITIES = [
  { Icon: Coffee,         label: "Desayuno americano",   desc: "Incluido en tu estadía"    },
  { Icon: Wifi,           label: "WiFi alta velocidad",  desc: "En todas las áreas"         },
  { Icon: Car,            label: "Parqueadero",          desc: "Disponible en el hotel"     },
  { Icon: Shield,         label: "Seguridad 24 h",       desc: "Vigilancia permanente"      },
  { Icon: UtensilsCrossed,label: "Snack Bar",            desc: "Bebidas y refrigerios"      },
  { Icon: PawPrint,       label: "Pet Friendly",         desc: "Mascotas bienvenidas"       },
];

// ─── Animation variant ────────────────────────────────────────────────────────
const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
});

// ─── WhatsApp Icon ────────────────────────────────────────────────────────────
function WAIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,8,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${GOLD}25` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#1a1a1a]"
            style={{ border: `1.5px solid ${GOLD}` }}
          >
            <Image
              src="/hotels/gran-imperio/logo.png"
              alt="Gran Imperio"
              width={40}
              height={40}
              className="object-contain"
              unoptimized
            />
          </div>
          <span
            className="font-bold text-base hidden sm:block"
            style={{ color: GOLD, fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Gran Imperio
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: scrolled ? "#ccc" : "rgba(255,255,255,0.85)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + burger */}
        <div className="flex items-center gap-3">
          <a
            href={HOSROOM}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: GOLD, color: "#111" }}
          >
            Reservar ahora
          </a>
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setOpen(!open)}
            style={{ color: GOLD }}
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 py-5 flex flex-col gap-4"
          style={{ background: "rgba(8,8,8,0.97)", borderTop: `1px solid ${GOLD}25` }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium"
              style={{ color: "#ccc" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href={HOSROOM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-4 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: GOLD, color: "#111" }}
            onClick={() => setOpen(false)}
          >
            Reservar ahora
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Hero CTA ─────────────────────────────────────────────────────────────────
function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a
        href="#reservar"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-2xl text-sm shadow-xl transition-opacity hover:opacity-88"
        style={{ background: GOLD, color: "#111" }}
      >
        Verificar disponibilidad
      </a>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-opacity hover:opacity-80"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          backdropFilter: "blur(12px)",
        }}
      >
        <WAIcon size={16} />
        Consultar por WhatsApp
      </a>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({ room, index }: { room: (typeof ROOMS)[0]; index: number }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? room.images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === room.images.length - 1 ? 0 : i + 1));

  return (
    <motion.div
      {...fadeUp(index * 0.1)}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#181818", border: `1px solid ${GOLD}28` }}
    >
      {/* Carousel */}
      <div className="relative h-56">
        <Image
          src={room.images[idx]}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {room.images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/55 text-white hover:bg-black/75 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/55 text-white hover:bg-black/75 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {room.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{ background: i === idx ? GOLD : "rgba(255,255,255,0.4)" }}
                />
              ))}
            </div>
          </>
        )}
        {/* Capacity badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(8,8,8,0.82)", color: GOLD, border: `1px solid ${GOLD}40` }}
        >
          <Users size={10} />
          {room.capacity}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: GOLD, fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {room.name}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#999" }}>
          {room.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-5">
          {room.amenities.map((a) => (
            <span
              key={a}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${GOLD}15`, color: GOLD_DK, border: `1px solid ${GOLD}30` }}
            >
              {a}
            </span>
          ))}
        </div>
        <a
          href={HOSROOM}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: GOLD, color: "#111" }}
        >
          Ver disponibilidad
        </a>
      </div>
    </motion.div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function Gallery() {
  return (
    <section id="galeria" className="py-14" style={{ background: "#0e0e0e" }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
            Galería
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Vive la experiencia
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
            Habitaciones modernas, baños de lujo y espacios diseñados para su confort en el corazón de Medellín.
          </p>
        </motion.div>

        {/* Desktop: large left + 2×2 right */}
        <div className="hidden md:grid grid-cols-3 gap-3" style={{ gridTemplateRows: "260px 260px" }}>
          <motion.div
            {...fadeUp(0)}
            style={{ gridRow: "1 / 3" }}
            className="relative overflow-hidden rounded-2xl group"
          >
            <Image
              src={GALLERY[0].src}
              alt={GALLERY[0].alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="33vw"
            />
            <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
          </motion.div>
          {GALLERY.slice(1).map((photo, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08 + 0.1)}
              className="relative overflow-hidden rounded-2xl group"
              style={{ minHeight: "260px" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="33vw"
              />
              <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <Image src={GALLERY[0].src} alt={GALLERY[0].alt} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY.slice(1, 5).map((photo, i) => (
              <div key={i} className="relative h-36 rounded-2xl overflow-hidden">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Servicios ────────────────────────────────────────────────────────────────
function Servicios() {
  return (
    <section id="servicios" className="py-14" style={{ background: "#080808" }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
            Servicios
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Todo lo que necesitas
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
            Comodidad y seguridad en cada detalle para que disfrutes al máximo tu estadía.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {AMENITIES.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.08)}
              className="flex flex-col items-center text-center p-6 rounded-2xl"
              style={{ background: "#181818", border: `1px solid ${GOLD}20` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${GOLD}15` }}
              >
                <Icon size={22} style={{ color: GOLD }} />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "#f5f5f5" }}>
                {label}
              </p>
              <p className="text-xs" style={{ color: "#666" }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Check-in / Check-out info */}
        <motion.div {...fadeUp(0.4)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          {[
            { label: "Check-in",  value: "3:00 PM" },
            { label: "Check-out", value: "1:00 PM" },
            { label: "Recepción", value: "24 horas" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center px-8 py-4 rounded-2xl"
              style={{ background: "#181818", border: `1px solid ${GOLD}25` }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD_DK }}>
                {item.label}
              </p>
              <p className="font-bold text-lg" style={{ color: "#f5f5f5" }}>
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Ubicación ────────────────────────────────────────────────────────────────
function Ubicacion() {
  const steps = [
    {
      icon: "🚇",
      from: "Metro",
      to: "Estación Estadio",
      desc: "Línea A del Metro de Medellín. Baje en Estación Estadio, a solo 450 m del hotel.",
    },
    {
      icon: "🚌",
      from: "Bus",
      to: "Avenida 70",
      desc: "Múltiples rutas de bus transitan por la 70. El hotel está a 2 cuadras.",
    },
    {
      icon: "🚕",
      from: "Taxi / Uber",
      to: "Cra 69 #43-32",
      desc: "Diga al conductor: Cra 69 con calle 43, barrio Laureles-Estadio.",
    },
    {
      icon: "🏨",
      from: "Llegada",
      to: "Gran Imperio",
      desc: "Check-in desde las 3:00 PM. Recepción 24 horas siempre disponible.",
    },
  ];

  return (
    <section id="ubicacion" className="py-14" style={{ background: "#111" }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
            Ubicación
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            En el corazón de Laureles
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
            A solo 2 cuadras de la 70 y 450 m del metro Estadio. La mejor ubicación al mejor precio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-1">
            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ background: "#1a1a1a", border: `1px solid ${GOLD}40` }}
                  >
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: `${GOLD}20`, minHeight: "28px" }} />
                  )}
                </div>
                <div className="pb-7">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "#e5e5e5" }}>{step.from}</span>
                    <span style={{ color: GOLD }}>→</span>
                    <span className="font-semibold text-sm" style={{ color: GOLD }}>{step.to}</span>
                  </div>
                  <p className="text-sm" style={{ color: "#888" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <motion.div {...fadeUp(0.2)}>
            <div
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{ border: `1px solid ${GOLD}30` }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Hotel+Gran+Imperio+Medellin&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Hotel Gran Imperio"
              />
            </div>
            <a
              href="https://www.google.com/maps/place/Hotel+Gran+Imperio/@6.2484959,-75.5873436,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm mt-3 hover:underline"
              style={{ color: GOLD }}
            >
              <MapPin size={14} />
              Cra 69 #43-32, Barrio Laureles, Medellín
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Contacto ─────────────────────────────────────────────────────────────────
function Contacto() {
  const items = [
    {
      label: "WhatsApp",
      value: "312 836 9410",
      href: WA,
      bg: "#25D366",
      icon: <WAIcon size={22} />,
      textColor: "white",
    },
    {
      label: "Teléfono",
      value: "312 836 9410",
      href: PHONE_,
      bg: GOLD,
      icon: <Phone size={22} color="#111" />,
      textColor: "#111",
    },
    {
      label: "Email",
      value: "hotelgranimperio1",
      href: EMAIL_,
      bg: "#1a1a1a",
      icon: <Mail size={22} style={{ color: GOLD }} />,
      textColor: "white",
    },
    {
      label: "Instagram",
      value: "@hotelgranimperio",
      href: IG,
      bg: "linear-gradient(135deg,#f09433 0%,#dc2743 50%,#bc1888 100%)",
      icon: (
        <svg width={22} height={22} viewBox="0 0 24 24" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      textColor: "white",
    },
  ];

  return (
    <section id="contacto" className="py-14" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
            Contacto
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mt-2"
            style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Estamos para servirle
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
            Recepción 24 horas. Escríbanos o llámenos y respondemos de inmediato.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              {...fadeUp(i * 0.08)}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl transition-all"
              style={{ background: "#181818", border: `1px solid ${GOLD}22` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: item.bg }}
              >
                {item.icon}
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#555" }}
              >
                {item.label}
              </span>
              <span className="text-sm font-medium" style={{ color: "#e5e5e5" }}>
                {item.value}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="text-center mt-10">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-2xl shadow-lg transition-opacity hover:opacity-90 text-base"
            style={{ background: "#25D366", color: "white" }}
          >
            <WAIcon size={22} />
            Reservar por WhatsApp
          </a>
          <p className="text-xs mt-3" style={{ color: "#444" }}>
            O usa nuestro{" "}
            <a href={HOSROOM} target="_blank" rel="noopener noreferrer" style={{ color: GOLD_DK, textDecoration: "underline" }}>
              motor de reservas oficial
            </a>{" "}
            para garantizar el mejor precio
          </p>
        </motion.div>
      </div>

      {/* Floating WA button */}
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: "#25D366" }}
        aria-label="WhatsApp"
      >
        <WAIcon size={28} />
      </a>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-10 px-4"
      style={{ background: "#050505", borderTop: `1px solid ${GOLD}18` }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full overflow-hidden shrink-0"
            style={{ border: `1.5px solid ${GOLD}` }}
          >
            <Image
              src="/hotels/gran-imperio/logo.png"
              alt="Gran Imperio"
              width={36}
              height={36}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <p
              className="font-bold text-sm"
              style={{ color: GOLD, fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Hotel Gran Imperio
            </p>
            <p className="text-xs" style={{ color: "#444" }}>
              Cra 69 #43-32, Laureles, Medellín · 3★
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs hover:underline"
              style={{ color: "#555" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Agency badge */}
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://www.instagram.com/laagenciamarketing?igsh=cWZpMjI2OHdlbjl5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80 transition-opacity"
            style={{ background: "#181818", border: `1px solid ${GOLD}28` }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: GOLD }}>
              Impulsado por <strong>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#333" }}>
            © 2026 Hotel Gran Imperio · Desarrollado por AIC Studio
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GranImperioPage() {
  return (
    <div style={{ background: "#111", color: "#f5f5f5" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dark base — detrás del video */}
        <div className="absolute inset-0" style={{ background: "#080808" }} />

        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.45 }}
        >
          <source src="/hotels/gran-imperio/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — oscurece bordes, preserva video al centro */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Gold vignette accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${GOLD}10 0%, transparent 65%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{
              background: `${GOLD}18`,
              border: `1px solid ${GOLD}40`,
              color: GOLD,
            }}
          >
            Laureles · Estadio · Medellín
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-5 drop-shadow-2xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span style={{ color: "#f5f5f5" }}>Hotel</span>{" "}
            <span style={{ color: GOLD }}>Gran</span>
            <br />
            <span style={{ color: "#f5f5f5" }}>Imperio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            className="text-base sm:text-lg max-w-xl mx-auto mb-7 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Hotel 3 estrellas en el corazón de Laureles. A solo 2 cuadras de la 70 y
            450 m del metro. Desayuno americano incluido.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: EASE }}
          >
            <HeroCTA />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
          >
            {["58 habitaciones", "Hotel 3★", "Desayuno incluido", "Pet Friendly"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span style={{ color: GOLD }}>✦</span> {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className="w-5 h-8 rounded-full flex justify-center pt-1.5"
            style={{ border: `2px solid ${GOLD}55` }}
          >
            <div className="w-1 h-2 rounded-full" style={{ background: `${GOLD}55` }} />
          </div>
        </div>
      </section>

      {/* ── Habitaciones ── */}
      <section id="habitaciones" className="py-14" style={{ background: "#111" }}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
              Nuestras habitaciones
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-2"
              style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Comodidad y distinción
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
              58 habitaciones con baños en mármol negro, TV satelital y WiFi de alta velocidad.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Motor de reservas ── */}
      <section id="reservar" className="py-14" style={{ background: "#0a0a0a" }}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_DK }}>
              Reservas en línea
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mt-2"
              style={{ color: "#f5f5f5", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Reserva directamente aquí
            </h2>
            <p className="mt-2 max-w-xl mx-auto text-sm" style={{ color: "#777" }}>
              Mejor precio garantizado · Solo en nuestro sitio oficial.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: `1px solid ${GOLD}35` }}
          >
            {/* Header integrado */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "#181818",
                borderBottom: `1px solid ${GOLD}25`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                  style={{ border: `1px solid ${GOLD}60` }}
                >
                  <Image
                    src="/hotels/gran-imperio/logo.png"
                    alt="Gran Imperio"
                    width={32}
                    height={32}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: GOLD }}>
                    Hotel Gran Imperio
                  </p>
                  <p className="text-[10px]" style={{ color: "#555" }}>
                    Motor de reservas oficial · Pago seguro
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}35` }}
                >
                  ✦ Mejor precio
                </span>
              </div>
            </div>

            {/* iframe */}
            <iframe
              src="https://sys.hosroom.com/booking/148-hotel-gran-imperio"
              width="100%"
              height="520"
              style={{ border: 0, display: "block", background: "#fff" }}
              loading="lazy"
              title="Motor de reservas Hotel Gran Imperio"
            />

            {/* Footer integrado */}
            <div
              className="flex items-center justify-center gap-4 px-5 py-3 flex-wrap"
              style={{ background: "#181818", borderTop: `1px solid ${GOLD}20` }}
            >
              <span className="text-[10px] flex items-center gap-1" style={{ color: "#555" }}>
                🔒 Pago 100% seguro
              </span>
              <span className="text-[10px]" style={{ color: "#333" }}>·</span>
              <span className="text-[10px]" style={{ color: "#555" }}>
                Recepción 24 h · +57 312 836 9410
              </span>
              <span className="text-[10px]" style={{ color: "#333" }}>·</span>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] hover:underline"
                style={{ color: GOLD_DK }}
              >
                ¿Necesitas ayuda? WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Gallery />
      <Servicios />
      <Ubicacion />
      <Contacto />
      <Footer />
    </div>
  );
}
