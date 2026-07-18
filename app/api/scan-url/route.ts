import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Primljen URL za obradu:', url);

    // Simuliramo pravi iPhone na mobilnoj mreži kako nas Zillow/Redfin ne bi odmah blokirali
    const response = await fetch(url, {
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

    // Pokrećemo laganu regex ekstrakciju osnovnih podataka iz HTML-a nekretnine
    // (Ovo traži standardne formate adresa i cijena na američkim oglasnicima)
    let extractedAddress = "Unknown Address";
    let extractedPrice = "Unknown Price";

    // 1. Pokušaj izvlačenja adrese preko naslova stranice (Zillow/Redfin često stavljaju adresu u <title>)
    const titleMatch = htmlText.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const titleText = titleMatch[1];
      // Ako naslov sadrži riječi poput 'Zillow' ili 'Redfin', pokušavamo očistiti tekst da ostane samo adresa
      extractedAddress = titleText.split('|')[0].split(' - ')[0].trim();
    }

    // 2. Pokušaj izvlačenja cijene traženjem dolarskog znaka i brojki u specifičnim meta oznakama
    const priceMatch = htmlText.match(/"price":\s*"?\$?([0-9,]+)"?/i) || htmlText.match(/\$([0-9]{3},[0-9]{3})/);
    if (priceMatch && priceMatch[1]) {
      extractedPrice = `$${priceMatch[1]}`;
    }

    // Ovdje se kôd povezuje s tvojom postojećom strukturom za spremanje nekretnina
    // Privremeno vraćamo podatke natrag aplikaciji kako bismo potvrdili da je link pročitan
    return NextResponse.json({
      success: true,
      message: "URL uspješno zaprimljen i obrađen",
      data: {
        url: url,
        address: extractedAddress,
        price: extractedPrice,
        source: url.includes('zillow.com') ? 'Zillow' : url.includes('redfin.com') ? 'Redfin' : 'Realtor'
      }
    });

  } catch (error: any) {
    console.error('Greška prilikom obrade URL-a:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
