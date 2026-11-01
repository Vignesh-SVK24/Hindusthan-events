import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import SpatialBackground from '@/components/SpatialBackground';

export const metadata: Metadata = {
  title: 'HINDUSTHAN COLLEGE OF ENGINEERING AND TECHNOLOGY — Events & Discovery Hub',
  description: 'Official central events hub for Hindusthan College of Engineering and Technology (HiCET). Discover hackathons, cultural festivals, symposia, and athletic championships with bespoke dynamic webpages and real-time registration.',
  manifest: '/manifest.json',
  applicationName: 'HiCET Events Hub',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HiCET Events',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/app-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
        {/* Browser Address Bar & Mobile Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hindusthan Events" />
        <meta name="application-name" content="Hindusthan Events" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700;800;900&family=Orbitron:wght@700;900&family=Poppins:wght@400;500;600;700;800&family=Rajdhani:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FFFDF5] text-[#252525] selection:bg-[#FFE99A] selection:text-[#252525] relative min-h-screen">
        <SpatialBackground />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
