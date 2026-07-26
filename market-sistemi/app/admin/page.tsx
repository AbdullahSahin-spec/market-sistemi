'use client';

import { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

type Hareket = {
  id: number;
  personelId: number;
  tip: 'GIRIS' | 'CIKIS';
  tarih: string;
  personel: { id: number; ad: string; soyad: string };
};

export default function AdminPage() {
  const [hareketler, setHareketler] = useState<Hareket[]>([]);
  const [loading, setLoading] = useState(false);

  const [filtreId, setFiltreId] = useState('');
  const [filtreIsim, setFiltreIsim] = useState('');
  const [filtreTip, setFiltreTip] = useState('');

  const veriGetir = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtreId) params.set('id', filtreId);
      if (filtreIsim) params.set('isim', filtreIsim);
      if (filtreTip) params.set('tip', filtreTip);

      const res = await fetch(`/api/hareketler?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      setHareketler(data.hareketler ?? []);
    } finally {
      setLoading(false);
    }
  }, [filtreId, filtreIsim, filtreTip]);

  useEffect(() => {
    veriGetir();
  }, [veriGetir]);

  function excelAktar() {
    const rows = hareketler.map((h) => ({
      ID: h.personel.id,
      Ad: h.personel.ad,
      Soyad: h.personel.soyad,
      İşlem: h.tip === 'GIRIS' ? 'Giriş' : 'Çıkış',
      Tarih: new Date(h.tarih).toLocaleString('tr-TR'),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hareketler');
    XLSX.writeFile(wb, `hareketler-${Date.now()}.xlsx`);
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Yönetim Paneli</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Personel ID"
          value={filtreId}
          onChange={(e) => setFiltreId(e.target.value)}
          className="rounded border p-2"
        />
        <input
          placeholder="İsim / Soyisim"
          value={filtreIsim}
          onChange={(e) => setFiltreIsim(e.target.value)}
          className="rounded border p-2"
        />
        <select
          value={filtreTip}
          onChange={(e) => setFiltreTip(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">Tümü</option>
          <option value="GIRIS">Giriş</option>
          <option value="CIKIS">Çıkış</option>
        </select>
        <button onClick={veriGetir} className="rounded bg-blue-600 px-4 py-2 text-white">
          Filtrele
        </button>
        <button onClick={excelAktar} className="rounded bg-green-600 px-4 py-2 text-white">
          Excel'e Aktar
        </button>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Ad Soyad</th>
              <th className="p-2">İşlem</th>
              <th className="p-2">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {hareketler.map((h) => (
              <tr key={h.id} className="border-b">
                <td className="p-2">{h.personel.id}</td>
                <td className="p-2">{h.personel.ad} {h.personel.soyad}</td>
                <td className="p-2">{h.tip === 'GIRIS' ? 'Giriş' : 'Çıkış'}</td>
                <td className="p-2">{new Date(h.tarih).toLocaleString('tr-TR')}</td>
              </tr>
            ))}
            {hareketler.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Kayıt bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}