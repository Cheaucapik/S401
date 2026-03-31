import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.utilisateur.findUnique({
            where: { email: email.toLowerCase() }
        });

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexEmail.test(email)) {
            return NextResponse.json({ error: "Email invalide" }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user.id_utilisateur, email: user.email },
            process.env.NEXTAUTH_SECRET!, 
            { expiresIn: '24h' }
        );

        console.log(user.type_utilisateur);

        return NextResponse.json({
            message: "Connexion réussie",
            token: token,
            user: {
                id: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                type: user.type_utilisateur
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}