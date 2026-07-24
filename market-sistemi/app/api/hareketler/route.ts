export const dynamic = 'force-dynamic'; // Next.js'in Build aşamasında burayı çalıştırmasını kesin olarak yasaklar!

import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const hareketler = await prisma.hareket.findMany({
      include: {
        personel: true,
      },
      orderBy: {
        tarih: 'desc',
      },
    });

    return NextResponse.json(hareketler, { status: 200 });
  } catch (error) {
    console.error("Hareketleri çekme hatası:", error);
    return NextResponse.json({ error: "Veriler alınamadı" }, { status: 500 });
  }
}