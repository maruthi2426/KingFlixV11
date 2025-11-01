"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Play } from "lucide-react"
import { getImageUrl, getTitle, getYear, type Movie } from "@/lib/tmdb"

interface VideoItem {
   id: 2,
    tmdbId: number,
    chat_id: string,
    title: string,
    overview: string,
    posterPath: string,
    backdropPath: null,
    releaseDate: null,
    createdAt: string,
    updatedAt: string
}

interface FetchedMediaCardProps {
  item: VideoItem
}

export default function FetchedMediaCard({ item }: FetchedMediaCardProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
console.log("Fetching TMDB for:", item.tmdbId, "with key:", process.env.NEXT_PUBLIC_TMDB_API_KEY)

  useEffect(() => {
    const fetchTMDBData = async () => {
      try {
        console.log(item)
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${item.tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
        if (!res.ok) throw new Error("TMDB fetch failed")
        const data = await res.json()
      console.log(data)
        setMovie(data)
      } catch (err) {
        console.error("Error fetching TMDB data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (item.tmdbId) fetchTMDBData()
  }, [item.tmdbId])

  if (loading) {
    return (
      <div className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse" />
    )
  }

  if (!movie) return null

  const href = `/movie/${item.tmdbId}`

  return (
    <div className="group relative">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-border transition-all duration-300 hover-lift">
          {/* Poster Image */}
          <Image
            src={getImageUrl(movie.poster_path, "w342")}
            alt={getTitle(movie)}
            fill
            className="object-cover"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Rating */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
              {getTitle(movie)}
            </h3>
            <p className="text-xs text-gray-300">{getYear(movie)}</p>
          </div>
        </div>
      </Link>

      
    
    </div>
  )
}
