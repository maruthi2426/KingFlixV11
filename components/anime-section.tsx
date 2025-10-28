"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Play, Shuffle } from "lucide-react"

interface AnimeItem {
  id: number
  tmdb_id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: number | string
  media_type?: string
}

export function AnimeSection() {
  const [items, setItems] = useState<AnimeItem[]>([])
  const [displayItems, setDisplayItems] = useState<AnimeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch("/api/animation")
        const data = await res.json()
        const animeItems = (data.results || []).slice(0, 9)
        setItems(animeItems)
        const shuffled = [...animeItems].sort(() => Math.random() - 0.5)
        setDisplayItems(shuffled)
      } catch (error) {
        console.error("[v0] Error fetching animation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnime()
  }, [])

  const handleShuffle = () => {
    const shuffled = [...displayItems].sort(() => Math.random() - 0.5)
    setDisplayItems(shuffled)
  }

  if (loading) {
    return null
  }

  if (displayItems.length === 0) {
    return null
  }

  return (
    <section className="py-2">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Anime</h2>
        <button
          onClick={handleShuffle}
          className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
          aria-label="Shuffle anime"
          title="Shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {displayItems.map((item) => {
          const rating = Number(item.vote_average).toFixed(1)
          const year = item.release_date?.split("-")[0] || "N/A"
          const mediaType = item.media_type || "movie"

          return (
            <Link key={item.id} href={`/${mediaType}/${item.tmdb_id}`}>
              <div className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1 mb-1">{item.title}</h3>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 text-xs">{year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-xs">{rating}</span>
                      </div>
                    </div>

                    {item.overview && <p className="text-gray-400 text-xs line-clamp-2">{item.overview}</p>}
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                      <Play className="w-4 h-4 text-white fill-white" />
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
