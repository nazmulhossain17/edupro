import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduPro Learn - Industry-Relevant IT Courses',
  description: 'Modern e-learning platform delivering industry-relevant IT courses with verifiable digital certificates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Auth0Provider>
        <body className={inter.className}>{children}</body>
      </Auth0Provider>
    </html>
  );
}
