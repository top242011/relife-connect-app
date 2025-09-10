import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/hooks/use-language';

export const metadata: Metadata = {
  title: 'PolityConnect',
  description: 'HR and Operations Management for Political Parties',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
            <TooltipProvider>
                <MainLayout>{children}</MainLayout>
            </TooltipProvider>
            <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
