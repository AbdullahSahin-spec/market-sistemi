"use client";
import { useState } from 'react';

export default function GirisEkrani() {
  const [personelId, setPersonelId] = useState("");
  const [durum, setDurum] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDurum("Kaydediliyor...");

    const scriptURL = "https://script.google.com/macros/s/AKfycbyW8oYUyrbxP6Q6bJ-JyasiDngUbkTEJYBL2P_3dHW71QoOYMk1mmJcVxs5KFw9RQM-/exec";

    // 30 Kişilik Personel Listeni Buraya Ekleyeceksin
    const personelListesi: { [key: string]: string } = {
      "101": "Abdullah Şahin",
      "102": "Ahmet Yılmaz",
      "103": "Ayşe Demir",
      "104": "Mehmet Kaya"
      // Diğer personelleri de bu şekilde alta ekleyebilirsin
    };

    // Girilen ID'yi listede ara. Bulamazsa "Bilinmeyen Kayıt" yazsın.
    const gercekAdSoyad = personelListesi[personelId] || "Bilinmeyen Kayıt (" + personelId + ")";

    const veri = {
      personel_id: personelId,
      ad_soyad: gercekAdSoyad, // Artık statik "Personel X" değil, listeden gelen gerçek isim!
      tarih: new Date().toLocaleDateString('tr-TR'),
      saat: new Date().toLocaleTimeString('tr-TR')
    };

    try {
      await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(veri),
        mode: "no-cors" 
      });
      setDurum("Giriş Başarıyla Kaydedildi! ✅");
      setPersonelId("");
    } catch (error) {
      setDurum("Bir hata oluştu, tekrar deneyin! ❌");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '350px', width: '100%' }}>
        <h2 style={{ marginBottom: '20px', color: '#111827' }}>Market Personel Girişi</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="number"
            placeholder="Personel ID (Örn: 101)"
            value={personelId}
            onChange={(e) => setPersonelId(e.target.value)}
            required
            style={{ padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px', fontSize: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Giriş Yap
          </button>
        </form>

        {durum && (
          <p style={{ marginTop: '20px', fontWeight: 'bold', color: durum.includes('✅') ? '#16a34a' : '#2563eb' }}>
            {durum}
          </p>
        )}
      </div>
    </div>
  );
}