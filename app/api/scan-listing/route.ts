import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const rawKey = process.env.ANTHROPIC_API_KEY;
    const apiKey = rawKey?.replace(/[^A-Za-z0-9_-]/g, "");
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Server not configured",
          debug: {
            keyExists: !!rawKey,
            keyLength: rawKey ? rawKey.length : 0,
            imageSizeKB: Math.round((imageBase64.length * 0.75) / 1024),
          },
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType || "image/jpeg",
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `You are reading a screenshot of a real estate listing (Zillow, Redfin, Realtor.com, or similar). Extract every piece of information you can find and return ONLY a JSON object, no other text, no markdown fences.

Use exactly this shape:
{
  "address": string or null,
  "price": number or null (no currency symbols or commas),
  "sqft": number or null,
  "bedrooms": number or null,
  "bathrooms": number or null,
  "year_built": number or null,
  "extra": { any other fields you can find, e.g. lot_size, hoa_fee, property_type, days_on_market, price_per_sqft, garage, description, school_district, heating, cooling, etc. Use snake_case keys. Omit fields you cannot find. }
}

If you cannot find a field, use null. Do not guess values that aren't visible in the image.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "AI request failed" },
        { status: 500 }
      );
    }

    const textBlock = data.content?.find((b: any) => b.type === "text");
    const rawText = textBlock?.text || "{}";

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Could not parse AI response", raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
