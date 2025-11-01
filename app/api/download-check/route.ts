import { type NextRequest, NextResponse } from "next/server"

const DOWNLOAD_SERVER_URL = process.env.DOWNLOAD_SERVER_URL || "https://telegrambot-ihtv.onrender.com" 
const DOWNLOAD_ENDPOINT = process.env.DOWNLOAD_ENDPOINT || "/allvideos" // Changed from /api/videos to /allvideos

interface DownloadItem {
  id: number
  file_id: string
  file_name: string
  duration: number
  file_size: number
  thumbnail: string
  link: string | null
  message_id: number
  chat_id: string
  telegram_link: string
  mime_type: string
  width: number
  height: number
}

function normalizeFileName(fileName: string): string {
  // Remove file extension and normalize
  return fileName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .toLowerCase()
    .replace(/[._\-;]/g, " ") // Replace separators with spaces
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()
}

function normalizeMovieTitle(title: string, year?: number): string {
  let normalized = title
    .toLowerCase()
    .replace(/[._\-;]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (year) {
    normalized = normalized.replace(String(year), "").trim()
  }

  return normalized
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(" "))
  const words2 = new Set(str2.split(" "))
  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])
  return union.size > 0 ? intersection.size / union.size : 0
}

function findMatchingDownload(
  movieTitle: string,
  year: number | undefined,
  downloads: DownloadItem[],
): DownloadItem | null {
  const normalizedTitle = normalizeMovieTitle(movieTitle, year)

  let bestMatch: DownloadItem | null = null
  let bestScore = 0

  for (const download of downloads) {
    const normalizedFileName = normalizeFileName(download.file_name)

    if (normalizedFileName === normalizedTitle) {
      return download
    }

    if (normalizedFileName.includes(normalizedTitle) || normalizedTitle.includes(normalizedFileName)) {
      return download
    }

    const titleWords = normalizedTitle.split(" ").filter((w) => w.length > 2) // Only consider words > 2 chars
    const fileNameWords = normalizedFileName.split(" ").filter((w) => w.length > 2)

    if (titleWords.length === 0) continue

    const matchedWords = titleWords.filter((word) => fileNameWords.includes(word))
    const wordMatchScore = matchedWords.length / titleWords.length

    if (wordMatchScore >= 0.7 && wordMatchScore > bestScore) {
      bestScore = wordMatchScore
      bestMatch = download
    }
  }

  return bestMatch
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const movieTitle = searchParams.get("title")
    const year = searchParams.get("year") ? Number.parseInt(searchParams.get("year")!) : undefined

    if (!movieTitle) {
      return NextResponse.json({ error: "Missing title parameter" }, { status: 400 })
    }

    console.log("[v0] Download check - Title:", movieTitle, "Year:", year)
    console.log("[v0] Fetching from:", `${DOWNLOAD_SERVER_URL}${DOWNLOAD_ENDPOINT}`)

    const response = await fetch(`${DOWNLOAD_SERVER_URL}${DOWNLOAD_ENDPOINT}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      console.error("[v0] Download server error:", response.status)
      return NextResponse.json({ available: false, error: "Download server unavailable" })
    }

    const data = await response.json()
    console.log(data)
    const downloads: DownloadItem[] = data.data || []

    console.log("[v0] Found", downloads.length, "downloads on server")

    // Find matching download
    const match = findMatchingDownload(movieTitle, year, downloads)

    if (match) {
      console.log("[v0] Found matching download:", match.file_name)
      return NextResponse.json({
        available: true,
        download: {
          fileName: match.file_name,
          telegramLink: match.telegram_link,
          fileSize: match.file_size,
          duration: match.duration,
        },
      })
    }

    console.log("[v0] No matching download found for:", movieTitle)
    return NextResponse.json({ available: false })
  } catch (error) {
    console.error("[v0] Download check error:", error)
    return NextResponse.json({ available: false, error: "Failed to check downloads" }, { status: 500 })
  }
}
