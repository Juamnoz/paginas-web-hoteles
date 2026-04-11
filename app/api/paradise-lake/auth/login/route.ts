import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { supabase } from "@/lib/supabase-server";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data: user } = await supabase
      .from("paradise_lake_users")
      .select("id, name, email, password_hash")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }

    const valid = await compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }

    await createSession({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
