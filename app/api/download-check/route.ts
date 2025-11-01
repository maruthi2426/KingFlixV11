import { type NextRequest, NextResponse } from "next/server"

<<<<<<< HEAD
const DOWNLOAD_SERVER_URL = process.env.DOWNLOAD_SERVER_URL || "https://telegrambot-ihtv.onrender.com" 
const DOWNLOAD_ENDPOINT = process.env.DOWNLOAD_ENDPOINT || "/allvideos" // Changed from /api/videos to /allvideos
=======
const DOWNLOAD_SERVER_URL = process.env.DOWNLOAD_SERVER_URL || "https://telegrambot-1-yp3e.onrender.com"
const DOWNLOAD_ENDPOINT = process.env.DOWNLOAD_ENDPOINT || "/allvideos"
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

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
<<<<<<< HEAD
  // Remove file extension and normalize
  return fileName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .toLowerCase()
    .replace(/[._\-;]/g, " ") // Replace separators with spaces
    .replace(/\s+/g, " ") // Normalize spaces
=======
  return fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[._\-;]/g, " ")
    .replace(/\s+/g, " ")
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
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

<<<<<<< HEAD
function findMatchingDownload(
  movieTitle: string,
  year: number | undefined,
  downloads: DownloadItem[],
): DownloadItem | null {
  const normalizedTitle = normalizeMovieTitle(movieTitle, year)

  let bestMatch: DownloadItem | null = null
  let bestScore = 0
=======
function extractQuality(fileName: string): string {
  const qualityMatch = fileName.match(/(\d{3,4}p|4K|2K|SD|HD)/i)
  if (qualityMatch) {
    return qualityMatch[1].toUpperCase()
  }
  return "Unknown"
}

function extractCodec(fileName: string): string {
  const codecMatch = fileName.match(/(HEVC|x265|x264|H\.264|H\.265|AV1|VP9)/i)
  if (codecMatch) {
    return codecMatch[1].toUpperCase()
  }
  return ""
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const gb = bytes / (1024 * 1024 * 1024)
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`
  }
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) {
    return `${mb.toFixed(0)} MB`
  }
  return `${(bytes / 1024).toFixed(0)} KB`
}

function findMatchingDownloads(
  movieTitle: string,
  year: number | undefined,
  downloads: DownloadItem[],
): DownloadItem[] {
  const normalizedTitle = normalizeMovieTitle(movieTitle, year)
  const matches: DownloadItem[] = []
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

  for (const download of downloads) {
    const normalizedFileName = normalizeFileName(download.file_name)

    if (normalizedFileName === normalizedTitle) {
<<<<<<< HEAD
      return download
    }

    if (normalizedFileName.includes(normalizedTitle) || normalizedTitle.includes(normalizedFileName)) {
      return download
    }

    const titleWords = normalizedTitle.split(" ").filter((w) => w.length > 2) // Only consider words > 2 chars
=======
      matches.unshift(download) // Exact match first
      continue
    }

    if (normalizedFileName.includes(normalizedTitle) || normalizedTitle.includes(normalizedFileName)) {
      matches.push(download)
      continue
    }

    const titleWords = normalizedTitle.split(" ").filter((w) => w.length > 2)
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
    const fileNameWords = normalizedFileName.split(" ").filter((w) => w.length > 2)

    if (titleWords.length === 0) continue

    const matchedWords = titleWords.filter((word) => fileNameWords.includes(word))
    const wordMatchScore = matchedWords.length / titleWords.length

<<<<<<< HEAD
    if (wordMatchScore >= 0.7 && wordMatchScore > bestScore) {
      bestScore = wordMatchScore
      bestMatch = download
    }
  }

  return bestMatch
=======
    if (wordMatchScore >= 0.7) {
      matches.push(download)
    }
  }

  return matches
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
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
<<<<<<< HEAD
    console.log(data)
=======
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
    const downloads: DownloadItem[] = data.data || []

    console.log("[v0] Found", downloads.length, "downloads on server")

<<<<<<< HEAD
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
=======
    const matches = findMatchingDownloads(movieTitle, year, downloads)

    if (matches.length > 0) {
      console.log("[v0] Found", matches.length, "matching downloads for:", movieTitle)

      const downloadOptions = matches.map((match) => ({
        fileName: match.file_name,
        telegramLink: match.telegram_link,
        fileSize: match.file_size,
        formattedSize: formatFileSize(match.file_size),
        quality: extractQuality(match.file_name),
        codec: extractCodec(match.file_name),
        duration: match.duration,
      }))

      return NextResponse.json({
        available: true,
        downloads: downloadOptions,
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
      })
    }

    console.log("[v0] No matching download found for:", movieTitle)
    return NextResponse.json({ available: false })
  } catch (error) {
    console.error("[v0] Download check error:", error)
    return NextResponse.json({ available: false, error: "Failed to check downloads" }, { status: 500 })
  }
}
