import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idFormateur = searchParams.get('idFormateur');
  const idBenevole = searchParams.get('idBenevole');
  const idFormation = searchParams.get('idFormation');

  // --- CAS FORMATEUR ---
  if (idFormateur) {
    try {
      const sessions = await prisma.session.findMany({
        where: { idFormateur: parseInt(idFormateur) },
        include: {
          formation: { include: { thematique: true } },
          suivis: true
        },
        orderBy: { date_deb: 'asc' }
      });

      const formatted = sessions.map((s) => ({
        id_session: s.id_session,
        date_deb: s.date_deb,
        date_fin: s.date_fin,
        presentiel: s.presentiel,
        lieu: s.lieu,
        nb_participants: s.suivis.length,
        formation: {
          id_formation: s.formation.id_formation,
          title: s.formation.title,
          duration: s.formation.duration,
          description: s.formation.description,
          image: s.formation.image,
        },
        thematique: {
          title: s.formation.thematique.title,
          color: s.formation.thematique.color,
          colorTitle: s.formation.thematique.colorTitle,
        },
        type_utilisateur : "FORMATEUR"
      }));

      return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
  }

  // --- CAS BENEVOLE ---
  try {
    const sessions = await prisma.session.findMany({
      where: {
        idFormation: parseInt(idFormation!),
        date_deb: { gte: new Date() },
        suivis: { some: { idBenevole: parseInt(idBenevole!), statut: false } },
      },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}