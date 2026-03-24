"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";

const SLIDER_IMAGES = [
  { src: "/hotels/infinity/fachada.jpeg", alt: "Fachada del Infinity Hotel" },
  { src: "/hotels/infinity/suite-premium.jpeg", alt: "Suite Premium con jacuzzi" },
  { src: "/hotels/infinity/suite-gold.jpeg", alt: "Suite Gold con jacuzzi" },
  { src: "/hotels/infinity/habitacion-estandar.jpeg", alt: "Habitación estándar" },
  { src: "/hotels/infinity/habitacion-diamante.jpeg", alt: "Habitación Diamante" },
  { src: "/hotels/infinity/habitacion-tv.jpeg", alt: "Habitación con minibar y TV" },
  { src: "/hotels/infinity/bano-ducha.jpeg", alt: "Baño con ducha de cristal" },
];

const LINKS = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Sitio oficial · Mejor precio",
    href: "https://infinityhotel.com.co/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    primary: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "Reserva directa",
    href: "https://wa.me/573008503722",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "booking",
    label: "Booking.com",
    sublabel: "Ver disponibilidad",
    href: "https://www.booking.com/Share-3oRB8S",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.2 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V6.8L17.2 0zM16 2l4 4h-4V2zm2 20H6V14h12v8zm0-10H6v-2h12v2zm0-4H6V6h12v2z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "expedia",
    label: "Expedia",
    sublabel: "Ofertas y paquetes",
    href: "https://www.expedia.com/es/Medellin-Hoteles-Ayenda-1239-Infinity.h38964885.Informacion-Hotel",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    primary: false,
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/infinityhoteloficial?igsh=eG56c2VybjM3ZmE3",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1DjgbdaLmY/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "5★", label: "Calificación" },
  { value: "69", label: "Reseñas" },
  { value: "La 70", label: "Boulevard" },
  { value: "Mod.", label: "Moderno" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function InfinityPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(160deg, #100e08 0%, #181408 50%, #201a0a 100%)",
      }}
    >
      {/* Infinity / geometric light decorations */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        {/* Top-left glow */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #c8a84b 0%, transparent 70%)" }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #a07830 0%, transparent 70%)" }}
        />
        {/* Center top subtle line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 opacity-20"
          style={{ background: "linear-gradient(to bottom, #c8a84b, transparent)" }}
        />
        {/* Geometric grid hint */}
        <svg
          className="absolute top-8 right-8 opacity-10 w-32 h-32"
          viewBox="0 0 128 128"
          fill="none"
        >
          <circle cx="64" cy="64" r="60" stroke="#c8a84b" strokeWidth="0.5" />
          <circle cx="64" cy="64" r="40" stroke="#c8a84b" strokeWidth="0.5" />
          <circle cx="64" cy="64" r="20" stroke="#c8a84b" strokeWidth="0.5" />
          <line x1="4" y1="64" x2="124" y2="64" stroke="#c8a84b" strokeWidth="0.5" />
          <line x1="64" y1="4" x2="64" y2="124" stroke="#c8a84b" strokeWidth="0.5" />
        </svg>
        <svg
          className="absolute bottom-8 left-8 opacity-10 w-24 h-24 rotate-45"
          viewBox="0 0 96 96"
          fill="none"
        >
          <rect x="4" y="4" width="88" height="88" stroke="#c8a84b" strokeWidth="0.5" />
          <rect x="20" y="20" width="56" height="56" stroke="#c8a84b" strokeWidth="0.5" />
          <rect x="36" y="36" width="24" height="24" stroke="#c8a84b" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div
        className="w-full max-w-[430px] flex flex-col items-center gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo & Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 pt-2">
          <div
            className="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
            style={{
              background: "#f5f2ec",
              border: "2px solid rgba(200,168,75,0.5)",
              padding: "6px",
            }}
          >
            <Image
              src="/logo-infinity.png"
              alt="Infinity Hotel"
              width={144}
              height={144}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "#c8a84b" }}
            >
              Exclusivo · Moderno · Laureles
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "#c8b888" }}>
              Estilo contemporáneo a dos cuadras del Boulevard de la 70
            </p>
          </div>
        </motion.div>

        {/* Image Slider */}
        <motion.div variants={itemVariants} className="w-full">
          <ImageSlider
            images={SLIDER_IMAGES}
            accentColor="#c8a84b"
            dotColor="#c8a84b"
            borderColor="rgba(200,168,75,0.3)"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="w-full grid grid-cols-4 gap-2 px-2"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-3 px-2 rounded-xl"
              style={{
                background: "rgba(0,198,255,0.07)",
                border: "1px solid rgba(0,198,255,0.2)",
              }}
            >
              <span className="font-bold text-lg leading-none" style={{ color: "#c8a84b" }}>
                {stat.value}
              </span>
              <span className="text-[10px] mt-1 text-center leading-tight" style={{ color: "#a08848" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Main Links */}
        <div className="w-full flex flex-col gap-3 px-2">
          {LINKS.map((link) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
              style={
                link.primary
                  ? {
                      background: "linear-gradient(135deg, #c8a84b 0%, #a07830 100%)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,198,255,0.2)",
                      color: "#e0f0ff",
                      backdropFilter: "blur(10px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(255,255,255,0.2)" }
                    : { background: "rgba(0,198,255,0.12)", color: "#c8a84b" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(255,255,255,0.75)" : "#a08848" }}
                  >
                    {link.sublabel}
                  </p>
                )}
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 flex-shrink-0 opacity-40"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-full px-2 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(0,198,255,0.2)" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#a08848" }}>
            Síguenos
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,198,255,0.2)" }} />
        </motion.div>

        {/* Social Icons */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          {SOCIALS.map((social) => (
            <motion.a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "rgba(0,198,255,0.08)",
                border: "1px solid rgba(0,198,255,0.25)",
                color: "#c8a84b",
                backdropFilter: "blur(10px)",
              }}
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Location */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#a08848" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Laureles, Medellín, Antioquia</span>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3 pb-6"
        >
          <a
            href="https://www.instagram.com/laagenciamarketing?igsh=cWZpMjI2OHdlbjl5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,198,255,0.2)",
            }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#c8b888" }}>
              Impulsado por <strong style={{ color: "#c8a84b" }}>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#4a3a10" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
