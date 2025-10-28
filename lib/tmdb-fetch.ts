import { getTMDBApiKey, TMDB_BASE_URL, type Movie } from "./tmdb"

const movieCache = new Map<string, { data: Movie | null; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function getCacheKey(tmdbId: number, mediaType: string): string {
  return `${mediaType}-${tmdbId}`
}

function getCachedMovie(tmdbId: number, mediaType: string): Movie | null | undefined {
  const key = getCacheKey(tmdbId, mediaType)
  const cached = movieCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  movieCache.delete(key)
  return undefined
}

function setCachedMovie(tmdbId: number, mediaType: string, data: Movie | null): void {
  const key = getCacheKey(tmdbId, mediaType)
  movieCache.set(key, { data, timestamp: Date.now() })
}

export async function fetchTMDBMovieDetails(
  tmdbId: number,
  mediaType: "movie" | "tv" = "movie",
): Promise<Movie | null> {
  try {
    const cached = getCachedMovie(tmdbId, mediaType)
    if (cached !== undefined) {
      return cached
    }

    const apiKey = getTMDBApiKey()
    if (!apiKey) {
      console.error("[v0] TMDB API key not configured")
      return null
    }

    const endpoint = `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?api_key=${apiKey}`

    const response = await fetch(endpoint, {
      cache: "force-cache", // Enable caching
      next: { revalidate: 86400 }, // Revalidate every 24 hours
    })
    if (!response.ok) {
      console.error("[v0] TMDB API error:", response.status)
      setCachedMovie(tmdbId, mediaType, null)
      return null
    }

    const data = await response.json()

    const movie: Movie = {
      id: data.id,
      title: data.title || data.name,
      original_title: data.original_title || data.original_name,
      overview: data.overview,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date || data.first_air_date,
      first_air_date: data.first_air_date,
      vote_average: Number(data.vote_average) || 0,
      vote_count: Number(data.vote_count) || 0,
      popularity: Number(data.popularity) || 0,
      genre_ids: data.genre_ids || [],
      genres: data.genres,
      runtime: data.runtime || data.episode_run_time?.[0],
      videos: null,
      credits: null,
      seasons: data.seasons,
      number_of_seasons: data.number_of_seasons,
      spoken_languages: data.spoken_languages,
      original_language: data.original_language,
      status: data.status,
      budget: data.budget,
      revenue: data.revenue,
      similar: null,
      recommendations: null,
      images: null,
      media_type: mediaType,
    }

    setCachedMovie(tmdbId, mediaType, movie)
    return movie
  } catch (error) {
    console.error("[v0] Error fetching TMDB data:", error)
    return null
  }
}

export async function fetchTMDBDataFromUrl(
  tmdbUrl: string,
): Promise<{ tmdbId: number; mediaType: "movie" | "tv"; data: Movie | null } | null> {
  try {
    const match = tmdbUrl.match(/themoviedb\.org\/(movie|tv)\/(\d+)/)
    if (!match) {
      throw new Error("Invalid TMDB URL format. Use: https://www.themoviedb.org/movie/123")
    }

    const [, mediaType, tmdbId] = match
    const data = await fetchTMDBMovieDetails(Number.parseInt(tmdbId), mediaType as "movie" | "tv")

    return {
      tmdbId: Number.parseInt(tmdbId),
      mediaType: mediaType as "movie" | "tv",
      data,
    }
  } catch (error) {
    console.error("[v0] Error fetching TMDB data from URL:", error)
    return null
  }
}
