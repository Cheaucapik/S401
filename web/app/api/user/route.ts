import { NextResponse } from "next/server";
import { unlink } from "fs/promises"; 
import { join } from "path";
import prisma from "@/lib/prisma"; 

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, prenom, nom, email, date_naissance, pfp } = body;

        if (pfp === null) {
        const currentUser = await prisma.utilisateur.findUnique({
            where: { id_utilisateur: Number(id) },
            select: { pfp: true }
        });

        if (currentUser?.pfp) {
            const pathToDelete = join(process.cwd(), "public", currentUser.pfp);
            try { await unlink(pathToDelete); } catch (e) {}
        }
    }

        const updatedUser = await prisma.utilisateur.update({
            where: { id_utilisateur: id },
            data: {
                prenom: prenom,
                nom: nom,
                email: email.toLowerCase(),
                date_naissance: new Date(date_naissance),
                pfp: pfp,
            },
        });

        return NextResponse.json({ 
            message: "Profil mis à jour", 
            user: {
                id: updatedUser.id_utilisateur,
                prenom: updatedUser.prenom,
                nom: updatedUser.nom,
                email: updatedUser.email,
                date_naissance: updatedUser.date_naissance,
                pfp : updatedUser.pfp
            } 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}