import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idBenevole = searchParams.get('idBenevole');

  if (!idBenevole) {
    return NextResponse.json({ error: "idBenevole requis" }, { status: 400 });
  }

  try {
    const suivis = await prisma.suivi.findMany({
      where: { idBenevole: parseInt(idBenevole) },
      include: { session: { include: { formation: true } } },
    });
    return NextResponse.json(suivis);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idBenevole, idSession, statut } = body;

    console.log('[API suivi POST] Body:', body);

    if (!idBenevole || !idSession) {
      return NextResponse.json({ error: 'idBenevole et idSession sont obligatoires.' }, { status: 400 });
    }

    // Vérifier si le suivi existe déjà
    const existing = await prisma.suivi.findUnique({
      where: { idBenevole_idSession: { idBenevole: parseInt(idBenevole), idSession: parseInt(idSession) } }
    });

    if (existing) {
      return NextResponse.json({ error: 'Vous êtes déjà inscrit à cette session.' }, { status: 400 });
    }

    const suivi = await prisma.suivi.create({
      data: {
        idBenevole: parseInt(idBenevole),
        idSession: parseInt(idSession),
        statut: statut ?? false,
      },
    });

    console.log('[API suivi POST] Suivi créé:', suivi);
    return NextResponse.json(suivi, { status: 201 });
  } catch (error) {
    console.error('[API suivi POST] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription.' }, { status: 500 });
  }
}