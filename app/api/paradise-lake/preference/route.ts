import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase-server";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type SelectedItem = { id: string; title: string; quantity: number; deposit: number };

export async function POST(req: NextRequest) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get("origin") || "http://localhost:3004";
    const body = await req.json().catch(() => ({ items: [] }));
    const selectedItems: SelectedItem[] = body.items ?? [];
    const session = await getSession();

    const items =
      selectedItems.length > 0
        ? selectedItems.map((item) => ({
            id: `paradise-lake-${item.id}`,
            title: `Abono – ${item.title}`,
            description: "Paradise Lake Guatapé · 1 y 2 de Mayo",
            quantity: item.quantity,
            unit_price: item.deposit,
            currency_id: "COP",
          }))
        : [
            {
              id: "paradise-lake-deposito",
              title: "Abono – Paradise Lake Guatapé",
              description: "Paradise Lake · 1 y 2 de Mayo",
              quantity: 1,
              unit_price: 50000,
              currency_id: "COP",
            },
          ];

    // Create pending payment record for logged-in users
    let paymentRecordId: string | null = null;
    if (session) {
      const totalAmount =
        selectedItems.reduce((acc, i) => acc + i.deposit * (i.quantity || 1), 0) || 50000;

      // Enforce minimum: $50.000 first payment, $10.000 subsequent
      const { data: existingPayments } = await supabase
        .from("paradise_lake_payments")
        .select("id")
        .eq("user_id", session.id)
        .eq("status", "approved");
      const isFirstPayment = !existingPayments || existingPayments.length === 0;
      const minAmount = isFirstPayment ? 50000 : 10000;
      if (totalAmount < minAmount) {
        return NextResponse.json(
          { error: `El monto mínimo es ${isFirstPayment ? "$50.000 para el primer pago" : "$10.000"}.` },
          { status: 400 }
        );
      }
      const { data: paymentRecord } = await supabase
        .from("paradise_lake_payments")
        .insert({ user_id: session.id, amount: totalAmount, status: "pending" })
        .select("id")
        .single();
      paymentRecordId = paymentRecord?.id ?? null;
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items,
        external_reference: paymentRecordId || undefined,
        back_urls: {
          success: `${origin}/paradise-lake?pago=exitoso`,
          failure: `${origin}/paradise-lake?pago=fallido`,
          pending: `${origin}/paradise-lake?pago=pendiente`,
        },
        auto_return: "approved",
        statement_descriptor: "PARADISE LAKE",
        payment_methods: { installments: 1 },
      },
    });

    if (paymentRecordId && result.id) {
      await supabase
        .from("paradise_lake_payments")
        .update({ mp_preference_id: result.id })
        .eq("id", paymentRecordId);
    }

    const url = result.init_point ?? result.sandbox_init_point;
    return NextResponse.json({ url, paymentRecordId });
  } catch (err: unknown) {
    console.error("MP preference error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "No se pudo crear el link de pago." }, { status: 500 });
  }
}
