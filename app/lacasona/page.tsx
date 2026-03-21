"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Sitio oficial · Mejor precio",
    href: "https://lacasonahotelboutique.com.co/",
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
    href: "https://wa.me/573053477839",
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
    href: "https://www.booking.com/Share-VcRXaM",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.2 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V6.8L17.2 0zM16 2l4 4h-4V2zm2 20H6V14h12v8zm0-10H6v-2h12v2zm0-4H6V6h12v2z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "hoteles",
    label: "Hoteles.com",
    sublabel: "Reserva con beneficios",
    href: "https://co.hoteles.com/ho2871374016/ayenda-la-casona-laureles-medellin-colombia/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "tripadvisor",
    label: "TripAdvisor",
    sublabel: "Reseñas verificadas",
    href: "https://www.tripadvisor.co/Hotel_Review-g297478-d25789013-Reviews-La_Casona_Hotel_Boutique-Medellin_Antioquia_Department.html?m=19905",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "expedia",
    label: "Expedia",
    sublabel: "Ofertas y paquetes",
    href: "https://www.expedia.com/es/Medellin-Hoteles-Ayenda-La-Casona-Laureles.h89699188.Informacion-Hotel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
    primary: false,
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/lacasonalaureles?igsh=MWExM3FwYmw0azE5Zg==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "5★", label: "Calificación" },
  { value: "79", label: "Reseñas" },
  { value: "Bout.", label: "Boutique" },
  { value: "L-E", label: "Laureles" },
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

export default function LaCasonaPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(160deg, #fdf8f3 0%, #f5ede0 50%, #edddd0 100%)",
      }}
    >
      {/* Colonial arch decorations */}
      <div className="fixed top-0 left-0 w-40 h-40 pointer-events-none opacity-15 select-none">
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <path d="M0 160 Q0 80 80 80 Q80 0 160 0" stroke="#8b5e3c" strokeWidth="2" fill="none" />
          <path d="M0 160 Q20 100 80 80 Q100 20 160 0" stroke="#c4956a" strokeWidth="1" fill="none" />
          <circle cx="20" cy="140" r="4" fill="#8b5e3c" />
          <circle cx="140" cy="20" r="4" fill="#8b5e3c" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-40 h-40 pointer-events-none opacity-15 select-none scale-x-[-1]">
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <path d="M0 160 Q0 80 80 80 Q80 0 160 0" stroke="#8b5e3c" strokeWidth="2" fill="none" />
          <path d="M0 160 Q20 100 80 80 Q100 20 160 0" stroke="#c4956a" strokeWidth="1" fill="none" />
          <circle cx="20" cy="140" r="4" fill="#8b5e3c" />
          <circle cx="140" cy="20" r="4" fill="#8b5e3c" />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 w-40 h-40 pointer-events-none opacity-10 select-none scale-y-[-1]">
        <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
          <path d="M0 160 Q0 80 80 80 Q80 0 160 0" stroke="#8b5e3c" strokeWidth="2" fill="none" />
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
            className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-white"
            style={{ border: "2px solid #e5d0b8" }}
          >
            <Image
              src="https://lacasonahotelboutique.com.co/wp-content/uploads/2023/07/logo-hotel-min.jpg"
              alt="La Casona Hotel Boutique"
              width={112}
              height={112}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#2c1a0e", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              La Casona Hotel Boutique
            </h1>
            <p className="text-sm mt-1 tracking-widest uppercase" style={{ color: "#8b5e3c" }}>
              Hotel Boutique · Laureles · Medellín
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "#6b4028" }}>
              Rodeado de naturaleza y cultura, en el corazón de Laureles
            </p>
          </div>
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
              style={{ background: "rgba(255,255,255,0.65)", border: "1px solid #e5d0b8" }}
            >
              <span className="font-bold text-lg leading-none" style={{ color: "#8b5e3c" }}>
                {stat.value}
              </span>
              <span className="text-[10px] mt-1 text-center leading-tight" style={{ color: "#c4956a" }}>
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
                      background: "linear-gradient(135deg, #8b5e3c 0%, #6b4028 100%)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.75)",
                      border: "1px solid #e5d0b8",
                      color: "#2c1a0e",
                      backdropFilter: "blur(8px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(255,255,255,0.2)" }
                    : { background: "linear-gradient(135deg, #8b5e3c22 0%, #8b5e3c11 100%)", color: "#8b5e3c" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(255,255,255,0.75)" : "#c4956a" }}
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
          <div className="flex-1 h-px" style={{ background: "#e5d0b8" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#c4956a" }}>
            Síguenos
          </span>
          <div className="flex-1 h-px" style={{ background: "#e5d0b8" }} />
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
                border: "1px solid #e5d0b8",
                color: "#8b5e3c",
                backdropFilter: "blur(8px)",
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
          style={{ color: "#8b5e3c" }}
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
            style={{ background: "rgba(255,255,255,0.5)", border: "1px solid #e5d0b8" }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#8b5e3c" }}>
              Impulsado por <strong>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#c4956a" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
