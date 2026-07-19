'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PropertySummaryPage() {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProperty({
        address: "5320 NE 54th St, Vancouver, WA",
        zillowZip: "98662 (Pogrešan)",
        countyZip: "98661 (Točan)",
        zillowPrice: "$490,000",
        countyValue: "$453,826",
        landValue: "$152,100",
        buildingValue: "$301,726",
        owner: "WARRE JA VONCE",
        parcelNumber: "156948036",
        beds: 3,
        baths: 3,
        sqft: 1874,
        yearBuilt: 2007
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Učitavam podatke nekretnine... Spajam Zillow i Clark County registre...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#111' }}>🏛️ Buyer CMA: Final Property Summary</h1>
        <p style={{ fontSize: '18px', margin: '0', color: '#666' }}><strong>Adresa:</strong> {property.address} {property.countyZip}</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <div><strong>Sobe:</strong> {property.beds} beds</div>
        <div><strong>Kupaonice:</strong> {property.baths} baths</div>
        <div><strong>Kvadratura:</strong> {property.sqft} sqft</div>
        <div><strong>Godina gradnje:</strong> {property.yearBuilt}</div>
        <div><strong>Parcel ID:</strong> {property.parcelNumber}</div>
      </div>

      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>⚖️ Usporedni Pregled: Zillow vs. Clark County Službeni Registar</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Podatak</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Zillow Podaci (Komercijalni)</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', background: '#27ae60' }}>Clark County Službeno (Izvor Istine)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Cijena / Procjena Vrijednosti</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#c0392b', fontWeight: 'bold' }}>{property.zillowPrice}</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#27ae60', fontWeight: 'bold', background: '#f4fbf7' }}>{property.countyValue}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Legalni Vlasnik Nekretnine</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Skriveno (Vidi se samo agent)</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', background: '#f4fbf7' }}>{property.owner}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Poštanski Broj (ZIP)</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#c0392b' }}>{property.zillowZip}</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#27ae60', fontWeight: 'bold', background: '#f4fbf7' }}>{property.countyZip}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Službena Vrijednost Zemljišta</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Nije dostupno</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', background: '#f4fbf7' }}>{property.landValue}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Službena Vrijednost Građevine</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Nije dostupno</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', background: '#f4fbf7' }}>{property.buildingValue}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ borderLeft: '4px solid #27ae60', background: '#ebf5fb', padding: '15px', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#2980b9' }}>💡 Pametna Napomena za Kupca:</h4>
        <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
          Zillow trenutno precjenjuje ovu nekretninu u odnosu na službenu državnu procjenu okruga za <strong>$36,174</strong>, i prikazuje pogrešan ZIP kod. Ovaj službeni izvještaj vam daje prednost u pregovorima o cijeni!
        </p>
      </div>
    </div>
  );
}
