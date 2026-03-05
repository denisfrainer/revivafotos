import { NextRequest, NextResponse } from "next/server";
import {
    createPixOrder,
    PagarmeError,
    type CustomerData,
} from "@/lib/pagarme";

/* ------------------------------------------------------------------ */
/*  POST /api/checkout                                                 */
/*  Receives customer data → creates Pagar.me Pix order → returns     */
/*  QR code data to the frontend.                                      */
/* ------------------------------------------------------------------ */
export async function POST(request: NextRequest) {
    try {
        /* --- 1. Parse & validate payload ----------------------------- */
        let body: Partial<CustomerData>;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Payload JSON inválido." },
                { status: 400 }
            );
        }

        const { name, email, document } = body;

        if (!name || typeof name !== "string" || name.trim().length < 3) {
            return NextResponse.json(
                { error: "Nome inválido. Envie pelo menos 3 caracteres." },
                { status: 400 }
            );
        }

        if (
            !email ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return NextResponse.json(
                { error: "Email inválido." },
                { status: 400 }
            );
        }

        // CPF: somente dígitos, 11 caracteres
        const cleanDoc = (document ?? "").replace(/\D/g, "");
        if (cleanDoc.length !== 11) {
            return NextResponse.json(
                { error: "CPF inválido. Envie exatamente 11 dígitos." },
                { status: 400 }
            );
        }

        /* --- 2. Create Pix order via Pagar.me ------------------------ */
        const result = await createPixOrder({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            document: cleanDoc,
        });

        /* --- 3. Return only the essentials --------------------------- */
        return NextResponse.json(
            {
                orderId: result.orderId,
                qrCode: result.qrCode,
                qrCodeUrl: result.qrCodeUrl,
            },
            { status: 200 }
        );
    } catch (err: unknown) {
        console.error("[checkout/route] Error:", err);

        if (err instanceof PagarmeError) {
            // Forward Pagar.me validation errors (e.g. invalid CPF) as 400
            const status = err.statusCode >= 400 && err.statusCode < 500 ? 400 : 500;
            return NextResponse.json({ error: err.message }, { status });
        }

        const message =
            err instanceof Error ? err.message : "Erro inesperado no checkout.";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
