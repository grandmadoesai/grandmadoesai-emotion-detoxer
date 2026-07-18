import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawInput: string = body.url || '';

    console.log('Incoming input from phone:', rawInput);

    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = rawInput.match(urlRegex);
    
    // Strict TypeScript validation to prevent Vercel build crashes
    let cleanUrl = '';
    if (match && match[1]) {
      cleanUrl = match[1];
    } else {
      cleanUrl = rawInput;
    }

    if (!cleanUrl || cleanUrl.trim() === '') {
      return NextResponse.json({ error: 'No valid URL or text found' }, { status: 400 });
    }

    const finalUrl = cleanUrl.replace(/[);,]+$/, '').trim();

    return NextResponse.json({
      success: true,
      message: "URL successfully received and processed",
      data: {
        url: finalUrl,
        source: finalUrl.includes('zillow.com') ? 'Zillow' : finalUrl.includes('redfin.com') ? 'Redfin' : 'Realtor'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
