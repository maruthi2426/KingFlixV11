import { type NextRequest, NextResponse } from "next/server"
import { getTMDBApiKey } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const TMDB_API_KEY = getTMDBApiKey()
    if (!TMDB_API_KEY) {
      console.error("[v0] TMDB_API_KEY is not configured")
      return NextResponse.json({ results: [], count: 0, error: "TMDB API key is not configured" }, { status: 500 })
    }

    const moviesRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`, {
      cache: "force-cache",
    })
    const tvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&page=1`, {
      cache: "force-cache",
    })

    const moviesData = await moviesRes.json()
    const tvData = await tvRes.json()

    const movies = (moviesData.results || []).slice(0, 5).map((m: any) => ({
      id: m.id,
      tmdb_id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      release_date: m.release_date,
      vote_average: m.vote_average,
      media_type: "movie",
    }))

    const tvShows = (tvData.results || []).slice(0, 5).map((t: any) => ({
      id: t.id,
      tmdb_id: t.id,
      title: t.name,
      poster_path: t.poster_path,
      backdrop_path: t.backdrop_path,
      overview: t.overview,
      release_date: t.first_air_date,
      vote_average: t.vote_average,
      media_type: "tv",
    }))

    const combined = [...movies, ...tvShows].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).slice(0, 10)

    return NextResponse.json(
      {
        results: combined,
        count: combined.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching top rated combined:", error)
    return NextResponse.json({ results: [], count: 0, error: "Failed to fetch top rated content" }, { status: 500 })
  }
}
