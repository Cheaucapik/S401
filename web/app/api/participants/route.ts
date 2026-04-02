import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/participants?type=FORMATEUR
// GET /api/participants
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const type = searchParams.get('type');

  try {
    // --- NOUVEAU CAS : RÉCUPÉRATION POUR UNE SESSION ---
    if (sessionId) {
      const idSess = parseInt(sessionId);

      // 1. On récupère la session et la formation liée
      const session = await prisma.session.findUnique({
        where: { id_session: idSess },
        include: {
          formation: true,
        },
      });

      // 2. On récupère les bénévoles inscrits à CETTE session via la table Suivi
      const suivis = await prisma.suivi.findMany({
        where: { idSession: idSess },
        include: {
          benevole: {
            include: {
              utilisateur: true,
            },
          },
        },
      });

      // 3. On formate les participants pour le Front-end
      const formattedParticipants = suivis.map((s) => ({
        id_benevole: s.idBenevole,
        id_session: s.idSession,
        nom: s.benevole.utilisateur.nom,
        prenom: s.benevole.utilisateur.prenom,
        statut_presence: s.statut, // Assure-toi que 'statut' est le booléen de présence
      }));

      // ON RENVOIE LA STRUCTURE ATTENDUE PAR LE MOBILE
      return NextResponse.json({
        session: session,
        participants: formattedParticipants,
      });
    }

    // --- ANCIEN CAS : LISTE GÉNÉRALE PAR TYPE (ADMIN) ---
    const utilisateurs = await prisma.utilisateur.findMany({
      where: type ? { type_utilisateur: type } : {},
      orderBy: { nom: 'asc' },
    });

    return NextResponse.json(utilisateurs);

  } catch (error) {
    console.error('[API participants GET] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}