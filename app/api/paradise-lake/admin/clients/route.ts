import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase-server";

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

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    console.log("[admin/clients] authed, querying supabase...");
    const [usersRes, reservationsRes, paymentsRes] = await Promise.all([
      supabase
        .from("paradise_lake_users")
        .select("id, name, email, phone, email_verified, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("paradise_lake_reservations")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase
        .from("paradise_lake_payments")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (usersRes.error) console.error("Admin users error:", usersRes.error);
    if (reservationsRes.error) console.error("Admin reservations error:", reservationsRes.error);
    if (paymentsRes.error) console.error("Admin payments error:", paymentsRes.error);

    return NextResponse.json({
      users: usersRes.data || [],
      reservations: reservationsRes.data || [],
      payments: paymentsRes.data || [],
    });
  } catch (err) {
    console.error("Admin clients EXCEPTION:", JSON.stringify(err), String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
