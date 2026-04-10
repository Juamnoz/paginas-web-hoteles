import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

type SelectedItem = { id: string; title: string; quantity: number; deposit: number };

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3004";
    const body = await req.json().catch(() => ({ items: [] }));
    const selectedItems: SelectedItem[] = body.items ?? [];

    const items =
      selectedItems.length > 0
        ? selectedItems.map((item) => ({
            id: `paradise-lake-${item.id}`,
            title: `Depósito – ${item.title}`,
            description: "Saldo restante debe pagarse antes del 28 de abril.",
            quantity: item.quantity,
            unit_price: item.deposit,
            currency_id: "COP",
          }))
        : [
            {
              id: "paradise-lake-deposito",
              title: "Separar cupo – Paradise Lake Guatapé",
              description: "Depósito para reservar cupo. Saldo restante debe pagarse antes del 28 de abril.",
              quantity: 1,
              unit_price: 50000,
              currency_id: "COP",
            },
          ];

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${origin}/paradise-lake?pago=exitoso`,
          failure: `${origin}/paradise-lake?pago=fallido`,
          pending: `${origin}/paradise-lake?pago=pendiente`,
        },
        statement_descriptor: "PARADISE LAKE",
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (err) {
    console.error("MP preference error:", err);
    return NextResponse.json(
      { error: "No se pudo crear el link de pago." },
      { status: 500 }
    );
  }
}
