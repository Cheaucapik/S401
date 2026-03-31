import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request : Request) {
  const { searchParams } = new URL(request.url);
  const idBenevole = searchParams.get('idBenevole');
  const idFormation = searchParams.get('idFormation');
  try {    
    const sessions = await prisma.session.findMany({
    where: {
      idFormation : parseInt(idFormation!),
      date_deb: { gte: new Date() },
      suivis: { some: { idBenevole: parseInt(idBenevole!), statut: false } },
    },
  });
    console.log("Sessions récupérés:", sessions);
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}