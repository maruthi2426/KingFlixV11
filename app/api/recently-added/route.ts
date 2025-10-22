import { type NextRequest, NextResponse } from "next/server"
import { getTMDBApiKey } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const TMDB_API_KEY = getTMDBApiKey()
    if (!TMDB_API_KEY) {
      console.error("[v0] TMDB_API_KEY is not configured")
      return NextResponse.json({ results: [], count: 0, error: "TMDB API key is not configured" }, { status: 500 })
    }

    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "20")
    const page = Number.parseInt(request.nextUrl.searchParams.get("page") || "1")

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`,
      { cache: "force-cache" },
    )

    const data = await response.json()

    const results = (data.results || []).slice(0, limit).map((item: any) => ({
      id: item.id,
      tmdb_id: item.id,
      title: item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: item.overview,
      release_date: item.release_date,
      vote_average: item.vote_average,
      media_type: "movie",
    }))

    return NextResponse.json(
      {
        results,
        count: results.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching recently added:", error)
    return NextResponse.json({ results: [], count: 0, error: "Failed to fetch recently added" }, { status: 500 })
  }
}
