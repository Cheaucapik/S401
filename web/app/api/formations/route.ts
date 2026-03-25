import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request : Request) {
  const { searchParams } = new URL(request.url);
  const formaId = searchParams.get('id');
  try {
    const whereClause = formaId ? { id_formation: parseInt(formaId) } : {};
    
    const formations = await prisma.formation.findMany({
    where: whereClause,
    include: {
      thematique: {
        include: {
          _count: {
            select: { formations: true }
          }
        }
      }
    }
  });
  console.log("Formations récupérées:", formations);
    return NextResponse.json(formations);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}