import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider" // Declare the ThemeProvider variable
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AbyssRead",
  description: "Your manga and manhwa reading platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            {/* Cursor Badge */}
            <Link
              href="https://cursor.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed left-4 bottom-4 z-50 flex items-center space-x-2 rounded-full bg-black/10 px-4 py-2 backdrop-blur-sm hover:bg-black/20 transition-all duration-200 border border-purple-500/20 glass-effect"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
                <path d="M5 5L19 19M12 12L19 5M12 12L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-purple-200">Made with Cursor</span>
            </Link>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
