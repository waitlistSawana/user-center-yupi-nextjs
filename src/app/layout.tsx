import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
// sonner doc https://sonner.emilkowal.ski/getting-started
import { Toaster } from "@/components/ui/sonner";
import TankstackQueryProvider from "@/components/tanstack-query-provider";

export const metadata: Metadata = {
  title: "鱼皮用户中心 - Nextjs",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <TankstackQueryProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TankstackQueryProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
