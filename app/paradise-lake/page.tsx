"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TechnoBackground from "./TechnoBackground";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const HIGHLIGHTS = [
  { value: "6", label: "DJs · 2 días" },
  { value: "24h", label: "Música non-stop" },
  { value: "Barra", label: "Libre 1–3 PM" },
  { value: "May 1–2", label: "Vie + Sáb" },
];

const ROOMS = [
  {
    id: "pareja",
    title: "Habitación en pareja",
    price: "$600.000",
    priceValue: 600000,
    unit: "por pareja",
    personas: 2,
    detail: "15 habitaciones disponibles · Se agotan rápido",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    primary: true,
    badge: "Incluye estadía",
  },
  {
    id: "individual",
    title: "Boleta individual",
    price: "$250.000",
    priceValue: 250000,
    unit: "por persona",
    personas: 1,
    detail: "Acceso al evento sin estadía",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    primary: false,
    badge: "Incluye estadía",
  },
  {
    id: "transporte",
    title: "Transporte ida y vuelta",
    price: "$40.000",
    priceValue: 40000,
    unit: "por persona",
    personas: 1,
    detail: "Salida y regreso incluidos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM20 17a2 2 0 11-4 0 2 2 0 014 0zM8 17H5a2 2 0 01-2-2V9a2 2 0 012-2h1l2-2h6l2 2h1a2 2 0 012 2v6a2 2 0 01-2 2h-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h14M9 9V7" />
      </svg>
    ),
    primary: false,
    badge: "Opcional",
  },
];

const PROGRAM = [
  {
    day: "Viernes 1 May",
    tag: "Festivo",
    items: [
      { time: "12:00 PM", desc: "Apertura de puertas" },
      { time: "1:00 – 3:00 PM", desc: "🍹 Barra libre" },
      { time: "Desde las 2 PM", desc: "Techno & Techno House · 6 DJs los 2 días" },
    ],
  },
  {
    day: "Sábado 2 May",
    tag: "🎛️ Techno",
    items: [
      { time: "Todo el día", desc: "Techno & Techno House non-stop" },
      { time: "Non-stop", desc: "6 DJs · 24 horas de música · 2 días" },
    ],
  },
];

