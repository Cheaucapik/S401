import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises"; 
import { join } from "path";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        const userId = data.get("userId");

        if (!file || !userId) {
            return NextResponse.json({ error: "Manquant" }, { status: 400 });
        }

        const user = await prisma.utilisateur.findUnique({
            where: { id_utilisateur: Number(userId) },
            select: { pfp: true }
        });

        if (user?.pfp) {
            const oldFilePath = join(process.cwd(), "public", user.pfp);
            
            try {
                await unlink(oldFilePath); 
                console.log("Ancienne photo supprimée :", oldFilePath);
            } catch (err) {
                console.log("Pas de fichier à supprimer ou erreur :", err);
            }
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueName = `${Date.now()}-${file.name}`;
        const path = join(uploadDir, uniqueName);
        
        await writeFile(path, buffer);

        return NextResponse.json({ 
            success: true, 
            pfp: `/uploads/${uniqueName}` 
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}