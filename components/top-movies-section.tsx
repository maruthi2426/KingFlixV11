// Keeping for backward compatibility but not used in main page
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface TopMovie {
  id: number
  tmdb_id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
  top_movie_rank?: number
}

export function TopMoviesSection() {
  const [movies, setMovies] = useState<TopMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopMovies() {
      try {
        const res = await fetch("/api/top-movies-db")
        const data = await res.json()
        setMovies(data.results || [])
      } catch (error) {
        console.error("[v0] Error fetching top movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopMovies()
  }, [])

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="space-y-4">
          <div className="h-10 w-48 skeleton rounded-lg" />
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-64 h-40 skeleton rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
          <span className="text-accent">TOP 10</span>
          <br />
          <span className="text-white">MOVIES TODAY</span>
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {movies.map((movie, index) => {
          const rank = index + 1
          return (
            <Link key={movie.id} href={`/movie/${movie.tmdb_id}`}>
              <div className="flex-shrink-0 w-64 snap-start group cursor-pointer">
                <div className="relative">
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-6xl font-bold text-accent opacity-30 group-hover:opacity-50 transition-opacity z-0 font-serif">
                    {rank}
                  </div>

                  <div className="relative z-10 rounded-2xl overflow-hidden glass-card hover:scale-105 transition-transform duration-300 h-40 flex">
                    <div className="relative w-24 flex-shrink-0 overflow-hidden">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{movie.overview}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-accent font-semibold">⭐ {Number(movie.vote_average).toFixed(1)}</span>
                        <span className="text-muted-foreground">{movie.release_date?.split("-")[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
