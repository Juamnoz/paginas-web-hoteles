import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase-server";
import { createSession } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, rooms } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("paradise_lake_users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Este email ya tiene una cuenta. Inicia sesión." },
        { status: 409 }
      );
    }

    const password_hash = await hash(password, 10);

    const { data: user, error: userErr } = await supabase
      .from("paradise_lake_users")
      .insert({ name, email: email.toLowerCase(), phone, password_hash })
      .select("id, name, email")
      .single();

    if (userErr || !user) {
      console.error("Register user error:", userErr);
      return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
    }

    const reservations = [];
    if (Array.isArray(rooms)) {
      for (const room of rooms) {
        if (room.quantity > 0) {
          const { data: res } = await supabase
            .from("paradise_lake_reservations")
            .insert({
              user_id: user.id,
              room_type: room.id,
              room_title: room.title,
              quantity: room.quantity,
              unit_price: room.priceValue,
              total_price: room.priceValue * room.quantity,
            })
            .select()
            .single();
          if (res) reservations.push(res);
        }
      }
    }

    // Generate verification code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await supabase
      .from("paradise_lake_users")
      .update({ verification_code: code, code_expires_at: expires })
      .eq("id", user.id);

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, code);
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    await createSession({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, reservations });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
