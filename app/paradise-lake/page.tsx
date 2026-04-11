"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TechnoBackground from "./TechnoBackground";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
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

const PROGRAM = [
  {
    day: "Viernes 1 May", tag: "Festivo",
    items: [
      { time: "12:00 PM", desc: "Apertura de puertas" },
      { time: "1:00 – 3:00 PM", desc: "🍹 Barra libre" },
      { time: "Desde las 2 PM", desc: "Techno & Techno House · 6 DJs los 2 días" },
    ],
  },
  {
    day: "Sábado 2 May", tag: "🎛️ Techno",
    items: [
      { time: "Todo el día", desc: "Techno & Techno House non-stop" },
      { time: "Non-stop", desc: "6 DJs · 24 horas de música · 2 días" },
    ],
  },
];

const ROOMS = [
  { id: "pareja", title: "Habitación en pareja", price: "$600.000", priceValue: 600000, unit: "por pareja", personas: 2, detail: "15 habitaciones disponibles · Se agotan rápido", primary: true, badge: "Incluye estadía", icon: "🏠" },
  { id: "individual", title: "Boleta individual", price: "$250.000", priceValue: 250000, unit: "por persona", personas: 1, detail: "Acceso al evento sin estadía", primary: false, badge: "Sin estadía", icon: "🎫" },
];

const ADDONS = [
  { id: "transporte", title: "Transporte ida y vuelta", price: "$40.000", priceValue: 40000, unit: "por persona", personas: 1, detail: "Salida desde Medellín y regreso incluidos", badge: "Opcional", icon: "🚌" },
];

type SessionUser = { id: string; name: string; email: string };
type Reservation = { id: string; room_type: string; room_title: string; quantity: number; unit_price: number; total_price: number; status: string };
type Payment = { id: string; amount: number; status: string; created_at: string };

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;
const DEPOSIT_UNIT = 50000;

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  );
}

