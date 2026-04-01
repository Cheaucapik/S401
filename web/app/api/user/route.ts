import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, prenom, nom, email, date_naissance } = body;

        // Mise à jour dans la base de données via Prisma
        const updatedUser = await prisma.utilisateur.update({
            where: { id_utilisateur: id },
            data: {
                prenom: prenom,
                nom: nom,
                email: email.toLowerCase(),
                date_naissance: new Date(date_naissance),
            },
        });

        return NextResponse.json({ 
            message: "Profil mis à jour", 
            user: {
                id: updatedUser.id_utilisateur,
                prenom: updatedUser.prenom,
                nom: updatedUser.nom,
                email: updatedUser.email,
                date_naissance: updatedUser.date_naissance
            } 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}