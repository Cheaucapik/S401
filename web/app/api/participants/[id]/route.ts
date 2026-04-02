import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/participants/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    console.log('[API participants DELETE] id:', id);

    // Supprimer les suivis liés aux sessions du formateur
    const sessions = await prisma.session.findMany({
      where: { idFormateur: id },
      select: { id_session: true },
    });
    for (const session of sessions) {
      await prisma.suivi.deleteMany({ where: { idSession: session.id_session } });
    }

    // Supprimer les sessions du formateur
    await prisma.session.deleteMany({ where: { idFormateur: id } });

    // Supprimer le formateur
    await prisma.formateur.deleteMany({ where: { id_formateur: id } });

    // Supprimer l'utilisateur
    await prisma.utilisateur.delete({ where: { id_utilisateur: id } });

    console.log('[API participants DELETE] Formateur supprimé:', id);
    return NextResponse.json({ message: 'Formateur supprimé avec succès.' });
  } catch (error) {
    console.error('[API participants DELETE] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}