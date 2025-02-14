import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import 'dotenv/config.js';
import fs from 'fs/promises';

const WHITELISTED_EMAILS = [
    "holyshevskyi.a@gmail.com",
    "holyshevskyi.o@gmail.com",
];

async function getUserRoles(email: string) {
    try {
        const data = await fs.readFile('./roles.json', 'utf-8');
        const roles = JSON.parse(data);
        return roles.users[email] || { groups: [], permissions: [] };
    } catch (error) {
        console.error("Failed to read roles.json", error);
        return { groups: [], permissions: [] };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID || '',
        clientSecret: process.env.AUTH_GOOGLE_SECRET  || '',
      }),
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        async jwt({ token }) {
            if (token.email) {
                if (!WHITELISTED_EMAILS.includes(token.email)) {
                    token.role = "guest";
                  } else {
                    const roles = await getUserRoles(token.email);
                    token.groups = roles.groups;
                    token.permissions = roles.permissions;
                    token.role = "user";
                  }
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    groups: token.groups as string[] || [],
                    permissions: token.permissions as string[] || [],
                    role: token.role as string || "guest",
                };
            }

            return session;
        },
        redirect() {
            return "/"
        }
    },
  };