import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request : Request) {
  const { searchParams } = new URL(request.url);
  const idBenevole = searchParams.get('id');
  try {    
    const suivis = await prisma.suivi.findMany({
    where: {
      idBenevole: parseInt(idBenevole!)
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