import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { RouterProgress } from "@/components/router-progress"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CineVerse - Discover Movies, TV Shows & Anime",
  description: "A cinematic experience for discovering and exploring movies, TV series, and anime. Powered by TMDb.",
  keywords: ["movies", "tv shows", "anime", "streaming", "entertainment"],
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
<<<<<<< HEAD
=======
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
      <body className="min-h-screen">
        <RouterProgress />
        {children}
      </body>
    </html>
  )
}
