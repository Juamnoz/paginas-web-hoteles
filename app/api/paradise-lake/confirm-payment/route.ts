import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase-server";
import { sendTicketsEmail, type TicketData } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { paymentRecordId, mpPaymentId } = await req.json();
  if (!paymentRecordId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  let verifiedStatus: "approved" | "pending" = "pending";

  if (mpPaymentId && process.env.MP_ACCESS_TOKEN) {
    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      const mpData = await mpRes.json();
      if (mpData.status === "approved") verifiedStatus = "approved";
    } catch {
      // keep as pending if verification fails
    }
  }

  await supabase
    .from("paradise_lake_payments")
    .update({ status: verifiedStatus, mp_payment_id: mpPaymentId || null })
    .eq("id", paymentRecordId)
    .eq("user_id", session.id)
    .eq("status", "pending");

  // If approved, check if fully paid → send tickets
  if (verifiedStatus === "approved") {
    try {
      await maybeGenerateAndSendTickets(session.id);
    } catch (err) {
      console.error("Ticket generation error:", err);
    }
  }

  return NextResponse.json({ ok: true, status: verifiedStatus });
}

async function maybeGenerateAndSendTickets(userId: string) {
  const { data: user } = await supabase
    .from("paradise_lake_users")
    .select("id, name, email")
    .eq("id", userId)
    .single();
  if (!user) return;

  const { data: reservations } = await supabase
    .from("paradise_lake_reservations")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");
  if (!reservations || reservations.length === 0) return;

  const totalOwed = reservations.reduce((acc: number, r: { total_price: number }) => acc + r.total_price, 0);

  const { data: payments } = await supabase
    .from("paradise_lake_payments")
    .select("amount")
    .eq("user_id", userId)
    .eq("status", "approved");
  const totalPaid = payments?.reduce((acc: number, p: { amount: number }) => acc + p.amount, 0) ?? 0;

  // Only send tickets if fully paid
  if (totalPaid < totalOwed) return;

  // Check if tickets already exist
  const { data: existingTickets } = await supabase
    .from("paradise_lake_tickets")
    .select("id")
    .eq("user_id", userId);
  if (existingTickets && existingTickets.length > 0) return;

  const tickets: TicketData[] = [];

  for (const res of reservations) {
    // transporte has no tickets; pareja = 2; individual = 1
    const personsPerUnit = res.room_type === "pareja" ? 2 : res.room_type === "individual" ? 1 : 0;
    const ticketCount = personsPerUnit * res.quantity;

    for (let i = 1; i <= ticketCount; i++) {
      const { data: ticket } = await supabase
        .from("paradise_lake_tickets")
        .insert({
          user_id: userId,
          reservation_id: res.id,
          person_number: i,
          room_type: res.room_type,
        })
        .select("id")
        .single();

      if (ticket) {
        tickets.push({
          ticketId: ticket.id,
          personNumber: i,
          totalTickets: ticketCount,
          roomType: res.room_type,
          roomTitle: res.room_title,
          holderName: user.name,
        });
      }
    }
  }

  if (tickets.length > 0) {
    await sendTicketsEmail(user.email, user.name, tickets);
  }
}
