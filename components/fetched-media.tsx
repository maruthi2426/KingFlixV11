"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
<<<<<<< HEAD
import { Star, Play } from "lucide-react"
=======
import { Star } from "lucide-react"
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
import { getImageUrl, getTitle, getYear, type Movie } from "@/lib/tmdb"

interface VideoItem {
  id: number
  tmdb_id: number
  file_name: string
  telegram_link: string
}

interface FetchedMediaCardProps {
  item: VideoItem
}

export default function FetchedMediaCard({ item }: FetchedMediaCardProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
console.log("Fetching TMDB for:", item.tmdb_id, "with key:", process.env.NEXT_PUBLIC_TMDB_API_KEY)
=======
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

  useEffect(() => {
    const fetchTMDBData = async () => {
      try {
<<<<<<< HEAD
        console.log(item)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${item.tmdb_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
=======
        const res = await fetch(`/api/tmdb/movie?tmdbId=${item.tmdb_id}&mediaType=movie`)
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
        if (!res.ok) throw new Error("TMDB fetch failed")
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error("Error fetching TMDB data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (item.tmdb_id) fetchTMDBData()
  }, [item.tmdb_id])

  if (loading) {
<<<<<<< HEAD
    return (
      <div className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse" />
    )
=======
    return <div className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse" />
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
  }

  if (!movie) return null

  const href = `/movie/${item.tmdb_id}`

  return (
    <div className="group relative">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-border transition-all duration-300 hover-lift">
          {/* Poster Image */}
          <Image
<<<<<<< HEAD
            src={getImageUrl(movie.poster_path, "w342")}
=======
            src={getImageUrl(movie.poster_path, "w342") || "/placeholder.svg"}
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
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
<<<<<<< HEAD
              <span className="text-xs font-medium text-white">
                {movie.vote_average.toFixed(1)}
              </span>
=======
              <span className="text-xs font-medium text-white">{movie.vote_average.toFixed(1)}</span>
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
<<<<<<< HEAD
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
              {getTitle(movie)}
            </h3>
=======
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{getTitle(movie)}</h3>
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
            <p className="text-xs text-gray-300">{getYear(movie)}</p>
          </div>
        </div>
      </Link>
<<<<<<< HEAD

      
    
=======
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
    </div>
  )
}
