import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateWithDeepSeek } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt } = body;

  if (!prompt || String(prompt).trim().length < 5) {
    return NextResponse.json(
      { error: "Deskripsi terlalu pendek. Minimal 5 karakter." },
      { status: 400 }
    );
  }

  try {
    let text = await generateWithDeepSeek(String(prompt).trim());

    // Strip markdown code blocks jika ada (Gemini kadang membungkusnya)
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    // Ambil bagian JSON jika ada teks di luar
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    const data = JSON.parse(text);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("DeepSeek error:", error);
    return NextResponse.json(
      { error: "AI gagal memproses permintaan. Coba ulangi dengan deskripsi yang lebih jelas." },
      { status: 500 }
    );
  }
}
