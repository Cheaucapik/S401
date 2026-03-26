import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request : Request) {
  const { searchParams } = new URL(request.url);
  const themaId = searchParams.get('id');
  const idForma = searchParams.get('idForma');
  try {
    let whereClause = {};
    if (idForma) {
      whereClause = { id_formation: parseInt(idForma) };
    }
    else if (themaId) {
      whereClause = { thematiqueId: parseInt(themaId) };
    }
    
    const formations = await prisma.suivi.findMany({
    where: whereClause,
  });
  console.log("Formations récupérées:", formations);
    return NextResponse.json(formations);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}