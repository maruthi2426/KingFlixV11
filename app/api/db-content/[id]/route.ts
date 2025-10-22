import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Database removed - TMDB API will be used as fallback
  return NextResponse.json({ error: "Content not found" }, { status: 404 })
}
