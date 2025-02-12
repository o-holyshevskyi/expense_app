import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./layout";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { Providers } from "./providers";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSignInPage = router.pathname === "/sign-in";
  
  return (
    <SessionProvider session={pageProps.session}>
      <Providers>
        {!isSignInPage ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </Providers>
    </SessionProvider>
  );
}
