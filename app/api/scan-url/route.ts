import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Nije primljen nikakav ulazni podatak' }, { status: 400 });
    }

    console.log('Primljeni tekst s mobitela:', url);

    // Pametni filter: tražimo web link unutar primljenog teksta (rješava problem s Any inputom)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = url.match(urlRegex);
    
    if (!matches || matches.length === 0) {
      return NextResponse.json({ error: 'Failed to parse URL from Shortcut Input' }, { status: 400 });
    }

    // Uzimamo čisti link, očišćen od naslova i dodatnog teksta
    const cleanUrl = matches[0];
    console.log('Očišćeni URL za obradu:', cleanUrl);

    // Simuliramo pravi iPhone na mobilnoj mreži
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch page: ${response.status}` }, { status: 500 });
    }

    const htmlText = await response.text();

    let extractedAddress = "Unknown Address";
    let extractedPrice = "Unknown Price";

    // Izvlačenje adrese iz naslova stranice
    const titleMatch = htmlText.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      extractedAddress = titleMatch[1].split('|')[0].split(' - ')[0].trim();
    }

    // Izvlačenje cijene
    const priceMatch = htmlText.match(/"price":\s*"?\$?([0-9,]+)"?/i) || htmlText.match(/\$([0-9]{3},[0-9]{3})/);
    if (priceMatch && priceMatch[1]) {
      extractedPrice = `$${priceMatch[1]}`;
    }

    return NextResponse.json({
      success: true,
      message: "URL uspješno zaprimljen i obrađen",
      data: {
        url: cleanUrl,
        address: extractedAddress,
        price: extractedPrice,
        source: cleanUrl.includes('zillow.com') ? 'Zillow' : cleanUrl.includes('redfin.com') ? 'Redfin' : 'Realtor'
      }
    });

  } catch (error: any) {
    console.error('Greška prilikom obrade URL-a:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
