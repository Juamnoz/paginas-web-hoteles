"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";

const SLIDER_IMAGES = [
  { src: "/hotels/gran-imperio/img-1.jpeg", alt: "Gran Imperio vista 1" },
  { src: "/hotels/gran-imperio/img-2.jpeg", alt: "Gran Imperio vista 2" },
  { src: "/hotels/gran-imperio/img-3.jpeg", alt: "Gran Imperio vista 3" },
  { src: "/hotels/gran-imperio/img-4.jpeg", alt: "Gran Imperio vista 4" },
];

const LINKS = [
  {
    id: "reservar",
    label: "Reservar Ahora",
    sublabel: "Habitaciones exclusivas disponibles",
    href: "https://wa.me/573128369410",
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
    sublabel: "312 836 9410",
    href: "https://wa.me/573128369410",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "instagram",
    label: "Instagram",
    sublabel: "@hotelgranimperio",
    href: "https://www.instagram.com/hotelgranimperio",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "ubicacion",
    label: "Ubicación",
    sublabel: "69 # 43-32",
    href: "https://www.google.com/maps/search/69+%23+43-32",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
    primary: false,
  },
  {
    id: "correo",
    label: "Correo",
    sublabel: "hotelgranimperio1@gmail.com",
    href: "mailto:hotelgranimperio1@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>
    ),
    primary: false,
  },
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

export default function GranImperioPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #111111 0%, #1a1a1a 50%, #0a0a0a 100%)",
        color: "#f5f5f5"
      }}
    >
      {/* Background Video (Optional if desired but we keep a dark ambient static style here or can add a video tag below) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none"
      >
        <source src="/hotels/gran-imperio/bg-video.mp4" type="video/mp4" />
      </video>

      <motion.div
        className="w-full max-w-[430px] flex flex-col items-center gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 pt-2">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg bg-[#222] overflow-hidden"
            style={{ border: "2px solid #d4af37" }}
          >
            <Image
              src="/hotels/gran-imperio/logo.png"
              alt="Gran Imperio Logo"
              width={112}
              height={112}
              className="w-full h-full object-contain"
              unoptimized={true}
            />
          </div>
          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#d4af37", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Gran Imperio
            </h1>
            <p className="text-sm mt-1 tracking-widest uppercase" style={{ color: "#a88e32" }}>
              Hotel Cerca a Todo
            </p>
            <p className="text-sm mt-2 max-w-[280px] leading-relaxed mx-auto text-gray-400">
              A solo 2 cuadras de la 70, te ofrecemos la mejor ubicación al mejor precio.
            </p>
          </div>
        </motion.div>

        {/* Image Slider */}
        <motion.div variants={itemVariants} className="w-full mt-4">
          <ImageSlider
            images={SLIDER_IMAGES}
            accentColor="#d4af37"
            borderColor="#333333"
          />
        </motion.div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3 px-2 mt-4">
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
                      background: "linear-gradient(135deg, #d4af37 0%, #b89322 100%)",
                      color: "#111",
                    }
                  : {
                      background: "rgba(30,30,30,0.85)",
                      border: "1px solid #d4af3744",
                      color: "#e5e5e5",
                      backdropFilter: "blur(12px)",
                    }
              }
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={
                  link.primary
                    ? { background: "rgba(0,0,0,0.15)" }
                    : { background: "linear-gradient(135deg, #d4af3722 0%, #d4af3711 100%)", color: "#d4af37" }
                }
              >
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                {link.sublabel && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: link.primary ? "rgba(0,0,0,0.7)" : "#a88e32" }}
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

        {/* Map */}
        <motion.div variants={itemVariants} className="w-full px-2 mt-4">
          <div
            className="w-full rounded-2xl overflow-hidden shadow-lg"
            style={{ border: "1px solid #444" }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Hotel+Gran+Imperio+Medellin&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Hotel Gran Imperio"
            />
          </div>
          <a
            href="https://www.google.com/maps/place/Hotel+Gran+Imperio/@6.2390272,-75.5761152,13z/data=!4m9!3m8!1s0x8e44298c76040667:0xa4179481d2f6c82f!5m2!4m1!1i2!8m2!3d6.2484959!4d-75.5873436!16s%2Fg%2F11r_vs0byb?authuser=0&entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm mt-3 hover:underline"
            style={{ color: "#d4af37" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>69 # 43-32, Medellín</span>
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-full px-2 flex items-center gap-3 mt-4">
          <div className="flex-1 h-px" style={{ background: "#444" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "#888" }}>
            Contáctanos
          </span>
          <div className="flex-1 h-px" style={{ background: "#444" }} />
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3 pb-6 mt-4"
        >
          <a
            href="https://www.instagram.com/laagenciamarketing?igsh=cWZpMjI2OHdlbjl5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: "rgba(30,30,30,0.6)", border: "1px solid #444" }}
          >
            <Image
              src="/logo-laagencia.png"
              alt="La Agencia"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-xs" style={{ color: "#d4af37" }}>
              Impulsado por <strong>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "#666" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
