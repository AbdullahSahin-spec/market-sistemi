export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isim = searchParams.get('isim');
    const tip = searchParams.get('tip');

    const where: Prisma.HareketWhereInput = {};

    if (id) {
      const idNum = Number(id);
      if (!Number.isNaN(idNum)) where.personelId = idNum;
    }
    if (tip === 'GIRIS' || tip === 'CIKIS') {
      where.tip = tip;
    }
    if (isim) {
      where.personel = {
        OR: [
          { ad: { contains: isim, mode: 'insensitive' } },
          { soyad: { contains: isim, mode: 'insensitive' } },
        ],
      };
    }

    const hareketler = await prisma.hareket.findMany({
      where,
      include: { personel: true },
      orderBy: { tarih: 'desc' },
      take: 500,
    });

    return NextResponse.json({ hareketler });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}