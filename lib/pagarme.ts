/* ------------------------------------------------------------------ */
/*  lib/pagarme.ts                                                     */
/*  Pagar.me Core V5 — Pix Order Service                              */
/* ------------------------------------------------------------------ */

const PAGARME_API = "https://api.pagar.me/core/v5/orders";

/* ── Types ────────────────────────────────────────────────────────── */

export interface CustomerData {
    name: string;
    email: string;
    /** CPF — somente dígitos, 11 caracteres */
    document: string;
}

interface PagarmePixTransaction {
    qr_code: string;
    qr_code_url: string;
}

interface PagarmeCharge {
    id: string;
    last_transaction: PagarmePixTransaction;
}

export interface PagarmeOrderResponse {
    id: string;
    charges: PagarmeCharge[];
}

export interface PagarmeErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

export interface PixOrderResult {
    orderId: string;
    qrCode: string;
    qrCodeUrl: string;
}

/* ── Auth helper ──────────────────────────────────────────────────── */

function getAuthHeader(): string {
    const secret = process.env.PAGARME_SECRET_KEY;
    if (!secret) {
        throw new Error("PAGARME_SECRET_KEY is not configured");
    }
    // Pagar.me V5 Basic Auth: base64("sk_xxxxx:")
    const encoded = Buffer.from(`${secret}:`).toString("base64");
    return `Basic ${encoded}`;
}

/* ── Create Pix Order ─────────────────────────────────────────────── */

export async function createPixOrder(
    customer: CustomerData
): Promise<PixOrderResult> {
    const payload = {
        items: [
            {
                amount: 990, // R$ 9,90 em centavos
                description: "Restauração Alta Resolução",
                quantity: 1,
                code: "reviva-hd-restore",
            },
        ],
        customer: {
            name: customer.name,
            email: customer.email,
            document: customer.document,
            type: "individual",
            document_type: "CPF",
        },
        payments: [
            {
                payment_method: "pix",
                pix: {
                    expires_in: 900, // 15 minutos
                },
            },
        ],
    };

    const res = await fetch(PAGARME_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        const err = json as PagarmeErrorResponse;
        const detail =
            err.errors
                ? Object.values(err.errors).flat().join("; ")
                : err.message || "Erro desconhecido na Pagar.me.";
        throw new PagarmeError(detail, res.status);
    }

    const order = json as PagarmeOrderResponse;
    const lastTx = order.charges?.[0]?.last_transaction;

    if (!lastTx?.qr_code || !lastTx?.qr_code_url) {
        throw new PagarmeError(
            "A Pagar.me não retornou os dados do Pix. Tente novamente.",
            500
        );
    }

    return {
        orderId: order.id,
        qrCode: lastTx.qr_code,
        qrCodeUrl: lastTx.qr_code_url,
    };
}

/* ── Custom error class ───────────────────────────────────────────── */

export class PagarmeError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "PagarmeError";
        this.statusCode = statusCode;
    }
}
