import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {    
    const thematiques = await prisma.thematique.findMany({
    include: {
        _count: {
            select: { formations: true }
          }        
        }
    });


    const durationSums = await prisma.formation.groupBy({
      by: ['thematiqueId'], 
      _sum: {
        duration: true
      }
    });

    const result = thematiques.map(t => {
      const sumData = durationSums.find(s => s.thematiqueId === t.id_thematique);
      return {
        ...t,
        totalDuration: sumData?._sum?.duration || 0
      };
    });


  console.log("Thématiques récupérées:", result);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}