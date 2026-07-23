"use client";
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QREkrani() {
  const [qrLink, setQrLink] = useState("");

  useEffect(() => {
    const linkGuncelle = () => {
      const token = Date.now().toString();
      // window.location.origin kodu, projenin o an çalıştığı gerçek domaini otomatik alır
      setQrLink(`${window.location.origin}/giris?token=${token}`);
    };

    linkGuncelle(); // Sayfa açılır açılmaz ilk linki üret
    
    // 60 saniyede bir linki yenile
    const interval = setInterval(linkGuncelle, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#111827' }}>Personel Giriş Sistemi</h1>
      <p style={{ marginBottom: '30px', color: '#4b5563' }}>Lütfen telefonunuzun kamerasıyla kodu okutun.</p>
      
      {qrLink && (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <QRCodeCanvas value={qrLink} size={300} />
        </div>
      )}
      
      <p style={{ marginTop: '20px', color: '#dc2626', fontWeight: 'bold' }}>
        Bu kod her 60 saniyede bir yenilenir!
      </p>
    </div>
  );
}