import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export async function POST(req: NextRequest) {
    console.log("\n=== 🕵️ AUDITORIA SANITY CHECK ===");

    // 1. CHECAGEM DE VARIÁVEIS DE AMBIENTE (BOM & Cold Start)
    const rawKey = process.env.GEMINI_API_KEY;
    console.log("-> 1. Chave carregada no momento do request?", !!rawKey);
    console.log("-> 2. Comprimento da chave:", rawKey?.length || 0);
    console.log("-> 3. Começa com 'AIza'?", rawKey?.startsWith('AIza') || false);

    // Teste de caracteres invisíveis (BOM)
    if (rawKey && !rawKey.startsWith('AIza')) {
        console.warn("⚠️ ALERTA DE BOM: A chave tem caracteres invisíveis no início!");
    }

    try {
        // Inicializar a IA DENTRO da rota garantindo que process.env esteja hidratado
        const ai = new GoogleGenAI({ apiKey: rawKey || "" });

        const body = await req.json().catch(() => ({}));
        const base64Image = body.image;

        if (!base64Image) {
            console.log("-> 4. Payload rejeitado: imagem nula.");
            return NextResponse.json({ success: false, error: "Imagem ausente." }, { status: 400 });
        }

        const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
        console.log(`-> 5. Payload Check: String limpa? ${!base64Data.startsWith('data:')}. Tamanho (chars): ${base64Data.length}`);

        console.log("-> 6. Disparando ping para Google GenAI api...");
        const startTime = performance.now();

        const response = await ai.models.generateContent({
            // ... MANTENHA O MESMO CÓDIGO AQUI ...
            model: "gemini-3.1-flash-image-preview",
            contents: [
                {
                    role: "user",
                    parts: [
                        { inlineData: { data: base64Data, mimeType: body.mimeType || "image/jpeg" } },
                        { text: "Restore this old photo, remove noise, scratches, and sepia tones, enhance facial details to high-fidelity." }
                    ]
                }
            ],
            config: {
                responseModalities: ["IMAGE"],
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY, threshold: HarmBlockThreshold.BLOCK_NONE }
                ]
            }
        });

        const duration = ((performance.now() - startTime) / 1000).toFixed(2);
        console.log(`-> 7. Sucesso do Google em ${duration}s`);

        // 🎯 EXTRAÇÃO DA IMAGEM
        const resultPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
        const restoredBase64 = resultPart?.inlineData?.data;

        if (!restoredBase64) throw new Error("A IA não retornou pixels. Tente outra foto.");

        return NextResponse.json({
            success: true,
            image: `data:${body.mimeType || "image/jpeg"};base64,${restoredBase64}`,
            mimeType: body.mimeType || "image/jpeg"
        });
    } catch (error: any) {
        console.error("[AUDITORIA 500]", error);
        return NextResponse.json(
            { success: false, error: error.message || "Erro Interno no Google" },
            { status: 500 }
        );
    }
}