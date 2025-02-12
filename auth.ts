import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import 'dotenv/config.js';

export const authOptions: NextAuthOptions = {
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID || '', // Заміни на свої значення
        clientSecret: process.env.AUTH_GOOGLE_SECRET  || '', // Заміни на свої значення
      }),
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {

            }

            return token;
        },
        async session({ session, token }) {
            if (token) {

            }

            return session;
        },
        redirect() {
            return "/"
        }
    },
  };