function ParadiseLakePageInner() {
  const [copiedWA, setCopiedWA] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [pagoStatus, setPagoStatus] = useState<"exitoso" | "fallido" | "pendiente" | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({ pareja: 0, individual: 0, transporte: 0 });
  const [abonoInput, setAbonoInput] = useState("");
  const [loadingAbono, setLoadingAbono] = useState(false);
  const searchParams = useSearchParams();

  const DEPOSIT_UNIT = 50000;
  const totalDeposit = ROOMS.reduce((acc, r) => {
    const qty = quantities[r.id] ?? 0;
    return acc + qty * DEPOSIT_UNIT * r.personas;
  }, 0);
  const totalFull = ROOMS.reduce((acc, r) => acc + (quantities[r.id] ?? 0) * r.priceValue, 0);
  const hasSelection = totalDeposit > 0;

  const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

  const adjustQty = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  useEffect(() => {
    const pago = searchParams.get("pago");
    if (pago === "exitoso" || pago === "fallido" || pago === "pendiente") {
      setPagoStatus(pago);
      window.history.replaceState({}, "", "/paradise-lake");
    }
  }, [searchParams]);

  const abonoValue = parseInt(abonoInput.replace(/\D/g, ""), 10) || 0;

  const handleAbonoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = parseInt(raw, 10);
    setAbonoInput(raw === "" ? "" : num.toLocaleString("es-CO"));
  };

  const handleAbono = async () => {
    if (abonoValue < 10000) return;
    setLoadingAbono(true);
    try {
      const res = await fetch("/api/paradise-lake/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "abono-libre", title: "Abono – Paradise Lake Guatapé", quantity: 1, deposit: abonoValue }],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo generar el link de pago. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingAbono(false);
    }
  };

  const handleWA = () => {
    window.open(
      "https://wa.me/573016050818?text=Hola%2C+quiero+información+sobre+Paradise+Lake+Guatapé+%281+y+2+de+mayo%29+%E2%80%93+Techno+%26+Techno+House",
      "_blank"
    );
  };

  const handleSepararCupo = async () => {
    setLoadingPago(true);
    try {
      const items = ROOMS.filter((r) => (quantities[r.id] ?? 0) > 0).map((r) => ({
        id: r.id,
        title: r.title,
        quantity: quantities[r.id],
        deposit: DEPOSIT_UNIT * r.personas,
      }));
      const res = await fetch("/api/paradise-lake/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo generar el link de pago. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoadingPago(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{ background: "#050f1e" }}
    >
      {/* Fondo techno generativo */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <TechnoBackground />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(2,5,9,0.45) 0%, rgba(2,5,9,0.3) 50%, rgba(2,5,9,0.6) 100%)" }}
        />
      </div>

      <motion.div
        className="w-full max-w-[430px] flex flex-col items-center gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 pt-2 text-center">
          {/* Icon badge */}
          <div
            className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: "1.5px solid rgba(247,148,29,0.2)",
              boxShadow: "0 0 40px rgba(247,148,29,0.15), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src="/logo-paradise-lake.jpeg"
              alt="Paradise Lake Hotel"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-1"
              style={{ color: "#F7941D" }}
            >
              1 y 2 de Mayo · Guatapé
            </p>
            <h1
              className="text-3xl font-black tracking-tight leading-tight"
              style={{
                color: "#ffffff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                textShadow: "0 0 40px rgba(247,148,29,0.3)",
              }}
            >
              Paradise Lake
            </h1>
            <p
              className="text-base font-semibold mt-1 tracking-wide"
              style={{ color: "#2BAF9E" }}
            >
              Techno & Techno House · Peñol, Antioquia
            </p>
            <p
              className="text-sm mt-3 max-w-[300px] mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              6 DJs · 24 horas de música · Barra libre · Estadía incluida
            </p>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div variants={itemVariants} className="w-full grid grid-cols-4 gap-2 px-1">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.label}
              className="flex flex-col items-center py-3 px-1 rounded-xl"
              style={{
                background: "rgba(247,148,29,0.06)",
                border: "1px solid rgba(247,148,29,0.18)",
              }}
            >
              <span
                className="font-black text-base leading-none"
                style={{ color: "#F7941D" }}
              >
                {h.value}
              </span>
              <span
                className="text-[10px] mt-1 text-center leading-tight"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {h.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Programa */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <p
            className="text-xs tracking-widest uppercase mb-3 px-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Programa
          </p>
          <div className="flex flex-col gap-3">
            {PROGRAM.map((day) => (
              <div
                key={day.day}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#ffffff" }}
                  >
                    {day.day}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      day.tag.includes("Techno")
                        ? { background: "rgba(247,148,29,0.15)", color: "#F7941D", border: "1px solid rgba(247,148,29,0.3)" }
                        : { background: "rgba(43,175,158,0.15)", color: "#2BAF9E", border: "1px solid rgba(43,175,158,0.25)" }
                    }
                  >
                    {day.tag}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {day.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="text-xs font-mono pt-0.5 shrink-0 w-28"
                        style={{ color: "#2BAF9E" }}
                      >
                        {item.time}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Video card */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <div
            className="w-full rounded-2xl overflow-hidden relative"
            style={{
              border: "1px solid rgba(247,148,29,0.25)",
              boxShadow: "0 0 32px rgba(247,148,29,0.1), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover"
              style={{ maxHeight: "260px", display: "block" }}
            >
              <source src="/paradise-lake-bg.mp4" type="video/mp4" />
            </video>
            {/* Overlay con texto */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-5"
              style={{ background: "linear-gradient(to top, rgba(2,5,9,0.75) 0%, transparent 60%)" }}
            >
              <p className="font-black text-lg tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                Paradise Lake
              </p>
              <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#F7941D" }}>
                1 y 2 de Mayo · Guatapé
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tarifas */}
        <div className="w-full flex flex-col gap-3 px-1">
          <p
            className="text-xs tracking-widest uppercase px-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Tarifas — elige cuántos cupos
          </p>
          {ROOMS.map((room) => {
            const qty = quantities[room.id] ?? 0;
            const selected = qty > 0;
            return (
              <motion.div
                key={room.id}
                variants={itemVariants}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all"
                style={
                  selected
                    ? {
                        background: "linear-gradient(135deg, rgba(247,148,29,0.18) 0%, rgba(43,175,158,0.10) 100%)",
                        border: "1px solid rgba(247,148,29,0.45)",
                      }
                    : room.primary
                    ? {
                        background: "linear-gradient(135deg, rgba(247,148,29,0.08) 0%, rgba(43,175,158,0.04) 100%)",
                        border: "1px solid rgba(247,148,29,0.2)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {/* Icono */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: selected ? "rgba(247,148,29,0.2)" : room.primary ? "rgba(247,148,29,0.12)" : "rgba(255,255,255,0.06)",
                    color: selected || room.primary ? "#F7941D" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {room.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: "#ffffff" }}>
                      {room.title}
                    </p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        background: room.primary ? "rgba(247,148,29,0.2)" : "rgba(255,107,53,0.15)",
                        color: room.primary ? "#F7941D" : "#ff8c5a",
                        border: `1px solid ${room.primary ? "rgba(247,148,29,0.3)" : "rgba(255,107,53,0.25)"}`,
                      }}
                    >
                      {room.badge}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {room.price} <span style={{ color: "rgba(255,255,255,0.25)" }}>{room.unit}</span>
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#F7941D" }}>
                    Separa con {fmt(DEPOSIT_UNIT * room.personas)}
                  </p>
                </div>

                {/* Contador */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => adjustQty(room.id, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                    style={{
                      background: qty === 0 ? "rgba(255,255,255,0.04)" : "rgba(247,148,29,0.15)",
                      color: qty === 0 ? "rgba(255,255,255,0.2)" : "#F7941D",
                      border: `1px solid ${qty === 0 ? "rgba(255,255,255,0.08)" : "rgba(247,148,29,0.3)"}`,
                      cursor: qty === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="w-6 text-center font-black text-base"
                    style={{ color: qty > 0 ? "#F7941D" : "rgba(255,255,255,0.3)" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => adjustQty(room.id, 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                    style={{
                      background: "rgba(247,148,29,0.15)",
                      color: "#F7941D",
                      border: "1px solid rgba(247,148,29,0.3)",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Resumen selección */}
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-3 flex justify-between items-center"
              style={{ background: "rgba(247,148,29,0.06)", border: "1px solid rgba(247,148,29,0.15)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Total a pagar después</p>
                <p className="font-black text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{fmt(totalFull)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Depósito ahora</p>
                <p className="font-black text-base" style={{ color: "#F7941D" }}>{fmt(totalDeposit)}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Estado del pago */}
        {pagoStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-1"
          >
            <div
              className="w-full rounded-2xl px-5 py-4 text-center"
              style={
                pagoStatus === "exitoso"
                  ? { background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.35)", color: "#25d366" }
                  : pagoStatus === "pendiente"
                  ? { background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.35)", color: "#ffc107" }
                  : { background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.35)", color: "#ff5050" }
              }
            >
              <p className="font-bold text-sm">
                {pagoStatus === "exitoso" && "✅ ¡Cupo separado! Te escribiremos para confirmar."}
                {pagoStatus === "pendiente" && "⏳ Pago pendiente. Te avisaremos cuando se confirme."}
                {pagoStatus === "fallido" && "❌ El pago no se completó. Intenta de nuevo."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Separar cupo */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(247,148,29,0.08) 0%, rgba(43,175,158,0.04) 100%)",
              border: "1px solid rgba(247,148,29,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid rgba(247,148,29,0.12)" }}
            >
              <p className="font-black text-base" style={{ color: "#ffffff" }}>
                🎟️ Separa tu cupo
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Reserva hoy con solo $50.000
              </p>
            </div>

            {/* Pasos */}
            <div className="px-5 py-4 flex flex-col gap-3">
              {[
                { n: "1", text: "Paga $50.000 por persona para asegurar tu lugar." },
                { n: "2", text: "Completa el saldo antes del 28 de abril." },
                { n: "3", text: "Si no pagas a tiempo, el depósito no se devuelve." },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                    style={{ background: "rgba(247,148,29,0.2)", color: "#F7941D" }}
                  >
                    {step.n}
                  </span>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Barra de progreso de pago */}
            {hasSelection && (
              <div className="px-5 pb-4">
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Estado de pago
                </p>
                {/* Track */}
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalDeposit / totalFull) * 100, 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                      boxShadow: "0 0 10px rgba(34,197,94,0.5)",
                    }}
                  />
                </div>
                {/* Montos */}
                <div className="flex justify-between items-start mt-2">
                  <div>
                    <p className="text-xs font-black" style={{ color: "#22c55e" }}>{fmt(totalDeposit)}</p>
                    <p className="text-[9px]" style={{ color: "rgba(34,197,94,0.7)" }}>✓ Pagas hoy</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.4)" }}>{fmt(totalFull - totalDeposit)}</p>
                    <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>Falta · antes del 28 abr</p>
                  </div>
                </div>
                {/* Total */}
                <div className="mt-2 pt-2 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Total</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(totalFull)}</span>
                </div>
              </div>
            )}

            {/* Botón pago */}
            <div className="px-5 pb-5">
              <motion.button
                onClick={handleSepararCupo}
                disabled={loadingPago || !hasSelection}
                whileHover={{ scale: loadingPago || !hasSelection ? 1 : 1.02 }}
                whileTap={{ scale: loadingPago || !hasSelection ? 1 : 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm"
                style={{
                  background: loadingPago || !hasSelection
                    ? "rgba(247,148,29,0.08)"
                    : "linear-gradient(135deg, #009ee3 0%, #0077b6 100%)",
                  color: loadingPago || !hasSelection ? "rgba(255,255,255,0.3)" : "#ffffff",
                  cursor: loadingPago || !hasSelection ? "not-allowed" : "pointer",
                  boxShadow: loadingPago || !hasSelection ? "none" : "0 0 24px rgba(0,158,227,0.3)",
                }}
              >
                {loadingPago ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                      <path d="M12 2a10 10 0 0110 10" />
                    </svg>
                    Generando link…
                  </>
                ) : !hasSelection ? (
                  <>Elige cuántos cupos arriba</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Separar cupo — {fmt(totalDeposit)}
                  </>
                )}
              </motion.button>
              <p className="text-center text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                Pago seguro vía Mercado Pago · Saldo restante antes del 28 abr
              </p>
            </div>
          </div>
        </motion.div>

        {/* Abono libre */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(43,175,158,0.08) 0%, rgba(247,148,29,0.04) 100%)",
              border: "1px solid rgba(43,175,158,0.25)",
            }}
          >
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid rgba(43,175,158,0.12)" }}
            >
              <p className="font-black text-base" style={{ color: "#ffffff" }}>
                💸 Abonar a mi cupo
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Paga cualquier monto que quieras en cualquier momento
              </p>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(43,175,158,0.2)" }}
              >
                <span className="text-base font-black" style={{ color: "#2BAF9E" }}>$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={abonoInput}
                  onChange={handleAbonoInput}
                  className="flex-1 bg-transparent outline-none text-base font-bold"
                  style={{ color: "#ffffff", caretColor: "#2BAF9E" }}
                />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>COP</span>
              </div>
              {abonoValue > 0 && abonoValue < 10000 && (
                <p className="text-xs" style={{ color: "#ff6b6b" }}>Mínimo $10.000</p>
              )}
              <motion.button
                onClick={handleAbono}
                disabled={loadingAbono || abonoValue < 10000}
                whileHover={{ scale: loadingAbono || abonoValue < 10000 ? 1 : 1.02 }}
                whileTap={{ scale: loadingAbono || abonoValue < 10000 ? 1 : 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm"
                style={{
                  background: loadingAbono || abonoValue < 10000
                    ? "rgba(43,175,158,0.08)"
                    : "linear-gradient(135deg, #009ee3 0%, #0077b6 100%)",
                  color: loadingAbono || abonoValue < 10000 ? "rgba(255,255,255,0.3)" : "#ffffff",
                  cursor: loadingAbono || abonoValue < 10000 ? "not-allowed" : "pointer",
                  boxShadow: loadingAbono || abonoValue < 10000 ? "none" : "0 0 24px rgba(0,158,227,0.3)",
                }}
              >
                {loadingAbono ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                      <path d="M12 2a10 10 0 0110 10" />
                    </svg>
                    Generando link…
                  </>
                ) : abonoValue >= 10000 ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    Abonar {fmt(abonoValue)}
                  </>
                ) : (
                  <>Ingresa el monto a abonar</>
                )}
              </motion.button>
              <p className="text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Pago seguro vía Mercado Pago
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA WhatsApp */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <motion.button
            onClick={handleWA}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #25d366 0%, #1aad4f 100%)",
              color: "#ffffff",
              boxShadow: "0 0 30px rgba(37,211,102,0.3), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Reservar por WhatsApp
          </motion.button>
          <p
            className="text-center text-xs mt-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Cupos limitados · Reserva con anticipación
          </p>
        </motion.div>

        {/* Mapa */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <p
            className="text-xs tracking-widest uppercase mb-3 px-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Ubicación
          </p>
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(247,148,29,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Paradise+Lake+Pe%C3%B1ol+Antioquia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Paradise Lake, Peñol, Antioquia"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir//6QRX%2BG7,+Pe%C3%B1ol,+Antioquia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm mt-2 hover:underline"
            style={{ color: "rgba(247,148,29,0.7)" }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Paradise Lake · Peñol, Antioquia
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3 pb-6 mt-2"
        >
          <a
            href="https://www.instagram.com/laagenciamarketing?igsh=cWZpMjI2OHdlbjl5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Impulsado por{" "}
              <strong style={{ color: "#F7941D" }}>La Agencia</strong>
            </span>
          </a>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Desarrollado por AIC Studio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ParadiseLakePage() {
  return (
    <Suspense>
      <ParadiseLakePageInner />
    </Suspense>
  );
}
