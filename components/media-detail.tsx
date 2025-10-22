"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Heart, Bookmark, Download, Star, Calendar, X } from "lucide-react"
import useSWR from "swr"
import type { Movie, MediaType } from "@/lib/tmdb"
import { getTitle, getYear, getImageUrl } from "@/lib/tmdb"
import { useWatchlist } from "@/hooks/use-watchlist"
import { EpisodesPanel } from "./episodes-panel"
import { MediaCard } from "./media-card"
import { DownloadButton } from "./download-button"

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })

interface MediaDetailProps {
  item: Movie
  mediaType: MediaType
}

export function MediaDetail({ item, mediaType }: MediaDetailProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [activeTab, setActiveTab] = useState<"description" | "cast">("description")
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [inWatchlist, setInWatchlist] = useState(false)

  const tmdbId = (item as any).tmdb_id || item.id

  useEffect(() => {
    setInWatchlist(isInWatchlist(tmdbId, mediaType))
  }, [tmdbId, mediaType, isInWatchlist])

  const trailer = item.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube")
  const cast = item.credits?.cast.slice(0, 10) || []
  const director = item.credits?.crew.find((c) => c.job === "Director")

  const genreIds = (item.genres || []).map((g) => g.id).filter(Boolean)
  const { data: relatedData, error: relatedError } = useSWR(
    genreIds.length > 0
      ? `/api/related?tmdbId=${tmdbId}&mediaType=${mediaType}&genreIds=${genreIds.join(",")}&limit=18`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  )

  useEffect(() => {
    if (relatedError) {
      console.error("[v0] Error fetching related content:", relatedError.message)
    }
    if (relatedData) {
      console.log("[v0] Related content loaded:", relatedData.results?.length || 0, "items")
    }
  }, [relatedData, relatedError])

  const relatedFromTmdb = [...(item.similar?.results || []), ...(item.recommendations?.results || [])].slice(0, 18)

  const relatedItems = relatedData?.results?.length ? relatedData.results : relatedFromTmdb
  const hasRelatedItems = relatedItems && relatedItems.length > 0

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(tmdbId, mediaType)
      setInWatchlist(false)
    } else {
      addToWatchlist(item, mediaType)
      setInWatchlist(true)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative bg-gradient-to-b from-background/80 to-background">
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={getImageUrl(item.backdrop_path, "w1280") || "/placeholder.svg"}
            alt={getTitle(item)}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          {/* Poster at Top */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl glass">
              <Image
                src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
                alt={getTitle(item)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 224px, 256px"
                priority
              />
            </div>
          </div>

          {/* Details Below Poster */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Title and Meta */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight">
                {getTitle(item)}
              </h1>

              <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-medium">
                  {mediaType === "tv" ? "TV Series" : mediaType === "anime" ? "Anime" : "Movie"}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{getYear(item)}</span>
                </div>
                {item.vote_average && Number(item.vote_average) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{Number(item.vote_average).toFixed(1)}/10</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {item.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genres/${genre.id}`}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-accent/30 text-xs font-medium transition-colors border border-white/20"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:bg-accent/90 transition-colors text-sm"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Play Trailer
                </button>
              )}
              <DownloadButton item={item} />
              <button
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-sm border ${
                  inWatchlist
                    ? "bg-accent/20 border-accent text-accent"
                    : "border-white/30 hover:border-accent hover:text-accent"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${inWatchlist ? "fill-current" : ""}`} />
                {inWatchlist ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-sm border border-white/30 hover:border-accent hover:text-accent">
                <Heart className="w-5 h-5" />
                Like
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "description"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab("cast")}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === "cast"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Cast
          </button>
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Overview</h2>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{item.overview}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {director && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Director</p>
                  <p className="font-semibold text-sm">{director.name}</p>
                </div>
              )}
              {cast.length > 0 && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Cast</p>
                  <p className="font-semibold text-sm line-clamp-2">
                    {cast
                      .slice(0, 3)
                      .map((c) => c.name)
                      .join(", ")}
                    {cast.length > 3 ? "..." : ""}
                  </p>
                </div>
              )}
              {item.vote_average && Number(item.vote_average) > 0 && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Rating</p>
                  <p className="font-semibold text-sm">{Number(item.vote_average).toFixed(1)} / 10</p>
                </div>
              )}
              {item.spoken_languages && item.spoken_languages.length > 0 && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Languages</p>
                  <p className="font-semibold text-sm line-clamp-2">
                    {item.spoken_languages
                      .map((l) => l.english_name || l.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              {item.status && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-semibold text-sm">{item.status}</p>
                </div>
              )}
              {typeof (item as any).budget === "number" && (item as any).budget > 0 && (
                <div className="glass rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Budget</p>
                  <p className="font-semibold text-sm">${(item as any).budget.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            {(item as any).download_link && (
              <a
                href={(item as any).download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-5 h-5" />
                Download
              </a>
            )}
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === "cast" && cast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Cast Members</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="space-y-2">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={getImageUrl(person.profile_path, "w185") || "/placeholder.svg"}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold line-clamp-2">{person.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Section */}
        {mediaType === "tv" && item.seasons && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Episodes</h2>
            <EpisodesPanel tvId={item.id} seasons={item.seasons} />
          </section>
        )}

        {hasRelatedItems && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">You May Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {relatedItems.slice(0, 18).map((rel: any) => (
                <MediaCard key={rel.id || rel.tmdb_id} item={rel} mediaType={mediaType} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6 text-white" />
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
