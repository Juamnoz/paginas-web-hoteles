"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  email_verified: boolean;
  created_at: string;
};
type Reservation = {
  id: string;
  user_id: string;
  room_type: string;
  room_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
};
type Payment = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
};

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/paradise-lake/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Credenciales incorrectas");
        return;
      }
      onLogin();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0C0808" }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "#141414", border: "1px solid rgba(232,160,32,0.2)" }}>
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(232,160,32,0.6)" }}>
          Paradise Lake · Admin
        </p>
        <h1 className="text-xl font-bold mb-8" style={{ color: "#fff" }}>
          Panel de administración
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Usuario
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
            />
          </div>
          {error && (
            <p className="text-xs px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,59,48,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,59,48,0.2)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold mt-2"
            style={{
              background: loading ? "rgba(232,160,32,0.2)" : "linear-gradient(135deg,#E8A020,#C17000)",
              color: loading ? "rgba(255,255,255,0.4)" : "#000",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    approved: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", label: "Aprobado" },
    pending: { bg: "rgba(255,193,7,0.12)", color: "#ffc107", label: "Pendiente" },
    rejected: { bg: "rgba(255,80,80,0.12)", color: "#ff5050", label: "Rechazado" },
    active: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", label: "Activa" },
    cancelled: { bg: "rgba(255,80,80,0.12)", color: "#ff5050", label: "Cancelada" },
  };
  const s = styles[status] || { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", label: status };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function Dashboard() {
  const [data, setData] = useState<{ users: User[]; reservations: Reservation[]; payments: Payment[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/paradise-lake/admin/clients");
    if (res.ok) setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await fetch("/api/paradise-lake/admin/logout", { method: "POST" });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0808" }}>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Cargando clientes…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0808" }}>
        <p className="text-sm" style={{ color: "#ff6b6b" }}>Error al cargar datos.</p>
      </div>
    );
  }

  const { users, reservations, payments } = data;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search)
  );

  // Totals
  const totalRevenue = payments.filter((p) => p.status === "approved").reduce((acc, p) => acc + p.amount, 0);
  const totalOwed = reservations.reduce((acc, r) => acc + r.total_price, 0);

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0C0808" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(232,160,32,0.6)" }}>
              Paradise Lake · Admin
            </p>
            <h1 className="text-2xl font-bold" style={{ color: "#fff" }}>
              Clientes registrados
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="text-xs px-4 py-2 rounded-lg"
              style={{ background: "rgba(232,160,32,0.1)", color: "#E8A020", border: "1px solid rgba(232,160,32,0.2)" }}
            >
              Actualizar
            </button>
            <button
              onClick={handleLogout}
              className="text-xs px-4 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Salir
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Clientes", value: users.length.toString() },
            { label: "Reservas activas", value: reservations.filter((r) => r.status === "active").length.toString() },
            { label: "Total recaudado", value: fmt(totalRevenue) },
            { label: "Total por cobrar", value: fmt(Math.max(0, totalOwed - totalRevenue)) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-4 py-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                {s.label}
              </p>
              <p className="text-xl font-bold" style={{ color: "#E8A020" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff" }}
          />
        </div>

        {/* Client list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-sm text-center py-10" style={{ color: "rgba(255,255,255,0.3)" }}>
              No se encontraron clientes.
            </p>
          )}
          {filtered.map((user) => {
            const userReservations = reservations.filter((r) => r.user_id === user.id);
            const userPayments = payments.filter((p) => p.user_id === user.id);
            const approvedPayments = userPayments.filter((p) => p.status === "approved");
            const totalPaid = approvedPayments.reduce((acc, p) => acc + p.amount, 0);
            const totalOwedUser = userReservations.reduce((acc, r) => acc + r.total_price, 0);
            const remaining = Math.max(0, totalOwedUser - totalPaid);
            const isOpen = expanded === user.id;

            return (
              <div
                key={user.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : user.id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "rgba(232,160,32,0.15)", color: "#E8A020" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>
                        {user.name}
                      </p>
                      {user.email_verified ? (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                          Verificado
                        </span>
                      ) : (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,193,7,0.12)", color: "#ffc107" }}>
                          Sin verificar
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {user.email} · {user.phone || "—"}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-bold" style={{ color: totalPaid > 0 ? "#22c55e" : "rgba(255,255,255,0.5)" }}>
                      {fmt(totalPaid)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: remaining > 0 ? "#F7941D" : "rgba(255,255,255,0.3)" }}>
                      {remaining > 0 ? `Falta ${fmt(remaining)}` : totalOwedUser > 0 ? "Completado" : "Sin reserva"}
                    </p>
                  </div>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-4 h-4 flex-shrink-0 transition-transform"
                    style={{ color: "rgba(255,255,255,0.25)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Detail */}
                {isOpen && (
                  <div className="px-5 pb-5 flex flex-col gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Registrado el {new Date(user.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </p>

                    {/* Reservations */}
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Reservas
                      </p>
                      {userReservations.length === 0 ? (
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Sin reservas</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {userReservations.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between px-4 py-3 rounded-xl"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <div>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                                  {r.room_title} × {r.quantity}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                                  {fmt(r.unit_price)} c/u
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold" style={{ color: "#fff" }}>
                                  {fmt(r.total_price)}
                                </p>
                                <StatusBadge status={r.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Payment summary */}
                    {totalOwedUser > 0 && (
                      <div
                        className="px-4 py-3 rounded-xl"
                        style={{ background: "rgba(232,160,32,0.05)", border: "1px solid rgba(232,160,32,0.12)" }}
                      >
                        <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((totalPaid / totalOwedUser) * 100, 100)}%`,
                              background: "linear-gradient(90deg,#22c55e,#16a34a)",
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "#22c55e" }}>Pagado {fmt(totalPaid)}</span>
                          <span style={{ color: remaining > 0 ? "#F7941D" : "#22c55e" }}>
                            {remaining > 0 ? `Falta ${fmt(remaining)}` : "¡Completado!"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Payments history */}
                    {userPayments.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                          Historial de pagos
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {userPayments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-1.5 px-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                              <div className="flex items-center gap-3">
                                <StatusBadge status={p.status} />
                                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                  {new Date(p.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <span className="text-sm font-bold" style={{ color: p.status === "approved" ? "#22c55e" : "rgba(255,255,255,0.5)" }}>
                                {fmt(p.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/paradise-lake/admin/clients")
      .then((r) => {
        if (r.status === 401) setAuthed(false);
        else setAuthed(true);
      })
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0808" }}>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Verificando…</p>
      </div>
    );
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <Dashboard />;
}
