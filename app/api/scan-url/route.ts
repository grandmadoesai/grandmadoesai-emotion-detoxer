import { NextResponse } from 'next/server';
// Uvozimo tvoj postojeći Supabase klijent koji je već konfiguriran u aplikaciji
import { supabase } from '@/lib/supabaseClient';

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

    const finalUrl = cleanUrl.replace(/[);,]+$/, '').trim();

    // AUTOMATIC ADDRESS EXTRACTION FROM URL
    let parsedAddress = "Unknown Address";
    if (finalUrl.includes('://zillow.com')) {
      const parts = finalUrl.split('/homedetails/');
      if (parts[1]) {
        const addressPart = parts[1].split('/')[0];
        if (addressPart) {
          parsedAddress = addressPart.replace(/-/g, ' ').replace(/\d+_zpid.*/, '').trim();
        }
      }
    }

    // SAVING DIRECTLY TO YOUR SUPABASE DATABASE
    // We insert the house into your existing 'properties' table (or whatever your schema uses)
    const { data: savedData, error: dbError } = await supabase
      .from('properties') // Ako ti se tablica zove drukčije (npr 'listings'), AI na Vercelu će javiti grešku pa ćemo prilagoditi naziv
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
      console.error('Supabase error:', dbError);
      return NextResponse.json({ error: `Database insert failed: ${dbError.message}` }, { status: 500 });
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
