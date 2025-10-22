import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") || "6")

    console.log("[v0] Related API - using TMDB API only")

    // Database removed - return empty to trigger TMDB API fallback
    return NextResponse.json({ results: [] })
  } catch (err) {
    console.error("[v0] Related API error:", err)
    return NextResponse.json({ results: [] }, { status: 200 })
  }
}
