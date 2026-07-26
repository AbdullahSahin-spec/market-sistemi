export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const personelId = Number(body.personelId);
    const tip = body.tip;

    if (!personelId || Number.isNaN(personelId)) {
      return NextResponse.json({ error: 'Geçersiz personel numarası' }, { status: 400 });
    }
    if (tip !== 'GIRIS' && tip !== 'CIKIS') {
      return NextResponse.json({ error: 'Geçersiz işlem tipi' }, { status: 400 });
    }

    const personel = await prisma.personel.findUnique({ where: { id: personelId } });
    if (!personel) {
      return NextResponse.json({ error: 'Personel bulunamadı' }, { status: 404 });
    }

    const hareket = await prisma.hareket.create({
      data: { personelId, tip },
      include: { personel: true },
    });

    return NextResponse.json({ success: true, personel: hareket. personel, hareket });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}