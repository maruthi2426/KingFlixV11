"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react"
import type { Movie } from "@/lib/tmdb"
import { MediaCard } from "./media-card"

interface MediaCarouselProps {
  title: string
  items: Movie[]
  mediaType?: "movie" | "tv" | "anime"
  enableShuffle?: boolean
}

export function MediaCarousel({ title, items, mediaType, enableShuffle = true }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [displayItems, setDisplayItems] = useState<Movie[]>(items)

  useEffect(() => {
    if (enableShuffle && items.length > 0) {
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      setDisplayItems(shuffled)
    } else {
      setDisplayItems(items)
    }
  }, [items, enableShuffle])

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

  const handleShuffle = () => {
    const shuffled = [...displayItems].sort(() => Math.random() - 0.5)
    setDisplayItems(shuffled)
  }

  if (!displayItems.length) return null

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-serif font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {enableShuffle && (
            <button
              onClick={handleShuffle}
              className="p-2 glass rounded-full hover:bg-white/20 transition-colors"
              aria-label="Shuffle items"
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>
          )}
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

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayItems.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-40 sm:w-48 md:w-52">
            <MediaCard item={item} mediaType={mediaType} />
          </div>
        ))}
      </div>
    </div>
  )
}
