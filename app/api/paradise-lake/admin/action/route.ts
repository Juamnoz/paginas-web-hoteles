import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase-server";
import { sendReminderEmail, sendTicketsEmail, type TicketData } from "@/lib/email";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "paradise-lake-fallback-secret-2025"
);

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("pl_admin")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { action, userId } = body;

  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });

  // Get user
  const { data: user } = await supabase
    .from("paradise_lake_users")
    .select("id, name, email, email_verified")
    .eq("id", userId)
    .single();

  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  // ── add_reservation ──────────────────────────────────────────────────────────
  if (action === "add_reservation") {
    const { room_type, room_title, quantity, unit_price } = body;
    const total_price = unit_price * quantity;
    const { data, error } = await supabase
      .from("paradise_lake_reservations")
      .insert({ user_id: userId, room_type, room_title, quantity, unit_price, total_price })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, reservation: data });
  }

  // ── add_payment ───────────────────────────────────────────────────────────────
  if (action === "add_payment") {
    const { amount, status = "approved" } = body;
    const { data, error } = await supabase
      .from("paradise_lake_payments")
      .insert({ user_id: userId, amount, status })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, payment: data });
  }

  // ── verify_email ──────────────────────────────────────────────────────────────
  if (action === "verify_email") {
    await supabase
      .from("paradise_lake_users")
      .update({ email_verified: true, verification_code: null, code_expires_at: null })
      .eq("id", userId);
    return NextResponse.json({ ok: true });
  }

  // ── send_reminder ─────────────────────────────────────────────────────────────
  if (action === "send_reminder") {
    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("total_price")
      .eq("user_id", userId)
      .eq("status", "active");

    const { data: payments } = await supabase
      .from("paradise_lake_payments")
      .select("amount")
      .eq("user_id", userId)
      .eq("status", "approved");

    const totalOwed = reservations?.reduce((a, r) => a + r.total_price, 0) ?? 0;
    const totalPaid = payments?.reduce((a, p) => a + p.amount, 0) ?? 0;

    await sendReminderEmail(user.email, user.name, totalOwed, totalPaid, "3d");
    return NextResponse.json({ ok: true, totalOwed, totalPaid, remaining: totalOwed - totalPaid });
  }

  // ── send_tickets ──────────────────────────────────────────────────────────────
  if (action === "send_tickets") {
    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (!reservations || reservations.length === 0) {
      return NextResponse.json({ error: "Sin reservas activas" }, { status: 400 });
    }

    const tickets: TicketData[] = [];
    const totalTickets = reservations.reduce((a, r) => a + r.quantity, 0);
    let personNumber = 1;
    for (const r of reservations) {
      for (let i = 0; i < r.quantity; i++) {
        tickets.push({
          ticketId: `${r.id}-${i + 1}`,
          personNumber: personNumber++,
          totalTickets,
          roomType: r.room_type,
          roomTitle: r.room_title,
          holderName: user.name,
        });
      }
    }

    await sendTicketsEmail(user.email, user.name, tickets);
    return NextResponse.json({ ok: true, ticketsSent: tickets.length });
  }

  return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
}
