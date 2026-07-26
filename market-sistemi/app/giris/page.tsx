'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function GirisForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [personelId, setPersonelId] = useState('');
  const [durum, setDurum] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    if (!token) {
      setDurum('error');
      setMesaj('Geçersiz veya süresi dolmuş QR kod.');
    }
  }, [token]);

  async function gonder(tip: 'GIRIS' | 'CIKIS') {
    if (!personelId) {
      setMesaj('Lütfen personel numaranızı girin.');
      return;
    }
    setDurum('loading');
    try {
      const res = await fetch('/api/islem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personelId: Number(personelId), tip, token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'İşlem başarısız');
      setDurum('ok');
      setMesaj(`${data.personel.ad} ${data.personel.soyad} — ${tip === 'GIRIS' ? 'Giriş' : 'Çıkış'} kaydedildi.`);
      setPersonelId('');
    } catch (err) {
      setDurum('error');
      setMesaj(err instanceof Error ? err.message : 'Bilinmeyen hata');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Personel İşlemi</h1>

      <input
        type="number"
        inputMode="numeric"
        placeholder="Personel No"
        value={personelId}
        onChange={(e) => setPersonelId(e.target.value)}
        className="rounded-lg border p-3 text-lg"
      />

      <div className="flex gap-3">
        <button
          onClick={() => gonder('GIRIS')}
          disabled={durum === 'loading'}
          className="flex-1 rounded-lg bg-green-600 p-3 font-medium text-white disabled:opacity-50"
        >
          Giriş
        </button>
        <button
          onClick={() => gonder('CIKIS')}
          disabled={durum === 'loading'}
          className="flex-1 rounded-lg bg-red-600 p-3 font-medium text-white disabled:opacity-50"
        >
          Çıkış
        </button>
      </div>

      {mesaj && (
        <p className={durum === 'ok' ? 'text-green-600' : 'text-red-600'}>{mesaj}</p>
      )}
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="p-6">Yükleniyor...</div>}>
      <GirisForm />
    </Suspense>
  );
}