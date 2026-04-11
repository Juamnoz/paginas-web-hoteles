import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { paymentRecordId, mpPaymentId } = await req.json();
  if (!paymentRecordId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  let verifiedStatus: "approved" | "pending" = "pending";

  if (mpPaymentId && process.env.MP_ACCESS_TOKEN) {
    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      const mpData = await mpRes.json();
      if (mpData.status === "approved") verifiedStatus = "approved";
    } catch {
      // keep as pending if verification fails
    }
  }

  await supabase
    .from("paradise_lake_payments")
    .update({ status: verifiedStatus, mp_payment_id: mpPaymentId || null })
    .eq("id", paymentRecordId)
    .eq("user_id", session.id)
    .eq("status", "pending");

  return NextResponse.json({ ok: true, status: verifiedStatus });
}
