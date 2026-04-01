import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { message: "L'ID de la session est requis." },
      { status: 400 }
    );
  }

  try {
    const participants = await prisma.suivi.findMany({
      where: { idSession: parseInt(sessionId) },
      include: {
        benevole: {
          include: {
            utilisateur: {
              select: { id_utilisateur: true, nom: true, prenom: true }
            }
          }
        },
        session: {
          include: {
            formation: {
              include: { thematique: true }
            }
          }
        }
      }
    });

    const formattedParticipants = participants.map((p) => ({
      id_benevole: p.idBenevole,
      id_session: p.idSession,
      nom: p.benevole.utilisateur.nom,
      prenom: p.benevole.utilisateur.prenom,
      statut_presence: p.statut,
    }));

    return NextResponse.json({
      session: {
        date_deb: participants[0]?.session.date_deb,
        date_fin: participants[0]?.session.date_fin,
        presentiel: participants[0]?.session.presentiel,
        lieu: participants[0]?.session.lieu,
        formation: {
          title: participants[0]?.session.formation.title,
          duration: participants[0]?.session.formation.duration,
          description: participants[0]?.session.formation.description,
          image: participants[0]?.session.formation.image,
        }
      },
      participants: formattedParticipants
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur Backend:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des participants." },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  const body = await req.json();
  const { idBenevole, idSession, statut } = body;

  try {
    await prisma.suivi.update({
      where: {
        idBenevole_idSession: {
          idBenevole: idBenevole,
          idSession: idSession,
        }
      },
      data: { statut: statut }
    });

    return NextResponse.json({ message: "Statut mis à jour" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}