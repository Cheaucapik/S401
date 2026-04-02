import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idBenevole = searchParams.get('idBenevole');

  if (!idBenevole || idBenevole === 'null' || idBenevole === 'undefined') {
      return NextResponse.json({ message: "ID Bénévole invalide" }, { status: 400 });
    }

  if (idBenevole) {
    try {
      const sessions = await prisma.session.findMany({
        where: {
          suivis: {
            some : {idBenevole : parseInt(idBenevole)}
          }
        },
        include: {
        formation: {
          include: {
            thematique: {
                include: {
                    _count: {
                        select: { formations: true }
                    }
                }
            }
          }
        },
        },
        orderBy: { date_deb: 'asc' }
      });

      const formatted = sessions.map((s) => ({
        id_session: s.id_session,
        date_deb: s.date_deb,
        date_fin: s.date_fin,
        presentiel: s.presentiel,
        lieu: s.lieu,
        formation: {
            id_formation: s.formation.id_formation,
            title: s.formation.title,
            duration: s.formation.duration,
            description: s.formation.description,
            image: s.formation.image,
            numero : s.formation.numero,
        },
        thematique: {
            id_thematique : s.formation.thematique.id_thematique,
            title: s.formation.thematique.title,
            color: s.formation.thematique.color,
            colorTitle: s.formation.thematique.colorTitle,
            totalFormations: (s.formation.thematique as any)._count.formations,
        },
        type_utilisateur : "BENEVOLE"
      }));

      return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
  }
}