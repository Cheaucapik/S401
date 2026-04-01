import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        const userId = data.get("userId");

        if (!file || !userId) {
            return NextResponse.json({ error: "Fichier ou ID manquant" }, { status: 400 });
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
        console.error("Erreur Upload:", error);
        return NextResponse.json({ error: "Erreur serveur lors de l'upload" }, { status: 500 });
    }
}