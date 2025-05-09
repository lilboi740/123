import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CustomThemeProvider } from "@/components/custom-theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Telegram Clone",
  description: "A Telegram clone built with Next.js and shadcn/ui",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CustomThemeProvider defaultTheme="light" storageKey="telegram-clone-theme">
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </CustomThemeProvider>
      </body>
    </html>
  )
}
