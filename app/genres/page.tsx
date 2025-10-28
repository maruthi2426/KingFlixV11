import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GenreGrid } from "@/components/genre-grid"
import { getGenres } from "@/lib/api"

export const dynamic = "force-dynamic"

async function GenresContent() {
  const [movieGenres, tvGenres] = await Promise.all([getGenres("movie"), getGenres("tv")])

  const allGenres = [...movieGenres.genres, ...tvGenres.genres]
  const uniqueGenres = Array.from(new Map(allGenres.map((g) => [g.id, g])).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Browse by Genre</h1>
        <p className="text-muted-foreground text-sm">Discover movies and TV shows by your favorite genres</p>
      </div>

      <GenreGrid genres={uniqueGenres} />
    </div>
  )
}

export default function GenresPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Suspense fallback={null}>
          <GenresContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
