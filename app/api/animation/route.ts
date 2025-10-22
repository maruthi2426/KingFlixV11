import { type NextRequest, NextResponse } from "next/server"
import { getTMDBApiKey } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const TMDB_API_KEY = getTMDBApiKey()
    if (!TMDB_API_KEY) {
      console.error("[v0] TMDB_API_KEY is not configured")
      return NextResponse.json(
        {
          error: "TMDB API key is not configured",
          results: [],
          total_pages: 0,
          total_results: 0,
        },
        { status: 500 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")

    console.log("[v0] Fetching animation content from TMDB page", page)
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&page=${page}&sort_by=popularity.desc`,
      { cache: "force-cache" },
    )

    const data = await response.json()

    const results = (data.results || []).map((item: any) => ({
      id: item.id,
      tmdb_id: item.id,
      title: item.title,
      name: item.title,
      original_title: item.original_title,
      overview: item.overview,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date,
      first_air_date: item.release_date,
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      popularity: item.popularity,
      media_type: "movie",
    }))

    console.log("[v0] Animation API returned", results.length, "items")

    return NextResponse.json(
      {
        page: data.page || 1,
        results,
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
    console.error("[v0] Error fetching animation:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch animation content",
        results: [],
        total_pages: 0,
        total_results: 0,
      },
      { status: 500 },
    )
  }
}
