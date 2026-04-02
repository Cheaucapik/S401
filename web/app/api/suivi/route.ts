import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request : Request) {
  const { searchParams } = new URL(request.url);
  const idBenevole = searchParams.get('id');
  try {    
    const suivis = await prisma.suivi.findMany({
    where: {
      idBenevole: parseInt(idBenevole!),
      statut: true
    },
    include : {
      session : {
        include : {
          formation : true
        }
      }
    }
  });
    console.log("Suivis récupérés:", suivis);
    return NextResponse.json(suivis);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idBenevole, idSession, statut } = body;

    // Vérification des données
    if (!idBenevole || !idSession) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Création du suivi (inscription)
    const nouveauSuivi = await prisma.suivi.create({
      data: {
        idBenevole: parseInt(idBenevole),
        idSession: parseInt(idSession),
        statut: statut || false,
      },
    });

    return NextResponse.json(nouveauSuivi, { status: 201 });
  } catch (error: any) {
    console.error("Erreur POST Suivi:", error);
    
    // Gestion spécifique si l'utilisateur est déjà inscrit (P2002 = Unique constraint failed)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Vous êtes déjà inscrit à cette session." }, { status: 409 });
    }

    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}