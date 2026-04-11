import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

    const { data: user } = await supabase
      .from("paradise_lake_users")
      .select("id, name, email, email_verified")
      .eq("id", userId)
      .single();

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    if (user.email_verified) return NextResponse.json({ ok: true });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await supabase
      .from("paradise_lake_users")
      .update({ verification_code: code, code_expires_at: expires })
      .eq("id", userId);

    await sendVerificationEmail(user.email, user.name, code);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend code error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
