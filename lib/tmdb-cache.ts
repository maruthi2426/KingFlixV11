// This file is now deprecated. Use the server route instead.

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface CachedMovie {
  data: any
  timestamp: number
}

const movieCache = new Map<string, CachedMovie>()

export async function getCachedTMDBMovie(tmdbId: string, mediaType: string) {
  try {
    const response = await fetch(`/api/tmdb/movie?tmdbId=${tmdbId}&mediaType=${mediaType}`, {
      cache: "force-cache",
      next: { revalidate: 86400 },
    })

    if (!response.ok) throw new Error("Failed to fetch from TMDB")

    const data = await response.json()

    // Cache the result
    movieCache.set(`${mediaType}-${tmdbId}`, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    console.error("[v0] Error fetching TMDB data:", error)
    return null
  }
}

export function clearCache() {
  movieCache.clear()
}
