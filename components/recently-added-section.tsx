"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface MediaItem {
  id: number
  tmdb_id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number | string
  media_type?: string
}

export function RecentlyAddedSection() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    async function fetchRecentlyAdded() {
      try {
        const res = await fetch("/api/recently-added?limit=20")
        const data = await res.json()
        setItems(data.results || [])
      } catch (error) {
        console.error("[v0] Error fetching recently added:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyAdded()
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

  if (items.length === 0) {
    return null
  }

  return (
    <section className="py-2">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold font-serif">Recently Added</h2>

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
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const rating = Number(item.vote_average).toFixed(1)
          const year = item.release_date?.split("-")[0] || "N/A"

          return (
            <Link key={item.id} href={`/${item.media_type || "movie"}/${item.tmdb_id}`}>
              <div className="flex-shrink-0 w-40 sm:w-48 md:w-52 group cursor-pointer">
                <div className="relative h-60 sm:h-72 md:h-80 rounded-lg overflow-hidden">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 mb-2">{item.title}</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-xs">{rating}</span>
                      </div>
                      <span className="text-gray-300 text-xs">{year}</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-white/5" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
