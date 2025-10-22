"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { type Movie, getTitle, getYear, getImageUrl } from "@/lib/tmdb"
import { getMovieDetails, getTVDetails } from "@/lib/api" // fetch details for trailer

interface HeroCarouselProps {
  items: Movie[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false) // trailer modal state
  const [trailer, setTrailer] = useState<{ key: string; name: string } | null>(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  // Auto-play (optional)
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  if (!items.length) return null

  const currentItem = items[currentIndex]
  const tmdbId = (currentItem as any).tmdb_id || currentItem.id

  async function handleWatchTrailer() {
    // on-demand fetch of trailer
    try {
      const type = currentItem.media_type === "tv" ? "tv" : "movie"
      const details = type === "tv" ? await getTVDetails(tmdbId) : await getMovieDetails(tmdbId)
      const t = details?.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")
      if (t) {
        setTrailer({ key: t.key, name: t.name })
        setShowTrailer(true)
      } else {
        // fallback: go to details if trailer not available
        window.location.href = `/${type}/${tmdbId}`
      }
    } catch (e) {
      // fallback: redirect to details page on error
      const type = currentItem.media_type === "tv" ? "tv" : "movie"
      window.location.href = `/${type}/${tmdbId}`
    }
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden rounded-3xl">
      {/* Background Image with Blur */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(currentItem.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={getTitle(currentItem)}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-16 md:pb-20">
        <div className="max-w-2xl space-y-4 md:space-y-6">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-balance leading-tight">
            {getTitle(currentItem)}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              {currentItem.media_type === "tv" ? "TV Series" : "Movie"}
            </span>
            <span className="text-sm text-muted-foreground">{getYear(currentItem)}</span>
            {currentItem.vote_average && Number(currentItem.vote_average) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{Number(currentItem.vote_average).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Overview */}
          <p className="text-sm md:text-base text-muted-foreground line-clamp-3 text-pretty leading-relaxed">
            {currentItem.overview}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/${currentItem.media_type === "tv" ? "tv" : "movie"}/${tmdbId}`}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:bg-accent/90 transition-colors text-sm"
            >
              <Play className="w-5 h-5 fill-current" />
              View Details
            </Link>
            <button
              onClick={handleWatchTrailer}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-sm border border-white/30 hover:border-accent hover:text-accent"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={goToPrev}
          className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-accent" : "w-4 bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              aria-label="Close trailer"
            >
              {/* reuse Info/Play icons already imported? We can use a simple X via SVG */}
              <span className="sr-only">Close</span>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
