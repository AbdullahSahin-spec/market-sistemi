"use client";
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface Hareket {
  id: number;
  personelId: number;
  islemTipi: string;
  tarih: string;
  personel: {
    id: number;
    adSoyad: string;
  };
}

export default function GelismisAdminPaneli() {
  const [hareketler, setHareketler] = useState<Hareket[]>([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [secilenTip, setSecilenTip] = useState("TUMU");
  const [yukleniyor, setYukleniyor] = useState(true);

  // Sayfa açıldığında verileri API'den çek
  useEffect(() => {
    fetch('/api/hareketler')
      .then(res => res.json())
      .then(data => {
        setHareketler(data);
        setYukleniyor(false);
      })
      .catch(err => {
        console.error(err);
        setYukleniyor(false);
      });
  }, []);

  // 1. FİLTRELEME MANTIĞI: Kullanıcının aradığı kelimeye ve seçtiği tipe göre listeyi daralt
  const filtrelenmisHareketler = hareketler.filter((hareket) => {
    const aramaUygun = 
      hareket.personel.adSoyad.toLowerCase().includes(aramaMetni.toLowerCase()) || 
      hareket.personelId.toString().includes(aramaMetni);
    
    const tipUygun = secilenTip === "TUMU" || hareket.islemTipi === secilenTip;

    return aramaUygun && tipUygun;
  });

  // 2. EXCEL ÇIKTISI ALMA MANTIĞI
  const excelIndir = () => {
    // Verileri Excel'in anlayacağı temiz bir formata çeviriyoruz
    const excelVerisi = filtrelenmisHareketler.map((h) => {
      const tarihObj = new Date(h.tarih);
      return {
        "Personel ID": h.personelId,
        "Ad Soyad": h.personel.adSoyad,
        "İşlem Tipi": h.islemTipi,
        "Tarih": tarihObj.toLocaleDateString('tr-TR'),
        "Saat": tarihObj.toLocaleTimeString('tr-TR')
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelVerisi);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personel_Hareketleri");
    
    // Dosyayı indir
    XLSX.writeFile(workbook, "Market_Personel_Raporu.xlsx");
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px' }}>
          <h1 style={{ color: '#111827', margin: 0, fontSize: '1.8rem' }}>Yönetici Paneli - Raporlama</h1>
          <button 
            onClick={excelIndir}
            disabled={filtrelenmisHareketler.length === 0}
            style={{ 
              backgroundColor: filtrelenmisHareketler.length === 0 ? '#9ca3af' : '#16a34a', 
              color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', 
              fontWeight: 'bold', cursor: filtrelenmisHareketler.length === 0 ? 'not-allowed' : 'pointer' 
            }}
          >
            📊 Excel İndir (.xlsx)
          </button>
        </div>

        {/* Filtreleme ve Arama Alanı */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Personel Adı veya ID ile Ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
          />
          <select 
            value={secilenTip} 
            onChange={(e) => setSecilenTip(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', cursor: 'pointer' }}
          >
            <option value="TUMU">Tüm İşlemler</option>
            <option value="GİRİŞ">Sadece Girişler</option>
            <option value="ÇIKIŞ">Sadece Çıkışlar</option>
          </select>
        </div>

        {/* Tablo */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#4b5563', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Ad Soyad</th>
              <th style={{ padding: '12px' }}>İşlem Tipi</th>
              <th style={{ padding: '12px' }}>Tarih & Saat</th>
            </tr>
          </thead>
          <tbody>
            {yukleniyor ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Veriler yükleniyor...</td>
              </tr>
            ) : filtrelenmisHareketler.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Aradığınız kritere uygun kayıt bulunamadı.</td>
              </tr>
            ) : (
              filtrelenmisHareketler.map((hareket) => (
                <tr key={hareket.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', color: '#374151', fontWeight: 'bold' }}>{hareket.personelId}</td>
                  <td style={{ padding: '12px', color: '#111827' }}>{hareket.personel.adSoyad}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: hareket.islemTipi === "GİRİŞ" ? '#dcfce7' : '#fee2e2', 
                      color: hareket.islemTipi === "GİRİŞ" ? '#16a34a' : '#dc2626', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' 
                    }}>
                      {hareket.islemTipi}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#4b5563', fontWeight: '500' }}>
                    {new Date(hareket.tarih).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}