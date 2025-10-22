"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react"

interface KDrama {
  id: number
  tmdb_id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  vote_average: string | number
  media_type?: string
  original_language?: string
}

export function KdramaSection() {
  const [dramas, setDramas] = useState<KDrama[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    async function fetchKdramas() {
      try {
        const res = await fetch("/api/kdramas-db")
        const data = await res.json()
        const koreanContent = (data.results || []).filter(
          (item: KDrama) => item.original_language === "ko" || item.media_type === "tv",
        )
        setDramas(koreanContent)
      } catch (error) {
        console.error("[v0] Error fetching K-dramas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKdramas()
  }, [])

  const checkScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = scrollRef.current.clientWidth * 0.8
    const newScrollLeft =
      direction === "left" ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  if (loading) {
    return null
  }

  if (dramas.length === 0) {
    return null
  }

  return (
    <section className="py-4 md:py-6">
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-1">K-Drama Collection</h2>
          <p className="text-sm text-muted-foreground">Korean Movies & TV Shows</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 glass rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="space-y-4 overflow-y-auto max-h-[600px] scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dramas.map((drama) => {
          const rating = Number(drama.vote_average).toFixed(1)
          const year = drama.release_date?.split("-")[0] || "N/A"

          return (
            <Link key={drama.id} href={`/${drama.media_type || "tv"}/${drama.tmdb_id}`}>
              <div className="group cursor-pointer glass-card rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300 flex h-40">
                <div className="relative w-28 flex-shrink-0">
                  {drama.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${drama.poster_path}`}
                      alt={drama.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div className="flex-1 min-h-0">
                    <h3 className="text-white font-bold text-lg md:text-xl line-clamp-1 mb-2">{drama.title}</h3>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 text-sm">{year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm">{rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs md:text-sm line-clamp-2">
                      {drama.overview || "No description available."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center px-4">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play className="w-5 h-5 fill-white text-white" />
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
