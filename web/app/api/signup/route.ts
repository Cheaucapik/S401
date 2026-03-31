import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request : Request) {
    try{
        const body = await request.json();
        const { email, password, date_naissance, prenom, nom } = body;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { email: email.toLowerCase() }
        });

        if(!email || !password || !date_naissance || !prenom || !nom) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexEmail.test(email)) {
            return NextResponse.json({ error: "Email invalide" }, { status: 400 });
        }

        if(existingUser) {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.utilisateur.create({
            data : {
                email : email.toLowerCase(),
                password : hashedPassword,
                date_naissance : new Date(date_naissance),
                prenom : prenom,
                nom : nom,
                benevole : {
                    create : {}
                },
            }
        });

        return NextResponse.json(
            { "success": true }, 
            { status: 201 }
        );

    }
    catch(error){
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}