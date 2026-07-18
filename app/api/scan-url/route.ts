import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FORCE VERCEL TO SKIP STATIC COMPILATION TESTS DURING THE BUILD PHASE
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawInput: string = body.url || '';

    console.log('Incoming input from phone:', rawInput);

    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = rawInput.match(urlRegex);
    
    let cleanUrl = '';
    if (match && match[0]) {
      cleanUrl = match[0];
    } else {
      cleanUrl = rawInput;
    }

    if (!cleanUrl || cleanUrl.trim() === '') {
      return NextResponse.json({ error: 'No valid URL found' }, { status: 400 });
    }

    const finalUrl = cleanUrl.replace(/[);,]+$/, '').trim();

    // AUTOMATIC ZILLOW ADDRESS EXTRACTION
    let parsedAddress = "Unknown Address";
    if (finalUrl.includes('://zillow.com')) {
      const parts = finalUrl.split('/homedetails/');
      if (parts && parts[1]) {
        const addressPart = parts[1].split('/');
        if (addressPart && addressPart[0]) {
          parsedAddress = addressPart[0].replace(/-/g, ' ').replace(/\d+_zpid.*/, '').trim();
        }
      }
    }

    // Safely load Supabase configuration keys from backend variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If keys are missing in Vercel settings, skip database but return success to phone
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: true,
        message: "URL received successfully! Note: Add Supabase Env Variables to Vercel to enable database saving.",
        extractedAddress: parsedAddress,
        url: finalUrl
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // INSERT INTO YOUR SUPABASE DATABASE
    const { data: savedData, error: dbError } = await supabase
      .from('properties')
      .insert([
        {
          address: parsedAddress,
          url: finalUrl,
          source: finalUrl.includes('zillow.com') ? 'Zillow' : finalUrl.includes('redfin.com') ? 'Redfin' : 'Realtor',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Property successfully saved to your Database Dashboard!",
      data: savedData
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
