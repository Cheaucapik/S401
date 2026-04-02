import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    const { title, description, color, colorTitle, image } = body;

    const thematique = await prisma.thematique.update({
      where: { id_thematique: id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(color && { color }),
        ...(colorTitle && { colorTitle }),
        ...(image && { image }),
      },
    });

    return NextResponse.json(thematique);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'axe.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    console.log('[API thematiques DELETE] id:', id);

    const formations = await prisma.formation.findMany({
      where: { thematiqueId: id },
      include: { sessions: { include: { suivis: true } } },
    });

    for (const formation of formations) {
      for (const session of formation.sessions) {
        await prisma.suivi.deleteMany({ where: { idSession: session.id_session } });
      }
      await prisma.session.deleteMany({ where: { idFormation: formation.id_formation } });
    }

    await prisma.formation.deleteMany({ where: { thematiqueId: id } });
    await prisma.thematique.delete({ where: { id_thematique: id } });

    console.log('[API thematiques DELETE] Axe supprimé:', id);
    return NextResponse.json({ message: 'Axe supprimé avec succès.' });
  } catch (error) {
    console.error('[API thematiques DELETE] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de l\'axe.' }, { status: 500 });
  }
}