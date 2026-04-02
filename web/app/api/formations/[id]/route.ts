import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    console.log('[API formations DELETE] Suppression formation id:', id);

    const sessions = await prisma.session.findMany({
      where: { idFormation: id },
      select: { id_session: true },
    });
    console.log('[API formations DELETE] Sessions trouvées:', sessions.length);

    for (const session of sessions) {
      await prisma.suivi.deleteMany({ where: { idSession: session.id_session } });
    }
    console.log('[API formations DELETE] Suivis supprimés');

    await prisma.session.deleteMany({ where: { idFormation: id } });
    console.log('[API formations DELETE] Sessions supprimées');

    await prisma.formation.delete({ where: { id_formation: id } });
    console.log('[API formations DELETE] Formation supprimée:', id);

    return NextResponse.json({ message: 'Formation supprimée avec succès.' });
  } catch (error) {
    console.error('[API formations DELETE] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}