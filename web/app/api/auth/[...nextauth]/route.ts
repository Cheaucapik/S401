import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"

export const authOptions = {
    session: {
    strategy: "jwt", 
    },

    providers : [ 
        CredentialsProvider({
            name: "Connexion classique",

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password){
                    return null; 
                }
                const request = await prisma.utilisateur.findUnique({
                    where : {
                        email : credentials.email,
                    }
                });

                if(request){
                    const isPasswordValid = await bcrypt.compare(credentials.password, request.password);
                    if(isPasswordValid) return request as any;
                }

                return null; 
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };