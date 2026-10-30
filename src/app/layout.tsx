import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Hindusthan Events Hub — Spatial Campus Event Discovery Platform',
  description: 'Official central events hub for Hindusthan Educational & Charitable Trust. Discover hackathons, cultural festivals, symposia, and athletic championships with bespoke dynamic webpages and real-time registration.',
  icons: {
    icon: '/college-logo.jpg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFDF5',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@700;900&family=Poppins:wght@400;500;600;700;800&family=Rajdhani:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FFFDF5] text-[#252525] selection:bg-[#FFE99A] selection:text-[#252525]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
