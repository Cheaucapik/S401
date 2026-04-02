import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idBenevole = searchParams.get('idBenevole');
  const statut = searchParams.get('statut');

  try {
    const thematiques = await prisma.thematique.findMany({
      include: {
        _count: { select: { formations: true } },
        formations: { select: { duration: true } },
      },
    });

    // Calcul totalDuration pour chaque thématique
    const withDuration = thematiques.map(thema => ({
      ...thema,
      totalDuration: thema.formations.reduce((acc: number, f: any) => acc + (f.duration ?? 0), 0),
    }));

    // Admin : liste brute avec durée
    if (!idBenevole) {
      return NextResponse.json(withDuration);
    }

    // Bénévole : on calcule aussi la progression
    const result = await Promise.all(
      withDuration.map(async (thema) => {
        const suivis = await prisma.suivi.count({
          where: {
            idBenevole: parseInt(idBenevole),
            session: { formation: { thematiqueId: thema.id_thematique } },
          },
        });

        const progression = suivis;
        const total = thema._count.formations;

        if (statut === 'continuer' && (progression === 0 || progression >= total)) return null;
        if (statut === 'decouvrir' && progression !== 0) return null;

        return { ...thema, progression };
      })
    );

    return NextResponse.json(result.filter(Boolean));
  } catch (error) {
    console.error('[API thematiques GET] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API thematiques POST] Body reçu:', body);

    const { title, description, color, colorTitle, image } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'title et description sont obligatoires' }, { status: 400 });
    }

    const thematique = await prisma.thematique.create({
      data: {
        title,
        description,
        color: color ?? '#E8E7FE',
        colorTitle: colorTitle ?? '#846EE1',
        image: image ?? 'default',
      },
    });

    console.log('[API thematiques POST] Thématique créée:', thematique);
    return NextResponse.json(thematique, { status: 201 });
  } catch (error) {
    console.error('[API thematiques POST] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}