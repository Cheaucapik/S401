import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idFormation = searchParams.get('idFormation');

  if (!idFormation) {
    return NextResponse.json({ error: "idFormation requis" }, { status: 400 });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: {
        idFormation: parseInt(idFormation),
        date_deb: { gte: new Date() },
      },
      include: {
        formateur: { include: { utilisateur: true } }
      },
      orderBy: { date_deb: 'asc' }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}