import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase-server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const [{ data: reservations }, { data: payments }] = await Promise.all([
    supabase
      .from("paradise_lake_reservations")
      .select("*")
      .eq("user_id", session.id)
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    supabase
      .from("paradise_lake_payments")
      .select("*")
      .eq("user_id", session.id)
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    user: { id: session.id, name: session.name, email: session.email },
    reservations: reservations || [],
    payments: payments || [],
  });
}
