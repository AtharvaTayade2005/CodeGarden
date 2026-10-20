import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Code Garden | Gamified Botanical Python Learning',
  description:
    'A living ecosystem where your Python code nurtures a computational tree. Fix botanical parasites, advance through growth stages, and master Python logic with calibrated AI scaffolding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
