import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { getSession } from "@/lib/session";
import { sendTicketsEmail, type TicketData } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();
    if (!code || !userId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

    const { data: user } = await supabase
      .from("paradise_lake_users")
      .select("id, name, email, verification_code, code_expires_at, email_verified")
      .eq("id", userId)
      .single();

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    if (user.email_verified) return NextResponse.json({ ok: true, alreadyVerified: true });
    if (user.verification_code !== code)
      return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
    if (new Date(user.code_expires_at) < new Date())
      return NextResponse.json({ error: "El código expiró. Solicita uno nuevo." }, { status: 400 });

    // Mark as verified
    await supabase
      .from("paradise_lake_users")
      .update({ email_verified: true, verification_code: null, code_expires_at: null })
      .eq("id", userId);

    // Generate and send tickets if they have reservations
    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (reservations && reservations.length > 0) {
      const tickets: TicketData[] = [];

      for (const res of reservations) {
        // transporte has no tickets; pareja = 2 persons per room; individual = 1
        const personsPerUnit = res.room_type === "pareja" ? 2 : res.room_type === "individual" ? 1 : 0;
        const ticketCount = personsPerUnit * res.quantity;

        for (let i = 1; i <= ticketCount; i++) {
          // Insert ticket record
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
