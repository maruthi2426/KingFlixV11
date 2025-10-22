import { getGenres } from "@/lib/api"
import { MediaCard } from "./media-card"
import { Pagination } from "./pagination"
import Link from "next/link"

interface GenreResultsProps {
  genreId: number
  type: "movie" | "tv"
  page: number
}

export async function GenreResults({ genreId, type, page }: GenreResultsProps) {
  console.log("[v0] GenreResults rendering for genre:", genreId, "type:", type, "page:", page)

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000"
  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`
  }
  baseUrl = baseUrl.replace(/\/$/, "")

  const apiUrl = `${baseUrl}/api/genre-movies?genre_id=${genreId}&type=${type}&page=${page}`
  console.log("[v0] Fetching from URL:", apiUrl)

  let data: any = { results: [], total_pages: 1, page: 1, total_results: 0 }
  try {
    const res = await fetch(apiUrl, { cache: "no-store" })
    console.log("[v0] API Response status:", res.status)
    if (res.ok) {
      data = await res.json()
      console.log("[v0] API Response data - results:", data.results?.length, "total_pages:", data.total_pages)
    } else {
      console.error("[v0] API returned status:", res.status)
    }
  } catch (err) {
    console.error("[v0] Genre fetch error:", err)
  }

  const genresData = await getGenres(type)
  const genre = genresData.genres.find((g) => g.id === genreId)

  if (!genre) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">🎬</div>
        <h2 className="text-2xl font-serif font-bold">Genre Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          The genre you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/genres"
          className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
        >
          Browse All Genres
        </Link>
      </div>
    )
  }

  const paginatedData = data.results || []
  const totalPages = data.total_pages || 1
  const totalResults = data.total_results || 0

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">{genre.name}</h1>
        <p className="text-muted-foreground">
          Found {totalResults} {type === "movie" ? "movies" : "TV shows"}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/genres/${genreId}?type=movie`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              type === "movie" ? "bg-accent text-white" : "glass hover:bg-white/20"
            }`}
          >
            Movies
          </Link>
          <Link
            href={`/genres/${genreId}?type=tv`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              type === "tv" ? "bg-accent text-white" : "glass hover:bg-white/20"
            }`}
          >
            TV Series
          </Link>
        </div>
      </div>

      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-6xl">🎬</div>
          <h2 className="text-2xl font-serif font-bold">No Content Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            No {type === "movie" ? "movies" : "TV shows"} found for this genre. Try another genre or type.
          </p>
          <Link
            href="/genres"
            className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
          >
            Browse All Genres
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedData.map((item: any) => (
              <MediaCard key={item.tmdb_id || item.id} item={item} mediaType={type} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/genres/${genreId}?type=${type}`} />
          )}
        </>
      )}
    </div>
  )
}
