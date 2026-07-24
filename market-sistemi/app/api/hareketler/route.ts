import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Her istekte veritabanından en taze veriyi çekmesini zorluyoruz
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hareketler = await prisma.hareket.findMany({
      include: {
        personel: true,
      },
      orderBy: {
        tarih: 'desc', // En yeni işlemler en üstte görünsün
      },
    });

    return NextResponse.json(hareketler, { status: 200 });
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return NextResponse.json({ error: "Veriler alınamadı" }, { status: 500 });
  }
}