import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "paradise-lake-fallback-secret-2025"
);

const ADMIN_USER = "abundalaabundancia";
const ADMIN_PASS = "abundancia123_";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    const token = await new SignJWT({ admin: true, username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(SECRET);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("pl_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
