"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";

const SLIDER_IMAGES = [
  { src: "/hotels/pomarosa/entrada-hotel.jpeg", alt: "Entrada del Hotel Poma Rosa" },
  { src: "/hotels/pomarosa/habitacion-doble.jpeg", alt: "Habitación doble" },
  { src: "/hotels/pomarosa/recepcion.jpeg", alt: "Recepción del hotel" },
  { src: "/hotels/pomarosa/lobby.jpeg", alt: "Lobby y entrada interior" },
  { src: "/hotels/pomarosa/cocina.jpeg", alt: "Cocina compartida" },
];

const LINKS = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Web oficial · Mejor precio",
    href: "https://pomarosa.medellin-hotels.com/es/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    primary: true,
  },
  {
    id: "booking",
    label: "Booking.com",
    sublabel: "Ver disponibilidad",
    href: "https://www.booking.com/Share-Ih7qOzw",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
        <path d="M26.539 21.539a3.46 3.46 0 01-3.461 3.461H8.922a3.46 3.46 0 01-3.461-3.461V8.922a3.46 3.46 0 013.461-3.461h14.156a3.46 3.46 0 013.461 3.461v12.617zm-8.386-3.312c.469-.594.75-1.344.75-2.156 0-1.922-1.563-3.484-3.484-3.484h-3.297v10.281h1.813v-3.703h1.156l2.016 3.703h2.063l-2.234-3.906c.453-.188.859-.453 1.219-.734zm-4.219-1.078v-2.953h1.484c.813 0 1.484.672 1.484 1.484s-.672 1.469-1.484 1.469h-1.484z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "tripadvisor",
    label: "TripAdvisor",
    sublabel: "Leer opiniones de huéspedes",
    href: "https://www.tripadvisor.co/Hotel_Review-g297478-d13341527-Reviews-Hotel_Poma_Rosa-Medellin_Antioquia_Department.html",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "agoda",
    label: "Agoda",
    sublabel: "Reserva con descuento",
    href: "https://www.agoda.com/es-es/hotel-pomarosa/hotel/medellin-co.html",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5h-9v-1.5l2-2V10l-2-2V6.5h9V8l-2 2v3l2 2v1.5z" />
      </svg>
    ),
    primary: false,
  },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/pomarosahotel?igsh=MXB2MjVuODM2dXFiOA==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1E4st59729/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "4★", label: "Estrellas" },
  { value: "7.9", label: "Calificación" },
  { value: "943+", label: "Reseñas" },
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

export default function PomaRosaPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{
        background: "linear-gradient(160deg, #080806 0%, #0f0d08 50%, #141208 100%)",
      }}
    >
      {/* Gold glow decorations */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #c9a53a 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #c9a53a 0%, transparent 70%)" }}
        />
        {/* Gold tree silhouette hint top-right */}
        <svg className="absolute top-4 right-4 opacity-10 w-28 h-28" viewBox="0 0 100 120" fill="none">
          <rect x="46" y="80" width="8" height="35" fill="#c9a53a" />
          <ellipse cx="50" cy="55" rx="30" ry="40" fill="#c9a53a" />
          <ellipse cx="30" cy="65" rx="18" ry="25" fill="#c9a53a" />
          <ellipse cx="70" cy="65" rx="18" ry="25" fill="#c9a53a" />
        </svg>
        <svg className="absolute bottom-4 left-4 opacity-8 w-24 h-24 rotate-12" viewBox="0 0 100 120" fill="none">
          <rect x="46" y="80" width="8" height="35" fill="#c9a53a" />
          <ellipse cx="50" cy="55" rx="28" ry="38" fill="#c9a53a" />
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
            className="w-28 h-28 rounded-full overflow-hidden shadow-2xl"
            style={{ border: "2px solid rgba(201,165,58,0.4)" }}
          >
            <Image
              src="/logo-pomarosa-oficial.png"
              alt="Hotel Poma Rosa"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#f5e6c0", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Hotel Poma Rosa
            </h1>
            <p className="text-sm mt-1 tracking-widest uppercase" style={{ color: "#c9a53a" }}>
              Hotel · Restaurante · Medellín
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "#a08848" }}>
              Tu refugio boutique en el corazón de Laureles‑Estadio
            </p>
          </div>
        </motion.div>

        {/* Image Slider */}
        <motion.div variants={itemVariants} className="w-full">
          <ImageSlider
            images={SLIDER_IMAGES}
            accentColor="#c9a53a"
            dotColor="#c9a53a"
            borderColor="rgba(201,165,58,0.3)"
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
              style={{ background: "rgba(201,165,58,0.08)", border: "1px solid rgba(201,165,58,0.25)" }}
            >
              <span className="font-bold text-lg leading-none" style={{ color: "#c9a53a" }}>
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
              className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              style={
                link.primary
                  ? {
                      background: "linear-gradient(135deg, #c9a53a 0%, #9a7520 100%)",
                      color: "#fff",
                    }
                  : {
                      background: "rgba(201,165,58,0.07)",
                      border: "1px solid rgba(201,165,58,0.25)",
                      color: "#f5e6c0",
                      backdropFilter: "blur(8px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(255,255,255,0.2)" }
                    : { background: "linear-gradient(135deg, #c9a53a22 0%, #c9a53a11 100%)", color: "#c9a53a" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(201,165,58,0.07)" : "#c9a53a" }}
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
          <div className="flex-1 h-px" style={{ background: "rgba(201,165,58,0.25)" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#a08848" }}>
            Síguenos
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,165,58,0.25)" }} />
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
                background: "rgba(201,165,58,0.07)",
                border: "1px solid rgba(201,165,58,0.25)",
                color: "#c9a53a",
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
            style={{ border: "1px solid rgba(201,165,58,0.3)" }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Hotel+Poma+Rosa+Laureles+Medellín&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Hotel Poma Rosa"
            />
          </div>
          <a
            href="https://www.google.com/maps/search/Hotel+Poma+Rosa+Laureles+Medellín"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm mt-2 hover:underline"
            style={{ color: "#9a7520" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Laureles‑Estadio, Medellín, Antioquia</span>
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
            style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(201,165,58,0.25)" }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#9a7520" }}>
              Impulsado por <strong>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#a08848" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
