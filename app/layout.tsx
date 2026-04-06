import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/context"
import { AuthProvider } from "@/lib/auth/context"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6D1ED4",
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Zelle - Secure Disbursement Portal",
  description:
    "Secure Zelle payment disbursement portal. Select your U.S. financial institution to receive your Zelle transfer.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-zinc-950 ${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-zinc-950 text-white">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
