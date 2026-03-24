"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";

const SLIDER_IMAGES = [
  { src: "/hotels/terrabella/habitacion-piedra.jpeg", alt: "Habitación con muro de piedra" },
  { src: "/hotels/terrabella/habitacion-madera.jpeg", alt: "Habitación amplia en madera" },
  { src: "/hotels/terrabella/piscina-interior.jpeg", alt: "Piscina interior" },
  { src: "/hotels/terrabella/jacuzzi-suite.jpeg", alt: "Suite con jacuzzi" },
  { src: "/hotels/terrabella/jacuzzi-relax.jpeg", alt: "Zona de relajación con jacuzzi" },
  { src: "/hotels/terrabella/exterior-bambu.jpeg", alt: "Exterior rodeado de bambú" },
  { src: "/hotels/terrabella/terraza-deck.jpeg", alt: "Terraza y deck exterior" },
];

const LINKS = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Habitaciones disponibles",
    href: "https://hotelterrabella.com.co/reservar/",
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
    href: "https://wa.me/573016430309",
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
    sublabel: "Ver opiniones y reservar",
    href: "https://www.booking.com/Share-DQCZot",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.2 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V6.8L17.2 0zM16 2l4 4h-4V2zm2 20H6V14h12v8zm0-10H6v-2h12v2zm0-4H6V6h12v2z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "tripadvisor",
    label: "TripAdvisor",
    sublabel: "#1 en Santa Elena · 4 estrellas",
    href: "https://www.tripadvisor.co/Hotel_Review-g2282815-d7101850-Reviews-Eco_Hotel_Terrabella-Santa_Elena_Medellin_Antioquia_Department.html?m=19905",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
      </svg>
    ),
    primary: false,
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@ecohotelterrabella",
    href: "https://www.instagram.com/ecohotelterrabella?igsh=MXB3NXAwaWtzNnAzYg==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/179Bd21EXL/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@ecohotelterrabella?_r=1&_t=ZS-94qfVYZZ8zM",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.23 8.23 0 004.82 1.56V6.79a4.85 4.85 0 01-1.05-.1z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "4★", label: "Estrellas" },
  { value: "31", label: "Habitaciones" },
  { value: "#1", label: "Santa Elena" },
  { value: "21K", label: "Seguidores" },
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

export default function TerrabellaPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(160deg, #faf6f0 0%, #f2ebe0 50%, #e8ddd0 100%)",
      }}
    >
      {/* Leaf decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none opacity-20 select-none">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path d="M10 110 Q30 60 80 20 Q60 70 10 110Z" fill="#6b5040" />
          <path d="M10 110 Q55 85 80 20" stroke="#b8936a" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none opacity-20 select-none rotate-90">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path d="M10 110 Q30 60 80 20 Q60 70 10 110Z" fill="#6b5040" />
          <path d="M10 110 Q55 85 80 20" stroke="#b8936a" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-36 h-36 pointer-events-none opacity-15 select-none rotate-180">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          <path d="M10 110 Q30 60 80 20 Q60 70 10 110Z" fill="#6b5040" />
        </svg>
      </div>

      <motion.div
        className="w-full max-w-[430px] flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo & Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 pt-2">
          <div
            className="w-28 h-28 rounded-full overflow-hidden shadow-lg"
            style={{ border: "2px solid #e8ddd0" }}
          >
            <Image
              src="/logo-terrabella.png"
              alt="Eco Hotel Terrabella"
              width={112}
              height={112}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#2c2420", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Eco Hotel Terrabella
            </h1>
            <p className="text-sm mt-1 tracking-widest uppercase" style={{ color: "#b8936a" }}>
              Eco Hotel · Restaurante · Santa Elena
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "#6b5040" }}>
              Refugio de naturaleza y bienestar en las montañas de Antioquia
            </p>
          </div>
        </motion.div>

        {/* Image Slider */}
        <motion.div variants={itemVariants} className="w-full">
          <ImageSlider
            images={SLIDER_IMAGES}
            accentColor="#b8936a"
            borderColor="#e8ddd0"
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
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e8ddd0" }}
            >
              <span className="font-bold text-lg leading-none" style={{ color: "#9a7050" }}>
                {stat.value}
              </span>
              <span className="text-[10px] mt-1 text-center leading-tight" style={{ color: "#b8936a" }}>
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
              className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              style={
                link.primary
                  ? {
                      background: "linear-gradient(135deg, #b8936a 0%, #9a7050 100%)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.75)",
                      border: "1px solid #e8ddd0",
                      color: "#2c2420",
                      backdropFilter: "blur(8px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(255,255,255,0.2)" }
                    : { background: "linear-gradient(135deg, #b8936a22 0%, #b8936a11 100%)", color: "#b8936a" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(255,255,255,0.75)" : "#b8936a" }}
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
                className="w-4 h-4 flex-shrink-0 opacity-50"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-full px-2 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "#e8ddd0" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#d4b896" }}>
            Síguenos
          </span>
          <div className="flex-1 h-px" style={{ background: "#e8ddd0" }} />
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
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid #e8ddd0",
                color: "#b8936a",
                backdropFilter: "blur(8px)",
              }}
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Map */}
        <motion.div variants={itemVariants} className="w-full px-2">
          <div
            className="w-full rounded-2xl overflow-hidden shadow-sm"
            style={{ border: "1px solid #e8ddd0" }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Eco+Hotel+Terrabella+Santa+Elena+Medellín&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Eco Hotel Terrabella"
            />
          </div>
          <a
            href="https://www.google.com/maps/search/Eco+Hotel+Terrabella+Santa+Elena+Medellín"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm mt-2 hover:underline"
            style={{ color: "#9a7050" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Santa Elena, Medellín, Antioquia</span>
          </a>
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
            style={{ background: "rgba(255,255,255,0.5)", border: "1px solid #e8ddd0" }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#9a7050" }}>
              Impulsado por <strong>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#d4b896" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
