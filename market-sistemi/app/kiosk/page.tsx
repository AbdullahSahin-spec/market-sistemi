'use client';

import { useEffect, useState, useCallback } from 'react';
import QRCode from 'react-qr-code';

function generateToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const dynamic = 'force-dynamic';

export default function KioskPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [origin, setOrigin] = useState('');

  const refreshToken = useCallback(() => {
    setToken(generateToken());
  }, []);

  // Client-only kurulum: window/origin ve ilk token burada set edilir.
  // Render sırasında değil, effect içinde — prerender/SSR hatası oluşmaz.
  useEffect(() => {
    setMounted(true);
    setOrigin(window.location.origin);
    refreshToken();

    const interval = setInterval(refreshToken, 30_000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Yükleniyor...
      </div>
    );
  }

  const qrValue = `${origin}/giris?token=${token}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black">
      <h1 className="text-2xl font-semibold text-white">Personel Giriş / Çıkış</h1>
      <div className="rounded-xl bg-white p-6">
        <QRCode value={qrValue} size={280} />
      </div>
      <p className="text-sm text-gray-400">QR kod 30 saniyede bir yenilenir</p>
    </div>
  );
}