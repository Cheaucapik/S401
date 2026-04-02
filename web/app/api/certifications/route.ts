import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/certification?idThematique=X
 * Retourne les bénévoles qui ont validé TOUTES les formations d'un axe (certifiés OpenMinds).
 * Sans paramètre, retourne tous les bénévoles certifiés sur au moins un axe.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idThematique = searchParams.get('idThematique');

  try {
    // Récupère toutes les thématiques concernées avec leurs formations
    const thematiques = await prisma.thematique.findMany({
      where: idThematique ? { id_thematique: parseInt(idThematique) } : undefined,
      include: {
        formations: {
          include: {
            sessions: {
              include: {
                suivis: {
                  where: { statut: true },
                  include: {
                    benevole: {
                      include: { utilisateur: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const certifies: any[] = [];

    for (const thematique of thematiques) {
      // Récupère tous les bénévoles distincts ayant au moins un suivi dans cet axe
      const benevoleIds = new Set<number>();
      for (const formation of thematique.formations) {
        for (const session of formation.sessions) {
          for (const suivi of session.suivis) {
            benevoleIds.add(suivi.idBenevole);
          }
        }
      }

      // Pour chaque bénévole, vérifie qu'il a validé AU MOINS UNE session de CHAQUE formation
      for (const idBenevole of benevoleIds) {
        let toutesFormationsValidees = true;

        for (const formation of thematique.formations) {
          const aValide = formation.sessions.some((session) =>
            session.suivis.some((suivi) => suivi.idBenevole === idBenevole && suivi.statut === true)
          );
          if (!aValide) {
            toutesFormationsValidees = false;
            break;
          }
        }

        if (toutesFormationsValidees) {
          // Récupère les infos du bénévole
          const benevole = thematique.formations[0]?.sessions
            .flatMap((s) => s.suivis)
            .find((s) => s.idBenevole === idBenevole)?.benevole;

          if (benevole) {
            certifies.push({
              idBenevole,
              nom: benevole.utilisateur.nom,
              prenom: benevole.utilisateur.prenom,
              email: benevole.utilisateur.email,
              axe: {
                id_thematique: thematique.id_thematique,
                title: thematique.title,
                color: thematique.color,
                colorTitle: thematique.colorTitle,
              },
            });
          }
        }
      }
    }

    return NextResponse.json(certifies);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des certifications.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/certification
 * Valider manuellement la participation d'un bénévole à une session (passe statut à true).
 * Body: { idBenevole: number, idSession: number }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { idBenevole, idSession } = body;

    if (!idBenevole || !idSession) {
      return NextResponse.json(
        { error: 'idBenevole et idSession sont obligatoires.' },
        { status: 400 }
      );
    }

    // Upsert : crée le suivi s'il n'existe pas, sinon le met à jour
    const suivi = await prisma.suivi.upsert({
      where: {
        idBenevole_idSession: {
          idBenevole: parseInt(idBenevole),
          idSession: parseInt(idSession),
        },
      },
      update: { statut: true },
      create: {
        idBenevole: parseInt(idBenevole),
        idSession: parseInt(idSession),
        statut: true,
      },
    });

    return NextResponse.json({ message: 'Certification validée.', suivi });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la validation de la certification.' },
      { status: 500 }
    );
  }
}