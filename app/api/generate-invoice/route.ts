import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const SYSTEM_PROMPT = `You are an expert billing assistant for Indonesian
freelancers and agencies. Parse the user's natural language input and
extract structured billing data.

STRICT RULES:
1. Return ONLY a valid JSON object. No markdown, no backticks, no explanation.
2. Generate invoice number: INV-[YEAR]-[3-digit-random] or QUO-[YEAR]-[3-digit-random]
3. Calculate: total = qty * price, subtotal = sum of totals,
   taxAmount = subtotal * taxRate / 100, grandTotal = subtotal + taxAmount
4. Default currency: IDR
5. If input mentions "quotation/penawaran/quote" → type = "quotation", else "invoice"
6. issueDate = today in ISO format
7. dueDate = 14 days from today if not mentioned

Return ONLY this JSON:
{
  "type": "invoice",
  "invoiceNumber": "INV-2025-001",
  "issueDate": "2025-05-23",
  "dueDate": "2025-06-06",
  "clientName": "string",
  "clientEmail": null,
  "clientAddress": null,
  "clientPhone": null,
  "currency": "IDR",
  "items": [
    {
      "id": "item-1",
      "description": "string",
      "qty": 1,
      "price": 1000000,
      "total": 1000000
    }
  ],
  "subtotal": 1000000,
  "taxRate": null,
  "taxAmount": null,
  "discountAmount": null,
  "grandTotal": 1000000,
  "notes": null,
  "paymentTerms": null
}`;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY is not set");
      return NextResponse.json(
        { error: "API key tidak ditemukan." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Deskripsi terlalu pendek." },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content || "";
    console.log("DeepSeek response:", text);

    const data = JSON.parse(text);
    return NextResponse.json({ data });

  } catch (error) {
    console.error("Generate invoice error:", error);
    return NextResponse.json(
      { error: "AI gagal memproses permintaan. Coba ulangi." },
      { status: 500 }
    );
  }
}
