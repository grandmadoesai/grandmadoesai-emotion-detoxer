'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Inicijalizacija Supabase klijenta
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PropertySummaryPage() {
  const params = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      if (!params || !params.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          throw new error;
        }

        if (!data) {
          setErrorMsg('Nekretnina nije pronađena u bazi podataka.');
        } else {
          setProperty(data);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Greška pri učitavanju podataka iz baze.');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [params?.id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Učitavam podatke nekretnine...</div>;
  }

  if (errorMsg || !property) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: 'red' }}>{errorMsg || 'Podaci nisu dostupni.'}</div>;
  }

  // Pomoćna funkcija za formatiranje valute
  const formatCurrency = (val: any) => {
    if (val === null || val === undefined) return 'Nije dostupno';
    const num = Number(val);
    if (isNaN(num)) return val;
    return '$' + num.toLocaleString();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#111' }}>🏢 Buyer CMA: Final Property Summary</h1>
        <p style={{ fontSize: '18px', margin: '0', color: '#666' }}><strong>Adresa:</strong> {property.address || 'Nije uneta'}</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
        <div><strong>Sobe:</strong> {property.bedrooms || property.beds || '-'} beds</div>
        <div><strong>Kupatila:</strong> {property.bathrooms || property.baths || '-'} baths</div>
        <div><strong>Kvadratura:</strong> {property.sqft || '-'} sqft</div>
        <div><strong>Godina gradnje:</strong> {property.year_built || '-'}</div>
        <div><strong>Parcel ID:</strong> {property.parcel_number || '-'}</div>
      </div>

      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>📊 Uporedni Pregled: Zillow vs. Clark County Službeni Podaci</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Podatak</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Zillow Podaci (Komercijalni)</th>
            <th style={{ padding: '12px', border: '1px solid #ddd', background: '#27ae60' }}>Clark County Službeni Podaci (Državni)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Cijena / Procjena Vrijednosti</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#c0392b', fontWeight: 'bold' }}>{formatCurrency(property.price || property.zillowPrice)}</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#27ae60', fontWeight: 'bold', background: '#f4fbf7' }}>{formatCurrency(property.county_value)}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Legalni Vlasnik Nekretnine</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Skriveno (Vidi se samo na zvaničnim dokumentima)</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', background: '#f4fbf7' }}>{property.owner_name || 'Nije dostupno'}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Poštanski Broj (ZIP)</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#c0392b' }}>{property.zillowZip || 'Nije specifikovano'}</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold', background: '#f4fbf7' }}>{property.correct_zip || 'Nije dostupno'}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Službena Vrijednost Zemljišta</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Nije dostupno</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', background: '#f4fbf7' }}>{formatCurrency(property.land_value)}</td>
          </tr>
          <tr>
            <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>Službena Vrijednost Građevine / Objekta</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', color: '#7f8c8d' }}>Nije dostupno</td>
            <td style={{ padding: '12px', border: '1px solid #ddd', background: '#f4fbf7' }}>{formatCurrency(property.building_value)}</td>
          </tr>
        </tbody>
      </table>

      {(property.price && property.county_value) && (
        <div style={{ borderLeft: '4px solid #27ae60', background: '#ebf5fb', padding: '15px', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#2980b9' }}>💡 Pametna Napomena za Kupca:</h4>
          <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
            Zillow trenutno procjenjuje ovu nekretninu na {formatCurrency(property.price)}, dok službena državna procjena okruga iznosi {formatCurrency(property.county_value)}. 
            Razlika iznosi {formatCurrency(Math.abs(Number(property.price) - Number(property.county_value)))}.
          </p>
        </div>
      )}
    </div>
  );
}
