export const dynamic = 'force-dynamic'; // Bu satır Next.js'in cache yapmasını tamamen yasaklar!

import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { personelId, islemTipi } = body; // "GİRİŞ" veya "ÇIKIŞ" gelecek

    const personelKontrol = await prisma.personel.findUnique({
      where: { id: parseInt(personelId) },
    });

    if (!personelKontrol) {
      return NextResponse.json({ success: false, message: "Personel bulunamadı." }, { status: 404 });
    }

    const yeniHareket = await prisma.hareket.create({
      data: {
        personelId: parseInt(personelId),
        islemTipi: islemTipi || "GİRİŞ", 
      },
    });

    return NextResponse.json({ success: true, data: yeniHareket }, { status: 200 });
    
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json({ success: false, message: "Kayıt eklenemedi." }, { status: 500 });
  }
}