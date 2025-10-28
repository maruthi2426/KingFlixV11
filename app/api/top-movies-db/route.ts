import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Database removed - return empty to use TMDB API
    return NextResponse.json({
      results: [],
      count: 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching top movies:", error)
    return NextResponse.json({ results: [], count: 0 }, { status: 200 })
  }
}
