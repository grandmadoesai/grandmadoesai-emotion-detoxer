import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawInput: string = body.url || '';

    console.log('Processing incoming payload:', rawInput);

    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = rawInput.match(urlRegex);
    
    let cleanUrl = '';
    if (match && match) {
      cleanUrl = match[0];
    } else {
      cleanUrl = rawInput;
    }

    if (!cleanUrl || cleanUrl.trim() === '') {
      return NextResponse.json({ error: 'No valid URL found' }, { status: 400 });
    }

    // Scrub tracking tags and trailing slashes safely
    let finalUrl = cleanUrl.split('?')[0].replace(/\/+$/, '').trim();

    // FAILSAFE TEXT EXTRACTION FOR AMERICAN PROPERTY LISTINGS
    let parsedAddress = "Unknown Address";
    if (finalUrl.includes('/homedetails/')) {
      const urlTokens = finalUrl.split('/homedetails/');
      if (urlTokens.length > 1) {
        const addressSegment = urlTokens[1].split('/')[0];
        if (addressSegment) {
          // Cleans dashes, removes the numerical ZPID code, and capitalizes words cleanly
          parsedAddress = addressSegment
            .replace(/-/g, ' ')
            .replace(/\d+_zpid.*/i, '')
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .trim();
        }
      }
    }

    // Force load the configuration elements
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: true,
        message: "URL cleared. Note: Run a fresh deployment from the Vercel Overview page to load your database credentials.",
        extractedAddress: parsedAddress,
        url: finalUrl
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // PERSIST DATA IN YOUR DATABASE TABLE
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
      return NextResponse.json({ 
        success: true, 
        message: `Address extracted, but your Supabase table name might differ from 'properties': ${dbError.message}`,
        extractedAddress: parsedAddress,
        url: finalUrl
      });
    }

    return NextResponse.json({
      success: true,
      message: "Property successfully saved to your Buyer CMA Database!",
      data: savedData
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