function ParadiseLakePageInner() {
  // Session state
  const [user, setUser] = useState<SessionUser | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authForm, setAuthForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Room selection (guest)
  const [quantities, setQuantities] = useState<Record<string, number>>({ pareja: 0, individual: 0, transporte: 0 });
  const ALL_PRODUCTS = [...ROOMS, ...ADDONS];

  // Payment
  const [abonoInput, setAbonoInput] = useState("");
  const [loadingAbono, setLoadingAbono] = useState(false);
  const [pagoStatus, setPagoStatus] = useState<"exitoso" | "fallido" | "pendiente" | null>(null);

  const searchParams = useSearchParams();

  // Derived
  const totalSelected = ALL_PRODUCTS.reduce((acc, r) => acc + (quantities[r.id] ?? 0) * r.priceValue, 0);
  const hasSelection = ROOMS.reduce((acc, r) => acc + (quantities[r.id] ?? 0), 0) > 0;
  const abonoValue = parseInt(abonoInput.replace(/\D/g, ""), 10) || 0;
  const approvedPayments = payments.filter((p) => p.status === "approved");
  const totalPaid = approvedPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalOwed = reservations.reduce((acc, r) => acc + r.total_price, 0);
  const totalPersons = reservations.reduce((acc, r) => {
    const pp = r.room_type === "pareja" ? 2 : r.room_type === "individual" ? 1 : 0;
    return acc + pp * r.quantity;
  }, 0);
  const minAbono = totalPaid === 0 ? Math.max(50000, totalPersons * 50000) : 10000;
  const remaining = Math.max(0, totalOwed - totalPaid);

  // Load session on mount
  useEffect(() => {
    fetch("/api/paradise-lake/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setReservations(data.reservations || []);
          setPayments(data.payments || []);
        }
        setCheckingSession(false);
      })
      .catch(() => setCheckingSession(false));
  }, []);

  // Handle MP redirect
  useEffect(() => {
    const pago = searchParams.get("pago") as "exitoso" | "fallido" | "pendiente" | null;
    const externalRef = searchParams.get("external_reference");
    const mpPaymentId = searchParams.get("collection_id") || searchParams.get("payment_id");

    if (pago) {
      setPagoStatus(pago);
      if (pago === "exitoso" && externalRef) {
        fetch("/api/paradise-lake/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentRecordId: externalRef, mpPaymentId }),
        }).then(() => refreshUserData());
      }
      window.history.replaceState({}, "", "/paradise-lake");
    }
  }, [searchParams]);

  const refreshUserData = () => {
    fetch("/api/paradise-lake/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setReservations(data.reservations || []);
          setPayments(data.payments || []);
        }
      });
  };

  const adjustQty = (id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthError("");
    setAuthOpen(true);
  };

  const handleRegister = async () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthError("Completa nombre, email y contraseña");
      return;
    }
    setLoadingAuth(true);
    setAuthError("");
    try {
      const selectedRooms = ALL_PRODUCTS.filter((r) => (quantities[r.id] ?? 0) > 0).map((r) => ({
        id: r.id,
        title: r.title,
        priceValue: r.priceValue,
        quantity: quantities[r.id],
      }));
      const res = await fetch("/api/paradise-lake/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...authForm, rooms: selectedRooms }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || "Error al registrarse"); return; }
      setUser(data.user);
      setReservations(data.reservations || []);
      setPayments([]);
      setAuthOpen(false);
      setAuthForm({ name: "", email: "", phone: "", password: "" });
      // Open verification modal
      setPendingUserId(data.user.id);
      setVerifyOpen(true);
      setVerifyCode("");
      setVerifyError("");
    } catch { setAuthError("Error de conexión"); }
    finally { setLoadingAuth(false); }
  };

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) { setAuthError("Ingresa email y contraseña"); return; }
    setLoadingAuth(true);
    setAuthError("");
    try {
      const res = await fetch("/api/paradise-lake/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authForm.email, password: authForm.password }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || "Error al iniciar sesión"); return; }
      setUser(data.user);
      setAuthOpen(false);
      setAuthForm({ name: "", email: "", phone: "", password: "" });
      refreshUserData();
    } catch { setAuthError("Error de conexión"); }
    finally { setLoadingAuth(false); }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6 || !pendingUserId) return;
    setLoadingVerify(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/paradise-lake/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode, userId: pendingUserId }),
      });
      const data = await res.json();
      if (!res.ok) { setVerifyError(data.error || "Código incorrecto"); return; }
      setVerifyOpen(false);
      setPendingUserId(null);
      setVerifyCode("");
    } catch { setVerifyError("Error de conexión"); }
    finally { setLoadingVerify(false); }
  };

  const handleResendCode = async () => {
    if (!pendingUserId || resendCooldown > 0) return;
    await fetch("/api/paradise-lake/auth/resend-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: pendingUserId }),
    });
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((c) => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
    }, 1000);
  };

  const handleLogout = async () => {
    await fetch("/api/paradise-lake/auth/logout", { method: "POST" });
    setUser(null);
    setReservations([]);
    setPayments([]);
  };

  const handleAbonoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = parseInt(raw, 10);
    setAbonoInput(raw === "" ? "" : num.toLocaleString("es-CO"));
  };

  const handleAbono = async () => {
    if (abonoValue < minAbono) return;
    setLoadingAbono(true);
    try {
      const res = await fetch("/api/paradise-lake/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "abono-libre", title: "Paradise Lake Guatapé", quantity: 1, deposit: abonoValue }] }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { alert("No se pudo generar el link de pago. Intenta de nuevo."); }
    } catch { alert("Error de conexión. Intenta de nuevo."); }
    finally { setLoadingAbono(false); }
  };

  const handleWA = () => {
    window.open("https://wa.me/573016050818?text=Hola%2C+quiero+información+sobre+Paradise+Lake+Guatapé+%281+y+2+de+mayo%29+%E2%80%93+Techno+%26+Techno+House", "_blank");
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050f1e" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4" style={{ background: "#050f1e" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <TechnoBackground />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(2,5,9,0.45) 0%, rgba(2,5,9,0.3) 50%, rgba(2,5,9,0.6) 100%)" }} />
      </div>

      <motion.div className="w-full max-w-[430px] flex flex-col items-center gap-6 relative z-10" variants={containerVariants} initial="hidden" animate="visible">

        {/* ── Header ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 pt-2 text-center w-full">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1.5px solid rgba(247,148,29,0.2)", boxShadow: "0 0 40px rgba(247,148,29,0.15), 0 8px 32px rgba(0,0,0,0.5)" }}>
            <img src="/logo-paradise-lake.jpeg" alt="Paradise Lake" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "#F7941D" }}>1 y 2 de Mayo · Guatapé</p>
            <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: "#ffffff", fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 0 40px rgba(247,148,29,0.3)" }}>Paradise Lake</h1>
            <p className="text-base font-semibold mt-1 tracking-wide" style={{ color: "#2BAF9E" }}>Techno & Techno House · Peñol, Antioquia</p>
            <p className="text-sm mt-3 max-w-[300px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>6 DJs · 24 horas de música · Barra libre · Estadía incluida</p>
          </div>
          {/* User bar */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl w-full justify-between" style={{ background: "rgba(247,148,29,0.08)", border: "1px solid rgba(247,148,29,0.2)" }}>
              <span className="text-sm font-semibold" style={{ color: "#F7941D" }}>👤 {user.name}</span>
              <button onClick={handleLogout} className="text-xs px-3 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Salir
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Highlights ── */}
        <motion.div variants={itemVariants} className="w-full grid grid-cols-4 gap-2 px-1">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex flex-col items-center py-3 px-1 rounded-xl" style={{ background: "rgba(247,148,29,0.06)", border: "1px solid rgba(247,148,29,0.18)" }}>
              <span className="font-black text-base leading-none" style={{ color: "#F7941D" }}>{h.value}</span>
              <span className="text-[10px] mt-1 text-center leading-tight" style={{ color: "rgba(255,255,255,0.5)" }}>{h.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Programa ── */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <p className="text-xs tracking-widest uppercase mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)" }}>Programa</p>
          <div className="flex flex-col gap-3">
            {PROGRAM.map((day) => (
              <div key={day.day} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-sm" style={{ color: "#ffffff" }}>{day.day}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={day.tag.includes("Techno") ? { background: "rgba(247,148,29,0.15)", color: "#F7941D", border: "1px solid rgba(247,148,29,0.3)" } : { background: "rgba(43,175,158,0.15)", color: "#2BAF9E", border: "1px solid rgba(43,175,158,0.25)" }}>
                    {day.tag}
                  </span>
                </div>
                {day.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-1.5">
                    <span className="text-xs font-mono pt-0.5 shrink-0 w-28" style={{ color: "#2BAF9E" }}>{item.time}</span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Video ── */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <div className="w-full rounded-2xl overflow-hidden relative" style={{ border: "1px solid rgba(247,148,29,0.25)", boxShadow: "0 0 32px rgba(247,148,29,0.1), 0 8px 32px rgba(0,0,0,0.5)" }}>
            <video autoPlay muted loop playsInline className="w-full object-cover" style={{ maxHeight: "260px", display: "block" }}>
              <source src="/paradise-lake-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-5" style={{ background: "linear-gradient(to top, rgba(2,5,9,0.75) 0%, transparent 60%)" }}>
              <p className="font-black text-lg tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Paradise Lake</p>
              <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#F7941D" }}>1 y 2 de Mayo · Guatapé</p>
            </div>
          </div>
        </motion.div>

        {/* ── ESTADO DE PAGO ── */}
        {pagoStatus && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full px-1">
            <div className="w-full rounded-2xl px-5 py-4 text-center" style={
              pagoStatus === "exitoso" ? { background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.35)", color: "#25d366" }
              : pagoStatus === "pendiente" ? { background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.35)", color: "#ffc107" }
              : { background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.35)", color: "#ff5050" }
            }>
              <p className="font-bold text-sm">
                {pagoStatus === "exitoso" && "✅ ¡Pago recibido! Tu abono ha sido registrado."}
                {pagoStatus === "pendiente" && "⏳ Pago pendiente. Te avisaremos cuando se confirme."}
                {pagoStatus === "fallido" && "❌ El pago no se completó. Intenta de nuevo."}
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════
            SECCIÓN DINÁMICA: Guest vs. Logged in
        ══════════════════════════════════════════════ */}

        {!user ? (
          /* ── GUEST: Room selector + auth CTA ── */
          <>
            <motion.div variants={itemVariants} className="w-full px-1">
              {/* Main tickets */}
              <p className="text-xs tracking-widest uppercase mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)" }}>Elige tu experiencia</p>
              <div className="flex flex-col gap-3">
                {ROOMS.map((room) => {
                  const qty = quantities[room.id] ?? 0;
                  const selected = qty > 0;
                  return (
                    <div key={room.id} className="flex items-center gap-3 px-4 py-4 rounded-2xl transition-all"
                      style={selected
                        ? { background: "linear-gradient(135deg, rgba(247,148,29,0.18) 0%, rgba(43,175,158,0.10) 100%)", border: "1px solid rgba(247,148,29,0.45)" }
                        : room.primary
                        ? { background: "linear-gradient(135deg, rgba(247,148,29,0.08) 0%, rgba(43,175,158,0.04) 100%)", border: "1px solid rgba(247,148,29,0.2)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                      }
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: selected ? "rgba(247,148,29,0.2)" : room.primary ? "rgba(247,148,29,0.12)" : "rgba(255,255,255,0.06)" }}>
                        {room.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm" style={{ color: "#ffffff" }}>{room.title}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: room.primary ? "rgba(247,148,29,0.2)" : "rgba(255,107,53,0.15)", color: room.primary ? "#F7941D" : "#ff8c5a", border: `1px solid ${room.primary ? "rgba(247,148,29,0.3)" : "rgba(255,107,53,0.25)"}` }}>
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
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => adjustQty(room.id, -1)} disabled={qty === 0} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                          style={{ background: qty === 0 ? "rgba(255,255,255,0.04)" : "rgba(247,148,29,0.15)", color: qty === 0 ? "rgba(255,255,255,0.2)" : "#F7941D", border: `1px solid ${qty === 0 ? "rgba(255,255,255,0.08)" : "rgba(247,148,29,0.3)"}`, cursor: qty === 0 ? "not-allowed" : "pointer" }}>−</button>
                        <span className="w-6 text-center font-black text-base" style={{ color: qty > 0 ? "#F7941D" : "rgba(255,255,255,0.3)" }}>{qty}</span>
                        <button onClick={() => adjustQty(room.id, 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{ background: "rgba(247,148,29,0.15)", color: "#F7941D", border: "1px solid rgba(247,148,29,0.3)", cursor: "pointer" }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add-ons */}
              <div className="mt-4">
                <p className="text-xs tracking-widest uppercase mb-2 px-1" style={{ color: "rgba(255,255,255,0.25)" }}>Agregar al pedido</p>
                <div className="flex flex-col gap-2">
                  {ADDONS.map((addon) => {
                    const qty = quantities[addon.id] ?? 0;
                    const selected = qty > 0;
                    return (
                      <div key={addon.id} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                        style={selected
                          ? { background: "rgba(43,175,158,0.12)", border: "1px solid rgba(43,175,158,0.4)" }
                          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderStyle: "dashed" }
                        }
                      >
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xl"
                          style={{ background: selected ? "rgba(43,175,158,0.2)" : "rgba(255,255,255,0.05)" }}>
                          {addon.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm" style={{ color: selected ? "#ffffff" : "rgba(255,255,255,0.7)" }}>{addon.title}</p>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(43,175,158,0.15)", color: "#2BAF9E", border: "1px solid rgba(43,175,158,0.25)" }}>
                              {addon.badge}
                            </span>
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {addon.price} <span style={{ color: "rgba(255,255,255,0.2)" }}>{addon.unit}</span>
                            {selected && <span style={{ color: "#2BAF9E" }}> · +{fmt(qty * addon.priceValue)} al total</span>}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{addon.detail}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => adjustQty(addon.id, -1)} disabled={qty === 0} className="w-7 h-7 rounded-full flex items-center justify-center text-base font-bold transition-all"
                            style={{ background: qty === 0 ? "rgba(255,255,255,0.03)" : "rgba(43,175,158,0.15)", color: qty === 0 ? "rgba(255,255,255,0.2)" : "#2BAF9E", border: `1px solid ${qty === 0 ? "rgba(255,255,255,0.07)" : "rgba(43,175,158,0.3)"}`, cursor: qty === 0 ? "not-allowed" : "pointer" }}>−</button>
                          <span className="w-5 text-center font-black text-sm" style={{ color: qty > 0 ? "#2BAF9E" : "rgba(255,255,255,0.25)" }}>{qty}</span>
                          <button onClick={() => adjustQty(addon.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
                            style={{ background: "rgba(43,175,158,0.15)", color: "#2BAF9E", border: "1px solid rgba(43,175,158,0.3)", cursor: "pointer" }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selection summary */}
              {hasSelection && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl px-4 py-3" style={{ background: "rgba(247,148,29,0.06)", border: "1px solid rgba(247,148,29,0.15)" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Separa hoy</p>
                      <p className="font-black text-base" style={{ color: "#F7941D" }}>{fmt(ALL_PRODUCTS.reduce((acc, r) => acc + (quantities[r.id] ?? 0) * DEPOSIT_UNIT * r.personas, 0))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Total</p>
                      <p className="font-black text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(totalSelected)}</p>
                    </div>
                  </div>
                  {(quantities["transporte"] ?? 0) > 0 && (
                    <div className="mt-2 pt-2 flex flex-col gap-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {ROOMS.filter(r => (quantities[r.id] ?? 0) > 0).map(r => (
                        <p key={r.id} className="text-[11px] flex justify-between" style={{ color: "rgba(255,255,255,0.35)" }}>
                          <span>{r.title} ×{quantities[r.id]}</span>
                          <span>{fmt(quantities[r.id] * r.priceValue)}</span>
                        </p>
                      ))}
                      <p className="text-[11px] flex justify-between" style={{ color: "rgba(43,175,158,0.8)" }}>
                        <span>🚌 Transporte ×{quantities["transporte"]}</span>
                        <span>+{fmt(quantities["transporte"] * 40000)}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Auth CTA */}
            <motion.div variants={itemVariants} className="w-full px-1 flex flex-col gap-3">
              <motion.button onClick={() => handleOpenAuth("register")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: "linear-gradient(135deg, #009ee3 0%, #0077b6 100%)", color: "#ffffff", boxShadow: "0 0 24px rgba(0,158,227,0.3)" }}>
                {hasSelection ? "✅ Continuar con reserva" : "🎟️ Crear cuenta y reservar"}
              </motion.button>
              <button onClick={() => handleOpenAuth("login")} className="w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Ya tengo cuenta — Iniciar sesión
              </button>
            </motion.div>
          </>
        ) : (
          /* ── LOGGED IN: Personal Dashboard ── */
          <motion.div variants={itemVariants} className="w-full px-1 flex flex-col gap-4">

            {/* Reservation overview */}
            {reservations.length > 0 ? (
              <div className="w-full rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(247,148,29,0.2)" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Mi reserva</p>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2">
                  {reservations.map((r) => (
                    <div key={r.id} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{ROOMS.find(rm => rm.id === r.room_type)?.icon || "🎫"} {r.room_title} × {r.quantity}</span>
                      <span className="text-sm font-bold" style={{ color: "#ffffff" }}>{fmt(r.total_price)}</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-3 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Total reserva</span>
                    <span className="text-base font-black" style={{ color: "#ffffff" }}>{fmt(totalOwed)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pb-4">
                  <div className="w-full h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: totalOwed > 0 ? `${Math.min((totalPaid / totalOwed) * 100, 100)}%` : "0%" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      style={{ background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#22c55e" }}>✓ Pagado {fmt(totalPaid)}</span>
                    <span style={{ color: remaining > 0 ? "#F7941D" : "#22c55e" }}>{remaining > 0 ? `Falta ${fmt(remaining)}` : "¡Completado!"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-2xl px-5 py-5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Aún no tienes una reserva registrada.</p>
                <button onClick={handleLogout} className="text-xs mt-1 underline" style={{ color: "rgba(255,255,255,0.35)" }}>¿No eres tú? Cerrar sesión</button>
              </div>
            )}

            {/* Payment history */}
            {payments.length > 0 && (
              <div className="w-full rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Historial de abonos</p>
                </div>
                <div className="px-5 py-3 flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: p.status === "approved" ? "#22c55e" : p.status === "pending" ? "#ffc107" : "#ff5050" }}>
                          {p.status === "approved" ? "✓" : p.status === "pending" ? "⏳" : "✗"}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {new Date(p.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: p.status === "approved" ? "#22c55e" : "rgba(255,255,255,0.5)" }}>{fmt(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Make a payment */}
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(43,175,158,0.08) 0%, rgba(247,148,29,0.04) 100%)", border: "1px solid rgba(43,175,158,0.25)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(43,175,158,0.12)" }}>
                <p className="font-black text-base" style={{ color: "#ffffff" }}>💸 Hacer un abono</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Paga el monto que quieras, cuando quieras</p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Quick amount chips */}
                <div className="flex gap-2 flex-wrap">
                  {[50000, 100000, 200000].map((amt) => (
                    <button key={amt} onClick={() => setAbonoInput(amt.toLocaleString("es-CO"))}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={abonoValue === amt
                        ? { background: "rgba(43,175,158,0.3)", color: "#2BAF9E", border: "1px solid rgba(43,175,158,0.5)" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {fmt(amt)}
                    </button>
                  ))}
                  <button onClick={() => setAbonoInput(remaining > 0 ? remaining.toLocaleString("es-CO") : "")}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={abonoValue === remaining && remaining > 0
                      ? { background: "rgba(247,148,29,0.3)", color: "#F7941D", border: "1px solid rgba(247,148,29,0.5)" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Saldo total
                  </button>
                </div>

                {/* Custom amount input */}
                <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(43,175,158,0.2)" }}>
                  <span className="text-base font-black" style={{ color: "#2BAF9E" }}>$</span>
                  <input type="text" inputMode="numeric" placeholder="Otro monto" value={abonoInput} onChange={handleAbonoInput}
                    className="flex-1 bg-transparent outline-none text-base font-bold"
                    style={{ color: "#ffffff", caretColor: "#2BAF9E" }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>COP</span>
                </div>
                {abonoValue > 0 && abonoValue < minAbono && (
                  <p className="text-xs" style={{ color: "#ff6b6b" }}>
                    {totalPaid === 0 ? "Primer pago mínimo $50.000" : "Mínimo $10.000"}
                  </p>
                )}
                {abonoValue === 0 && totalPaid === 0 && (
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Primer abono mínimo $50.000</p>
                )}
                <motion.button onClick={handleAbono} disabled={loadingAbono || abonoValue < minAbono}
                  whileHover={{ scale: loadingAbono || abonoValue < minAbono ? 1 : 1.02 }}
                  whileTap={{ scale: loadingAbono || abonoValue < minAbono ? 1 : 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm"
                  style={{
                    background: loadingAbono || abonoValue < minAbono ? "rgba(43,175,158,0.08)" : "linear-gradient(135deg, #009ee3 0%, #0077b6 100%)",
                    color: loadingAbono || abonoValue < minAbono ? "rgba(255,255,255,0.3)" : "#ffffff",
                    cursor: loadingAbono || abonoValue < minAbono ? "not-allowed" : "pointer",
                    boxShadow: loadingAbono || abonoValue < minAbono ? "none" : "0 0 24px rgba(0,158,227,0.3)",
                  }}>
                  {loadingAbono ? <><Spinner /> Generando link…</> : abonoValue >= minAbono ? <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>
                    Pagar {fmt(abonoValue)}
                  </> : <>Ingresa el monto a abonar</>}
                </motion.button>
                <p className="text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Pago seguro vía Mercado Pago</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WhatsApp ── */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <motion.button onClick={handleWA} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base shadow-2xl"
            style={{ background: "linear-gradient(135deg, #25d366 0%, #1aad4f 100%)", color: "#ffffff", boxShadow: "0 0 30px rgba(37,211,102,0.3), 0 8px 32px rgba(0,0,0,0.4)" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar / Reservar por WhatsApp
          </motion.button>
          <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Cupos limitados · Reserva con anticipación</p>
        </motion.div>

        {/* ── Mapa ── */}
        <motion.div variants={itemVariants} className="w-full px-1">
          <p className="text-xs tracking-widest uppercase mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)" }}>Ubicación</p>
          <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(247,148,29,0.15)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <iframe src="https://maps.google.com/maps?q=Paradise+Lake+Pe%C3%B1ol+Antioquia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%" height="200" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Paradise Lake, Peñol, Antioquia" />
          </div>
          <a href="https://www.google.com/maps/dir//6QRX%2BG7,+Pe%C3%B1ol,+Antioquia" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm mt-2 hover:underline" style={{ color: "rgba(247,148,29,0.7)" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.978-5.121 3.978-8.827a8.25 8.25 0 00-16.5 0c0 3.706 2.034 6.744 3.978 8.827a19.576 19.576 0 002.854 2.715l.018.013.004.003zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Paradise Lake · Peñol, Antioquia
          </a>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 pb-6 mt-2">
          <a href="https://www.instagram.com/laagenciamarketing?igsh=cWZpMjI2OHdlbjl5" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Impulsado por <strong style={{ color: "#F7941D" }}>La Agencia</strong></span>
          </a>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Desarrollado por AIC Studio</p>
        </motion.div>
      </motion.div>

      {/* ══════════════════════════════════════════════
          AUTH MODAL — iOS 26 / Vercel style
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {authOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(20px) saturate(180%)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setAuthOpen(false); }}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-full max-w-[420px] rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.8)" }}>

              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
              </div>

              {/* Tab bar */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex gap-0 p-0.5 rounded-[10px]" style={{ background: "rgba(255,255,255,0.07)" }}>
                  {(["register", "login"] as const).map((mode) => (
                    <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(""); }}
                      className="px-4 py-1.5 rounded-[8px] text-[13px] font-semibold transition-all"
                      style={authMode === mode
                        ? { background: "rgba(255,255,255,0.12)", color: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }
                        : { color: "rgba(255,255,255,0.35)" }}>
                      {mode === "register" ? "Registrarse" : "Ya tengo cuenta"}
                    </button>
                  ))}
                </div>
                <button onClick={() => setAuthOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-xs"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>✕</button>
              </div>

              <div className="px-5 pb-6 flex flex-col gap-3">
                {/* Heading */}
                <div className="mb-1">
                  <p className="text-[20px] font-semibold tracking-tight" style={{ color: "#ffffff", letterSpacing: "-0.3px" }}>
                    {authMode === "register" ? "Crea tu cuenta" : "Bienvenido de vuelta"}
                  </p>
                  <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {authMode === "register" ? "Tu reserva y abonos quedan guardados aquí" : "Ingresa para ver tus reservas y abonos"}
                  </p>
                </div>

                {/* Fields */}
                {authMode === "register" && [
                  { key: "name", label: "Nombre completo", placeholder: "Tu nombre", type: "text" },
                  { key: "email", label: "Email", placeholder: "tu@email.com", type: "email" },
                  { key: "phone", label: "Teléfono (opcional)", placeholder: "+57 300 000 0000", type: "tel" },
                  { key: "password", label: "Contraseña", placeholder: "Mínimo 6 caracteres", type: "password" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-[11px] font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={authForm[key as keyof typeof authForm]}
                      onChange={(e) => setAuthForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-[12px] text-[15px] outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#ffffff" }} />
                  </div>
                ))}

                {authMode === "login" && [
                  { key: "email", label: "Email", placeholder: "tu@email.com", type: "email" },
                  { key: "password", label: "Contraseña", placeholder: "Tu contraseña", type: "password" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-[11px] font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={authForm[key as keyof typeof authForm]}
                      onChange={(e) => setAuthForm((f) => ({ ...f, [key]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full px-4 py-3 rounded-[12px] text-[15px] outline-none"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "#ffffff" }} />
                  </div>
                ))}

                {/* Room summary */}
                {authMode === "register" && hasSelection && (
                  <div className="rounded-[12px] px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[11px] font-medium mb-2" style={{ color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cupos seleccionados</p>
                    {ROOMS.filter((r) => (quantities[r.id] ?? 0) > 0).map((r) => (
                      <div key={r.id} className="flex justify-between items-center py-0.5">
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>{r.icon} {r.title} × {quantities[r.id]}</span>
                        <span className="text-[13px] font-medium" style={{ color: "#ffffff" }}>{fmt(r.priceValue * (quantities[r.id] ?? 0))}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error */}
                {authError && (
                  <p className="text-[13px] py-2.5 px-3.5 rounded-[10px]"
                    style={{ background: "rgba(255,59,48,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,59,48,0.2)" }}>
                    {authError}
                  </p>
                )}

                {/* Submit button */}
                <motion.button onClick={authMode === "register" ? handleRegister : handleLogin}
                  disabled={loadingAuth}
                  whileHover={{ scale: loadingAuth ? 1 : 1.01 }}
                  whileTap={{ scale: loadingAuth ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] text-[15px] font-semibold mt-1"
                  style={{
                    background: loadingAuth ? "rgba(255,255,255,0.07)" : "#ffffff",
                    color: loadingAuth ? "rgba(255,255,255,0.3)" : "#000000",
                    cursor: loadingAuth ? "not-allowed" : "pointer",
                    letterSpacing: "-0.2px",
                  }}>
                  {loadingAuth ? <><Spinner /> Procesando…</> : authMode === "register" ? "Crear cuenta" : "Iniciar sesión"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════
          VERIFICATION MODAL
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {verifyOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px) saturate(180%)" }}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="w-full max-w-[360px] rounded-[28px] overflow-hidden"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.8)" }}>

              <div className="px-7 pt-8 pb-2 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-[16px] flex items-center justify-center text-2xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ✉️
                </div>
                <p className="text-[20px] font-semibold tracking-tight mb-2" style={{ color: "#ffffff", letterSpacing: "-0.3px" }}>
                  Verifica tu email
                </p>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Enviamos un código de 6 dígitos a tu correo. Ingrésalo para activar tu cuenta y recibir tus boletas.
                </p>
              </div>

              <div className="px-7 pb-7 flex flex-col gap-3 mt-5">
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full text-center text-[32px] font-semibold tracking-[0.4em] py-4 rounded-[14px] outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    caretColor: "#ffffff",
                    letterSpacing: "0.35em",
                  }}
                />

                {verifyError && (
                  <p className="text-[13px] text-center py-2.5 px-3 rounded-[10px]"
                    style={{ background: "rgba(255,59,48,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,59,48,0.2)" }}>
                    {verifyError}
                  </p>
                )}

                <motion.button onClick={handleVerify} disabled={loadingVerify || verifyCode.length !== 6}
                  whileHover={{ scale: loadingVerify || verifyCode.length !== 6 ? 1 : 1.01 }}
                  whileTap={{ scale: loadingVerify || verifyCode.length !== 6 ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-[14px] rounded-[14px] text-[15px] font-semibold"
                  style={{
                    background: loadingVerify || verifyCode.length !== 6 ? "rgba(255,255,255,0.07)" : "#ffffff",
                    color: loadingVerify || verifyCode.length !== 6 ? "rgba(255,255,255,0.25)" : "#000000",
                    cursor: loadingVerify || verifyCode.length !== 6 ? "not-allowed" : "pointer",
                  }}>
                  {loadingVerify ? <><Spinner /> Verificando…</> : "Confirmar"}
                </motion.button>

                <div className="text-center">
                  <button onClick={handleResendCode} disabled={resendCooldown > 0}
                    className="text-[13px]"
                    style={{ color: resendCooldown > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)" }}>
                    {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "¿No llegó? Reenviar código"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
