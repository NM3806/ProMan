import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from './AppProvider';
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ProMan',
  description: 'Project Management next app by nm3806',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SpeedInsights/>
          <AppProvider>{children}</AppProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}