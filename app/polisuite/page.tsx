"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  {
    id: "motelnow",
    label: "Reservar en MotelNow",
    sublabel: "Disponibilidad en tiempo real",
    href: "https://reservas.motelnow.com.co/motels/30154-hotel-polisuite",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    primary: true,
  },
  {
    id: "booking",
    label: "Hoteles Beijing",
    sublabel: "Ver tarifas y opiniones",
    href: "https://hotelesbeijing.com.co/hotel/hotel-polisuite/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "facebook-page",
    label: "Facebook",
    sublabel: "Síguenos y contáctanos",
    href: "https://www.facebook.com/share/18VapJdtqe/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    primary: false,
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/hotelpolisuites?igsh=ZnN2ZTFrbjdhbng5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/18VapJdtqe/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "8.6", label: "Calificación" },
  { value: "372", label: "Reseñas" },
  { value: "24h", label: "Recepción" },
  { value: "Bello", label: "Antioquia" },
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

export default function PoliSuitePage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(160deg, #faf8f6 0%, #f5f0ec 50%, #ede8e3 100%)",
      }}
    >
      {/* Subtle decorations */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-72 h-72 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #e8ddd8 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #d8c8c0 0%, transparent 70%)" }}
        />
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
            className="w-28 h-28 rounded-full overflow-hidden shadow-lg"
            style={{ border: "2px solid #d8c8c0" }}
          >
            <Image
              src="/logo-polisuite.png"
              alt="Hotel Polisuite"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                color: "#2a1818",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Hotel Polisuite
            </h1>
            <p className="text-xs mt-1 tracking-widest uppercase" style={{ color: "#8b3040" }}>
              Confort · Limpieza · Bello
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "#6a4040" }}>
              Habitaciones cómodas con atención cordial en el sector Pérez de Bello
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
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid #d8c8c0",
              }}
            >
              <span className="font-bold text-lg leading-none" style={{ color: "#8b3040" }}>
                {stat.value}
              </span>
              <span className="text-[10px] mt-1 text-center leading-tight" style={{ color: "#9a7070" }}>
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
                      background: "linear-gradient(135deg, #8b3040 0%, #6b1828 100%)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(255,255,255,0.75)",
                      border: "1px solid #d8c8c0",
                      color: "#2a1818",
                      backdropFilter: "blur(10px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(0,0,0,0.15)" }
                    : { background: "rgba(139,48,64,0.1)", color: "#8b3040" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(255,255,255,0.75)" : "#9a7070" }}
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
          <div className="flex-1 h-px" style={{ background: "#d8c8c0" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#9a7070" }}>
            Síguenos
          </span>
          <div className="flex-1 h-px" style={{ background: "#d8c8c0" }} />
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
                background: "rgba(255,255,255,0.6)",
                border: "1px solid #d8c8c0",
                color: "#8b3040",
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
          style={{ color: "#9a7070" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Cra. 52 #51-2, Sector Pérez, Bello, Antioquia</span>
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
              background: "rgba(255,255,255,0.7)",
              border: "1px solid #d8c8c0",
            }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#a08050" }}>
              Impulsado por <strong style={{ color: "#8b3040" }}>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#c0b0a8" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
