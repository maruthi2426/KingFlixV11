"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface TopItem {
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

export function Top10CombinedSection() {
  const [items, setItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    async function fetchTopItems() {
      try {
        const res = await fetch("/api/top-rated-combined")
        const data = await res.json()
        setItems(data.results || [])
      } catch (error) {
        console.error("[v0] Error fetching top items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopItems()
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
        <h2 className="text-3xl md:text-4xl font-bold font-serif leading-none">
          <span
            className="text-pink-500"
            style={{
              WebkitTextStroke: "2px #ec4899",
              color: "transparent",
              textShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
            }}
          >
            TOP 10
          </span>
        </h2>

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
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => {
          const rank = index + 1
          const rating = Number(item.vote_average).toFixed(1)
          const year = item.release_date?.split("-")[0] || "N/A"

          return (
            <div key={item.id} className="flex-shrink-0 flex items-end gap-3">
              <div
                className="text-5xl md:text-6xl font-bold font-serif leading-none pb-2"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px #ec4899",
                  textShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
                }}
              >
                {rank}
              </div>

              <Link href={`/${item.media_type || "movie"}/${item.tmdb_id}`}>
                <div className="w-40 sm:w-48 md:w-52 group cursor-pointer">
                  <div className="relative h-60 sm:h-72 md:h-80 rounded-lg overflow-hidden">
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No Image</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2">{item.title}</h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-xs">{rating}</span>
                        </div>
                        <span className="text-gray-300 text-xs">{year}</span>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: "inset 0 0 30px rgba(236, 72, 153, 0.3), 0 0 30px rgba(236, 72, 153, 0.2)",
                      }}
                    />
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
