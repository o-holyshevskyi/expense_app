import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string;
            email?: string;
            image?: string;
            groups?: string[];
            permissions?: string[];
            role: string;
        }
    }

    interface JWT {
        groups?: string[];
        permissions?: string[];
    }
}