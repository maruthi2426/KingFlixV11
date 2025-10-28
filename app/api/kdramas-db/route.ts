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
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&region=KR&page=${page}&sort_by=popularity.desc`,
      { cache: "force-cache" },
    )

    const data = await response.json()

    const results = (data.results || []).slice(0, limit).map((item: any) => ({
      id: item.id,
      tmdb_id: item.id,
      title: item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: item.overview,
      release_date: item.first_air_date,
      vote_average: item.vote_average,
      media_type: "tv",
    }))

    return NextResponse.json(
      {
        results,
        count: results.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching k-dramas:", error)
    return NextResponse.json({ results: [], count: 0, error: "Failed to fetch k-dramas" }, { status: 500 })
  }
}
