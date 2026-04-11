import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { sendReminderEmail } from "@/lib/email";
import { isCronAuthorized } from "../_cronAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: users } = await supabase
    .from("paradise_lake_users")
    .select("id, name, email, email_verified");

  if (!users) return NextResponse.json({ ok: true, sent: 0 });

  let sent = 0;
  for (const user of users) {
    if (!user.email_verified) continue;

    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("total_price")
      .eq("user_id", user.id)
      .eq("status", "active");
    if (!reservations || reservations.length === 0) continue;

    const totalOwed = reservations.reduce((acc: number, r: { total_price: number }) => acc + r.total_price, 0);

    const { data: payments } = await supabase
      .from("paradise_lake_payments")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "approved");
    const totalPaid = payments?.reduce((acc: number, p: { amount: number }) => acc + p.amount, 0) ?? 0;

    if (totalPaid >= totalOwed) continue; // already paid

    try {
      await sendReminderEmail(user.email, user.name, totalOwed, totalPaid, "8d");
      sent++;
    } catch (err) {
      console.error(`Reminder 8d failed for ${user.email}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
