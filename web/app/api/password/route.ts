// web/app/api/user/password/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, oldPassword, newPassword } = body;

        // 1. Trouver l'utilisateur
        const user = await prisma.utilisateur.findUnique({
            where: { id_utilisateur: id }
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // 2. Vérifier si l'ancien mot de passe est correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "L'ancien mot de passe est incorrect" }, { status: 401 });
        }

        // 3. Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Mettre à jour dans la BD
        await prisma.utilisateur.update({
            where: { id_utilisateur: id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Mot de passe modifié avec succès" });

    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}