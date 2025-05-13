import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevOps Cheatsheet Hub',
  description: 'A comprehensive collection of DevOps tools and practices',
  icons: {
    // Favicons
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    // Apple Touch Icon
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    // Android Chrome Icons
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  // Open Graph metadata
  openGraph: {
    title: 'DevOps Cheatsheet Hub',
    description: 'A comprehensive collection of DevOps tools and practices',
    url: 'https://devops-cheatsheet.com',
    siteName: 'DevOps Cheatsheet Hub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'DevOps Cheatsheet Hub',
    description: 'A comprehensive collection of DevOps tools and practices',
    images: ['/twitter-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-black flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
} 