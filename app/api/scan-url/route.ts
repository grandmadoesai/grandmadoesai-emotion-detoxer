import { NextResponse } from 'next/server';
// Fleksibilan uvoz: prihvaćamo bilo koje ime pod kojim je Supabase konfiguriran u tvom projektu
import * as supabaseModule from '@/lib/supabaseClient';

// Automatski pronalazimo ispravan klijent unutar modula
const supabase = (supabaseModule as any).supabase || (supabaseModule as any).supabaseClient || (supabaseModule as any).default;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawInput: string = body.url || '';

    console.log('Processing incoming payload:', rawInput);

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

    const finalUrl = cleanUrl.replace(/[);,]+$/, '').trim();

    // EXTRACTION OF ADDRESS FROM URL TEXT
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

    // Checking if database client is properly initialized
    if (!supabase || typeof supabase.from !== 'function') {
      return NextResponse.json({ 
        success: true, 
        message: "URL received, but database client configuration needs a naming check.",
        extractedAddress: parsedAddress,
        url: finalUrl
      });
    }

    // INSERTING DATA INTO YOUR DATABASE
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
