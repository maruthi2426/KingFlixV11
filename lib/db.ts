// This file is now a stub to prevent import errors during transition

export interface ContentItem {
  id: number
  tmdb_id: number
  media_type: "movie" | "tv" | "anime"
  title: string
  release_date?: string
  vote_average?: number
  status: string
  created_at: string
  updated_at: string
}

// All database functions now return empty arrays - TMDB API is used instead
export async function getAllContent(mediaType?: string, limit = 20, offset = 0) {
  return []
}

export async function getContentByTmdbId(tmdbId: number) {
  return null
}

export async function addContent(data: Partial<ContentItem>) {
  return null
}

export async function deleteContent(tmdbId: number) {
  return false
}

export async function logBotAction(action: string, data: any) {
  // No-op
}

export async function searchContent(query: string, limit = 20) {
  return []
}

export async function getContentByGenre(genreId: number, mediaType?: string, limit = 20, offset = 0) {
  return []
}

export async function getKoreanContent(limit = 20, offset = 0) {
  return []
}

export async function getRecentlyAdded(limit = 20, offset = 0) {
  return []
}

export async function getAnimationContent(limit = 20, offset = 0) {
  return []
}
