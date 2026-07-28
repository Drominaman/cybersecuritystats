import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import './globals.css'

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
    google: 'o9sh4HR89YcYawwoKVcQdGaLtKVTtO7hIXRU9N9NmsE',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "w7wolgszyt");`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main>{children}</main>
        <Footer />
        <NewsletterPopup />
      </body>
    </html>
  )
}
