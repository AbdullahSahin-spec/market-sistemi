"use client";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function DinamikQREkrani() {
  const [token, setToken] = useState<string>("");
  const [kalanSaniye, setKalanSaniye] = useState<number>(30);

  useEffect(() => {
    // İlk açılışta rastgele bilet üreten fonksiyonu güvenli bir şekilde çağırıyoruz
    const rastgeleBilet = Math.random().toString(36).substring(2, 10).toUpperCase();
    setToken(rastgeleBilet);

    const zamanlayici = setInterval(() => {
      setKalanSaniye((onceki) => {
        if (onceki <= 1) {
          const yeniBilet = Math.random().toString(36).substring(2, 10).toUpperCase();
          setToken(yeniBilet);
          return 30;
        }
        return onceki - 1;
      });
    }, 1000);

    return () => clearInterval(zamanlayici);
  }, []);

  const qrLink = `https://${window.location.host}/giris?token=${token}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#111827', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#9ca3af' }}>Market Personel Sistemi</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#d1d5db' }}>Giriş yapmak için telefonunuzun kamerasından QR kodu okutun</p>
      
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        {token && <QRCode value={qrLink} size={250} level="H" />}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '25px' }}>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: kalanSaniye <= 5 ? '#ef4444' : '#2563eb', 
              width: `${(kalanSaniye / 30) * 100}%`,
              transition: 'width 1s linear, background-color 0.3s ease'
            }} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#374151', minWidth: '50px' }}>
            {kalanSaniye}
          </span>
        </div>
      </div>
      
      <p style={{ marginTop: '20px', color: '#4b5563', fontSize: '0.9rem' }}>
        Güvenlik Kodu: <span style={{ fontFamily: 'monospace' }}>{token}</span>
      </p>
    </div>
  );
}