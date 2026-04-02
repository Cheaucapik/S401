import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const themaId = searchParams.get('id');
  const idForma = searchParams.get('idForma');
  try {
    let whereClause = {};
    if (idForma) {
      whereClause = { id_formation: parseInt(idForma) };
    } else if (themaId) {
      whereClause = { thematiqueId: parseInt(themaId) };
    }
    const formations = await prisma.formation.findMany({
      where: whereClause,
    });
    console.log('[API formations GET] Formations récupérées:', formations.length);
    return NextResponse.json(formations);
  } catch (error) {
    console.error('[API formations GET] Erreur:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API formations POST] Body reçu:', body);

    const { title, description, duration, presentiel, numero, thematiqueId, image } = body;

    if (!title || !description || !duration || !thematiqueId) {
      return NextResponse.json({ error: 'title, description, duration et thematiqueId sont obligatoires' }, { status: 400 });
    }

    const formation = await prisma.formation.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        presentiel: presentiel ?? true,
        numero: numero ?? 1,
        thematiqueId: parseInt(thematiqueId),
        image: image ?? 'default',
      },
    });

    console.log('[API formations POST] Formation créée:', formation);
    return NextResponse.json(formation, { status: 201 });
  } catch (error) {
    console.error('[API formations POST] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}