import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { sendWelcomeEmail, type ReservationSummary } from "@/lib/email";

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

    // Send welcome email with reservation summary
    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("room_title, quantity, total_price")
      .eq("user_id", userId)
      .eq("status", "active");

    if (reservations && reservations.length > 0) {
      const totalOwed = reservations.reduce((acc: number, r: ReservationSummary) => acc + r.total_price, 0);
      try {
        await sendWelcomeEmail(user.email, user.name, reservations as ReservationSummary[], totalOwed);
      } catch (emailErr) {
        console.error("Welcome email error:", emailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
