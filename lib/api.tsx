import type { Movie, TMDbResponse } from "./tmdb"
import { TMDB_BASE_URL, getTMDBApiKey } from "./tmdb"

const isServer = typeof window === "undefined"

// Base fetch function with retry logic
async function fetchWithRetry(url: string, retries = 3, backoff = 300): Promise<Response> {
  try {
    const response = await fetch(url, {
      next: isServer ? { revalidate: 3600 } : undefined,
    })

    if (response.status === 429 && retries > 0) {
      // Rate limited - exponential backoff
      await new Promise((resolve) => setTimeout(resolve, backoff))
      return fetchWithRetry(url, retries - 1, backoff * 2)
    }

    return response
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff))
      return fetchWithRetry(url, retries - 1, backoff * 2)
    }
    throw error
  }
}

export async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  console.log("[v0] Fetching from TMDb:", endpoint)

  if (isServer) {
    // Server-side: call TMDb directly
    const apiKey = getTMDBApiKey()

    if (!apiKey || apiKey.trim() === "") {
      console.error("[v0] TMDB_API_KEY is not configured on the server")
      throw new Error(
        "TMDB_API_KEY environment variable is not set. Please configure it in your Vercel project settings.",
      )
    }

    const searchParams = new URLSearchParams({
      api_key: apiKey,
      ...params,
    })

    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`
    console.log("[v0] Making request to TMDb with endpoint:", endpoint)

    const response = await fetchWithRetry(url)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ status_message: "Unknown error" }))
      console.error("[v0] TMDb API returned error:", response.status, error)
      throw new Error(error.status_message || `TMDb API error: ${response.status}`)
    }

    return response.json()
  } else {
    // Client-side: use our proxy
    const searchParams = new URLSearchParams({
      endpoint,
      ...params,
    })

    const response = await fetchWithRetry(`/api/tmdb?${searchParams.toString()}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || "Failed to fetch from TMDb")
    }

    return response.json()
  }
}

type DiscoverOpts = {
  originalLanguage?: string
  minRating?: number
}

export async function discoverMovies(
  page = 1,
  sortBy = "popularity.desc",
  opts: DiscoverOpts = {},
): Promise<TMDbResponse<Movie>> {
  try {
    return await tmdbFetch<TMDbResponse<Movie>>("/discover/movie", {
      page: page.toString(),
      sort_by: sortBy,
      include_adult: "false",
      vote_count_gte: "100",
    })
  } catch (error) {
    console.error("[v0] Failed to discover movies:", error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

export async function discoverTV(
  page = 1,
  sortBy = "popularity.desc",
  opts: DiscoverOpts = {},
): Promise<TMDbResponse<Movie>> {
  try {
    return await tmdbFetch<TMDbResponse<Movie>>("/discover/tv", {
      page: page.toString(),
      sort_by: sortBy,
      include_adult: "false",
      vote_count_gte: "100",
    })
  } catch (error) {
    console.error("[v0] Failed to discover TV shows:", error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

export async function discoverAnime(page = 1, opts: DiscoverOpts = {}): Promise<TMDbResponse<Movie>> {
  try {
    return await tmdbFetch<TMDbResponse<Movie>>("/discover/tv", {
      page: page.toString(),
      with_keywords: "210024", // Anime keyword ID
      sort_by: "popularity.desc",
      include_adult: "false",
    })
  } catch (error) {
    console.error("[v0] Failed to discover anime:", error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Trending (all media types)
export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "week",
): Promise<TMDbResponse<Movie>> {
  try {
    return await tmdbFetch<TMDbResponse<Movie>>(`/trending/${mediaType}/${timeWindow}`, {
      include_adult: "false",
    })
  } catch (error) {
    console.error("[v0] Failed to get trending:", error)
    return { page: 1, results: [], total_pages: 0, total_results: 0 }
  }
}

// Search multi (movies, TV, people)
export async function searchMulti(query: string, page = 1): Promise<TMDbResponse<Movie>> {
  return tmdbFetch<TMDbResponse<Movie>>("/search/multi", {
    query,
    page: page.toString(),
    include_adult: "false",
  })
}

export async function getMovieDetails(id: number): Promise<Movie | null> {
  console.log("[v0] Getting movie details for ID:", id)
  try {
    const tmdbData = await tmdbFetch<Movie>(`/movie/${id}`, {
      append_to_response: "videos,credits,similar,recommendations,images",
      language: "en-US",
    })
    console.log("[v0] Movie found on TMDb:", id)
    return tmdbData
  } catch (tmdbError) {
    console.error("[v0] Movie not found on TMDb:", id, tmdbError)
    return null
  }
}

export async function getTVDetails(id: number): Promise<Movie | null> {
  console.log("[v0] Getting TV details for ID:", id)
  try {
    const tmdbData = await tmdbFetch<Movie>(`/tv/${id}`, {
      append_to_response: "videos,credits,similar,recommendations,images",
      language: "en-US",
    })
    console.log("[v0] TV show found on TMDb:", id)
    return tmdbData
  } catch (tmdbError) {
    console.error("[v0] TV show not found on TMDb:", id, tmdbError)
    return null
  }
}

// Get genres
export async function getGenres(
  type: "movie" | "tv" = "movie",
): Promise<{ genres: Array<{ id: number; name: string }> }> {
  return tmdbFetch<{ genres: Array<{ id: number; name: string }> }>(`/genre/${type}/list`, {})
}

// Discover by genre
export async function discoverByGenre(
  genreId: number,
  type: "movie" | "tv" = "movie",
  page = 1,
): Promise<TMDbResponse<Movie>> {
  return tmdbFetch<TMDbResponse<Movie>>(`/discover/${type}`, {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
    include_adult: "false",
  })
}
