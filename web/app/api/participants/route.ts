import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Plus de "handler", on nomme la fonction directement GET
export async function GET(req: Request) {
  // C'est ici qu'on récupère l'ID de la session dans l'URL avec le App Router
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
      where: {
        idSession: parseInt(sessionId),
      },
      include: {
        benevole: {
          include: {
            utilisateur: {
              select: {
                id_utilisateur: true,
                nom: true,
                prenom: true,
              },
            },
          },
        },
      },
    });

    const formattedParticipants = participants.map((p) => ({
      id_benevole: p.idBenevole,
      id_session: p.idSession,
      nom: p.benevole.utilisateur.nom,
      prenom: p.benevole.utilisateur.prenom,
      statut_presence: p.statut,
    }));

    return NextResponse.json(formattedParticipants, { status: 200 });

  } catch (error) {
    console.error("Erreur Backend:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des participants." },
      { status: 500 }
    );
  }
}