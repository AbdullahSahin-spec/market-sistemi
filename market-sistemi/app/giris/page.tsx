"use client";
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function GirisFormu() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [personelId, setPersonelId] = useState("");
  const [islemTipi, setIslemTipi] = useState("GİRİŞ"); // Varsayılan giriş
  const [durum, setDurum] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDurum("İşlem kaydediliyor...");

    try {
      const response = await fetch("/api/islem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personelId: personelId,
          islemTipi: islemTipi,
        }),
      });

      if (response.ok) {
        setDurum(`${islemTipi} Başarıyla Kaydedildi! ✅`);
        setPersonelId("");
      } else {
        setDurum("Kayıt başarısız! Sistemde böyle bir ID yok. ❌");
      }
    } catch (error) {
      setDurum("Sunucuya ulaşılamıyor, internetinizi kontrol edin! ❌");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '380px', width: '100%' }}>
        <h2 style={{ marginBottom: '10px', color: '#111827' }}>Personel İşlem Paneli</h2>
        
        <p style={{ fontSize: '0.85rem', color: token ? '#16a34a' : '#dc2626', marginBottom: '20px' }}>
          {token ? `Güvenli Oturum Aktif` : "Uyarı: QR Kod okutulmadı!"}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Giriş / Çıkış Seçim Butonları */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIslemTipi("GİRİŞ")}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: islemTipi === "GİRİŞ" ? '#16a34a' : '#e5e7eb',
                color: islemTipi === "GİRİŞ" ? 'white' : '#374151', border: 'none'
              }}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setIslemTipi("ÇIKIŞ")}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                backgroundColor: islemTipi === "ÇIKIŞ" ? '#dc2626' : '#e5e7eb',
                color: islemTipi === "ÇIKIŞ" ? 'white' : '#374151', border: 'none'
              }}
            >
              Çıkış Yap
            </button>
          </div>

          <input
            type="number"
            placeholder="Personel ID (Örn: 101)"
            value={personelId}
            onChange={(e) => setPersonelId(e.target.value)}
            required
            style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          />
          
          <button 
            type="submit" 
            disabled={!token}
            style={{ 
              padding: '12px', fontSize: '16px', 
              backgroundColor: token ? '#2563eb' : '#9ca3af', 
              color: 'white', border: 'none', borderRadius: '8px', 
              cursor: token ? 'pointer' : 'not-allowed', fontWeight: 'bold' 
            }}
          >
            İşlemi Tamamla
          </button>
        </form>

        {durum && (
          <p style={{ marginTop: '20px', fontWeight: 'bold', color: durum.includes('✅') ? '#16a34a' : '#ef4444' }}>
            {durum}
          </p>
        )}
      </div>
    </div>
  );
}

export default function GirisEkrani() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>}>
      <GirisFormu />
    </Suspense>
  );
}