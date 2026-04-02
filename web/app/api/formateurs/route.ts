import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// POST /api/formateurs — Créer un nouveau formateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prenom, nom, email, password, date_naissance } = body;

    console.log('[API formateurs POST] Création formateur:', { prenom, nom, email });

    if (!prenom || !nom || !email || !password || !date_naissance) {
      return NextResponse.json({ error: 'Tous les champs sont obligatoires.' }, { status: 400 });
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const formateur = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email: email.toLowerCase(),
        password: hashedPassword,
        date_naissance: new Date(date_naissance),
        type_utilisateur: 'FORMATEUR',
        formateur: { create: {} },
      },
    });

    console.log('[API formateurs POST] Formateur créé:', formateur.id_utilisateur);
    return NextResponse.json({ success: true, id: formateur.id_utilisateur }, { status: 201 });
  } catch (error) {
    console.error('[API formateurs POST] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du formateur.' }, { status: 500 });
  }
}