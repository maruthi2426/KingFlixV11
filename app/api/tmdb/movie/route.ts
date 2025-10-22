import { type NextRequest, NextResponse } from "next/server"
import { getTMDBApiKey, TMDB_BASE_URL } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get("tmdbId")
    const mediaType = searchParams.get("mediaType") || "movie"

    if (!tmdbId) {
      return NextResponse.json({ error: "Missing tmdbId parameter" }, { status: 400 })
    }

    const apiKey = getTMDBApiKey()
    if (!apiKey) {
      return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 })
    }

    const endpoint = `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?api_key=${apiKey}&append_to_response=credits,images,videos`

    const response = await fetch(endpoint, {
      cache: "force-cache",
      next: { revalidate: 86400 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400, immutable",
      },
    })
  } catch (error) {
    console.error("[v0] TMDB API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
