"use client";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function DinamikQREkrani() {
  // Token'ı sadece useState içinde ve bileşen açıldığında bir kez üretiyoruz
  const [token, setToken] = useState<string>(() => 
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  
  const [kalanSaniye, setKalanSaniye] = useState<number>(30);
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    setDomain(window.location.origin);

    // useEffect içinde ASLA doğrudan setState (setToken) çağırmıyoruz, 
    // sadece setInterval içinde fonksiyon tetikliyoruz (lint kuralını aşmanın tek yolu budur).
    const zamanlayici = setInterval(() => {
      setKalanSaniye((onceki) => {
        if (onceki <= 1) {
          setToken(Math.random().toString(36).substring(2, 10).toUpperCase());
          return 30;
        }
        return onceki - 1;
      });
    }, 1000);

    return () => clearInterval(zamanlayici);
  }, []);

  const qrLink = domain ? `${domain}/giris?token=${token}` : '';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', margin: '0 0 10px 0', color: '#f8fafc', letterSpacing: '-0.025em' }}>
          Personel Giriş Sistemi
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', margin: 0 }}>
          Lütfen telefonunuzun kamerası ile karekodu okutun.
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '35px', 
        borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)', 
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {qrLink ? (
          <QRCode value={qrLink} size={280} level="H" />
        ) : (
          <div style={{ width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334151' }}>
            Yükleniyor...
          </div>
        )}
        
        <div style={{ width: '100%', marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Kalan Süre</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: kalanSaniye <= 5 ? '#ef4444' : '#2563eb' }}>
              {kalanSaniye} sn
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: kalanSaniye <= 5 ? '#ef4444' : '#2563eb', 
              width: `${(kalanSaniye / 30) * 100}%`,
              transition: 'width 1s linear, background-color 0.3s ease',
              borderRadius: '5px'
            }} />
          </div>
        </div>
      </div>
      
      <p style={{ marginTop: '25px', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
        Bu kod her 30 saniyede bir yenilenir.
      </p>
    </div>
  );
}