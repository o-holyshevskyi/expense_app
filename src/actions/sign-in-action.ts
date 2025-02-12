'use server';

import { signIn, signOut } from "next-auth/react";

export async function handleGoogleSignIn() {
    await signIn('google');
}

export async function handleGoogleSignOut() {
    await signOut();
}