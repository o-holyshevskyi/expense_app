import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased h-full justify-center dark:text-foreground dark:bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
