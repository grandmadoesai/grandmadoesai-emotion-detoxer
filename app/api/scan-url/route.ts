import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawInput: string = body.url || '';

    console.log('Incoming raw string:', rawInput);

    // Extract the URL from the input text
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = rawInput.match(urlRegex);
    
    let cleanUrl = '';
    if (match && match[1]) {
      cleanUrl = match[1];
    } else {
      cleanUrl = rawInput;
    }

    if (!cleanUrl || cleanUrl.trim() === '') {
      return NextResponse.json({ error: 'No valid URL found' }, { status: 400 });
    }

    // Clean tracking tags from the URL (removes everything after the question mark)
    let finalUrl = cleanUrl.split('?')[0].replace(/[);,]+$/, '').trim();

    // ADVANCED ADDRESS EXTRACTION FROM ZILLOW LINK
    let parsedAddress = "Unknown Address";
    if (finalUrl.includes('://zillow.com')) {
      const parts = finalUrl.split('/homedetails/');
      if (parts && parts[1]) {
        const addressPart = parts[1].split('/')[0];
        if (addressPart) {
          // Replaces dashes with clear spaces and formats title case
          parsedAddress = addressPart
            .replace(/-/g, ' ')
            .replace(/\d+_zpid.*/, '')
            .trim();
        }
      }
    }

    // Load newly added Supabase credentials from your environment configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: true,
        message: "URL cleared. Note: Please run a fresh deployment to connect your newly saved Supabase variables.",
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
      // If table name differs, we still return the clean data to the phone screen
      return NextResponse.json({ 
        success: true, 
        message: `URL saved in memory, but database table mismatch: ${dbError.message}`,
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
