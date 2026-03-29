import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(Request : Request) {
  const { searchParams } = new URL(Request.url);
  const idBenevole = searchParams.get('idBenevole');
  const idThematique = searchParams.get('idThematique');
  const statut = searchParams.get('statut');
  let thematiques: any[] = [];
  try {    
    if (idBenevole && idThematique) {
      const countFait = await prisma.formation.count({
        where: {
          thematiqueId: parseInt(idThematique),
          sessions: {
            some: {
              suivis: {
                some: {
                  idBenevole: parseInt(idBenevole),
                  statut: true,
                }
              }
            }
          }
        }
      });

      console.log("Progressions récupérées:", countFait);
      return NextResponse.json({ count: countFait });
    } 
    else if (idBenevole && statut === "false") {
      thematiques = await prisma.thematique.findMany({
        where : 
        {
            formations: {
              none : {          
                sessions: {
                some: {
                  suivis: {
                    some: {
                      idBenevole: parseInt(idBenevole),
                    }
                  }
                }
              }
            }
          }
        },
        include: {
          _count: { select: { formations: true } }
        }
      });
    }
      else if (idBenevole) {
      thematiques = await prisma.thematique.findMany({
        where : 
        {
            formations: {
              some : {          
                sessions: {
                some: {
                  suivis: {
                    some: {
                      idBenevole: parseInt(idBenevole),
                    }
                  }
                }
              }
            }
          }
        },
        include: {
          _count: { select: { formations: true } }
        }
      });
    }
    
    else {
      thematiques = await prisma.thematique.findMany({
        include: {
            _count: {
                select: { formations: true }
              }        
            }
        });
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
          return {
            ...t,
            totalDuration: sumData?._sum?.duration || 0
          };
          
        });

        console.log("Thématiques récupérées:", result);
          return NextResponse.json(result);
      }
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}