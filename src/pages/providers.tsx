'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function Providers({children}: { children: React.ReactNode }) {
    return (
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system">
          <ToastProvider
            toastOffset={25}
            placement="top-right"
            maxVisibleToasts={5}
            toastProps={{
              radius: "lg",
              variant: "flat",
              timeout: 7 * 1000,
              shadow: "md"
            }}
          />
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    )
}
