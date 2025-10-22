import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaDetail } from "@/components/media-detail"
import { getTVDetails } from "@/lib/api"
import { getTitle } from "@/lib/tmdb"
import type { Metadata } from "next"
import Link from "next/link"
import { Tv } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tv = await getTVDetails(Number.parseInt(params.id))

  if (!tv) {
    return {
      title: "TV Show Not Found - CineVerse",
    }
  }

  return {
    title: `${getTitle(tv)} - CineVerse`,
    description: tv.overview,
  }
}

export default async function TVPage({ params }: { params: { id: string } }) {
  const tv = await getTVDetails(Number.parseInt(params.id))

  if (!tv) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Tv className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-4xl font-bold mb-4">TV Show Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              This TV show hasn't been added to our collection yet. Browse our collection to find more shows.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/tv">Browse TV Shows</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  // </CHANGE>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<div className="h-screen skeleton" />}>
          <MediaDetail item={tv} mediaType="tv" />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
