"use client"

import { useEffect, useState } from "react"
import { MediaCarousel } from "./media-carousel"
import type { Movie } from "@/lib/tmdb"

interface GenreMoviesSectionProps {
  genreId: string
  genreName: string
}

export function GenreMoviesSection({ genreId, genreName }: GenreMoviesSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`/api/genre-movies?genre_id=${genreId}&page=1`)
        const data = await response.json()
        setMovies(data.results || [])
      } catch (error) {
        console.error(`[v0] Error fetching ${genreName} movies:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [genreId, genreName])

  if (loading || !movies.length) return null

  return <MediaCarousel title={genreName} items={movies} mediaType="movie" enableShuffle={false} />
}
