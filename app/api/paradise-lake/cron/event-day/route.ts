import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { sendEventDayEmail } from "@/lib/email";
import { isCronAuthorized } from "../_cronAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Send to all verified users with active reservations
  const { data: users } = await supabase
    .from("paradise_lake_users")
    .select("id, name, email, email_verified");

  if (!users) return NextResponse.json({ ok: true, sent: 0 });

  let sent = 0;
  for (const user of users) {
    if (!user.email_verified) continue;

    const { data: reservations } = await supabase
      .from("paradise_lake_reservations")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active");
    if (!reservations || reservations.length === 0) continue;

    try {
      await sendEventDayEmail(user.email, user.name);
      sent++;
    } catch (err) {
      console.error(`Event day email failed for ${user.email}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
