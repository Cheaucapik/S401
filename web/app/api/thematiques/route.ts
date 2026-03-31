import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(Request : Request) {
  const { searchParams } = new URL(Request.url);
  const idBenevole = searchParams.get('idBenevole');
  const statut = searchParams.get('statut');
  let thematiques: any[] = [];
  try {    

    const progression = {
      _count: { select: { formations: true } },
          formations: idBenevole ? {
              where: {
                  sessions: { some: { suivis: { some: { idBenevole: parseInt(idBenevole), statut: true } } } }
              },
              select: { id_formation: true }
          } : undefined
    }
    
      if(idBenevole && statut === 'continuer'){
        thematiques = await prisma.thematique.findMany({
          where: {
            formations: { some: { sessions: { some: { suivis: { some: { idBenevole: parseInt(idBenevole)} } } } } }},
            include : progression
        });
      }

      else if(idBenevole && statut === 'decouvrir'){
        thematiques = await prisma.thematique.findMany({
          where: {
            formations: { none: { sessions: { some: { suivis: { some: { idBenevole: parseInt(idBenevole)} } } } } }},
            include : progression
        });
      }

      else{
        thematiques = await prisma.thematique.findMany(
          { include : progression }
        );
      }


    

    const durationSums = await prisma.formation.groupBy({
        by: ['thematiqueId'], 
        _sum: {
          duration: true
        }
      });

      if(thematiques){
          const result = thematiques.map(t => {
          const sumData = durationSums.find(s => s.thematiqueId === t.id_thematique);
          const scoreProgression = t.formations ? t.formations.length : 0;
          return {
            ...t,
            totalDuration: sumData?._sum?.duration || 0,
            progression: scoreProgression,
          };
          
        });

        console.log("Thématiques récupérées:", result);
          return NextResponse.json(result);
      }
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}