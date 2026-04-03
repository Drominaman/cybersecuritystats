import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cybersecuritystats.com'),
  title: {
    default: 'Cybersecurity Statistics — Data by Industry and Threat',
    template: '%s | CyberSecurityStats.com',
  },
  description:
    'Cybersecurity statistics organized by industry and threat type. Healthcare ransomware, financial services fraud, and more — data from 700+ reports.',
  openGraph: {
    type: 'website',
    siteName: 'CyberSecurityStats',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: './',
  },
  verification: {
    // Add your Google Search Console verification code here:
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
