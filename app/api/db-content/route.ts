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
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        },
        { status: 500 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")
    const type = searchParams.get("type") || "movie"
    const page = Number.parseInt(searchParams.get("page") || "1")

    if (q && q.trim().length) {
      console.log("[v0] Searching TMDB for:", q)
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=${page}`,
        { cache: "force-cache" },
      )
      const data = await response.json()
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
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
          },
        },
      )
    }

    console.log("[v0] Fetching popular", type, "from TMDB page", page)
    const response = await fetch(`https://api.themoviedb.org/3/${type}/popular?api_key=${TMDB_API_KEY}&page=${page}`, {
      cache: "force-cache",
    })
    const data = await response.json()

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
    console.error("[v0] TMDB API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      },
      { status: 500 },
    )
  }
}
