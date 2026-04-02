import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/participants?type=FORMATEUR
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      where: type ? { type_utilisateur: type } : {},
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        type_utilisateur: true,
      },
      orderBy: { nom: 'asc' },
    });

    console.log('[API participants GET] Résultats:', utilisateurs.length);
    return NextResponse.json(utilisateurs);
  } catch (error) {
    console.error('[API participants GET] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}