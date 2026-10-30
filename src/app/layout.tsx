import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Hindusthan Events Hub — Central Campus Event Discovery & Publishing Platform',
  description: 'Official central events hub for Hindusthan Educational & Charitable Trust. Discover hackathons, cultural festivals, symposia, and inter-collegiate sports meets with independent bespoke webpages and instant registration.',
  icons: {
    icon: '/college-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@700;900&family=Poppins:wght@400;600;700;800&family=Rajdhani:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#070b19] text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
