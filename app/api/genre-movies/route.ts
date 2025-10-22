import { type NextRequest, NextResponse } from "next/server"
import { getTMDBApiKey } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const TMDB_API_KEY = getTMDBApiKey()
    if (!TMDB_API_KEY) {
      return NextResponse.json({ error: "TMDB API key is not configured", results: [] }, { status: 500 })
    }

    const searchParams = request.nextUrl.searchParams
    const genreId = searchParams.get("genre_id") || "28"
    const type = searchParams.get("type") || "movie"
    const page = Number.parseInt(searchParams.get("page") || "1")

    console.log("[v0] Genre API - genreId:", genreId, "type:", type, "page:", page)

    const endpoint = type === "tv" ? "discover/tv" : "discover/movie"
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`

    console.log("[v0] Fetching from:", url.replace(TMDB_API_KEY, "***"))

    const response = await fetch(url, { cache: "force-cache" })
    const data = await response.json()

    console.log("[v0] API Response - status:", response.status, "results count:", data.results?.length || 0)

    return NextResponse.json(
      {
        page: data.page || 1,
        results: (data.results || []).map((item: any) => ({
          id: item.id,
          tmdb_id: item.id,
          title: item.title || item.name,
          overview: item.overview,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          media_type: type,
        })),
        total_pages: data.total_pages || 1,
        total_results: data.total_results || 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Genre movies API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch genre movies", results: [], total_pages: 1, total_results: 0 },
      { status: 500 },
    )
  }
}
