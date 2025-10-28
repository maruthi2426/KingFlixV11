"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Movie } from "@/lib/tmdb"
import { getTitle, getYear, getImageUrl } from "@/lib/tmdb"
import Image from "next/image"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/tmdb?endpoint=/search/multi&query=${encodeURIComponent(query)}&page=1`, {
          cache: "no-store",
        })

        if (!res.ok) {
          console.error("[v0] Search API error:", res.status, res.statusText)
          setResults([])
          setIsOpen(true)
          return
        }

        const data = await res.json()
        console.log("[v0] Search results:", data)

        // Handle both array and paginated response formats
        const items = Array.isArray(data) ? data : data?.results || []
        setResults(items as Movie[])
        setIsOpen(true)
      } catch (error) {
        console.error("[v0] Search error:", error)
        setResults([])
        setIsOpen(true)
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      // keep query so user sees it on search page
    }
  }

  const handleResultClick = (item: Movie) => {
    const type = item.media_type === "tv" ? "tv" : item.media_type === "anime" ? "anime" : "movie"
    const id = (item as any).tmdb_id || item.id
    router.push(`/${type}/${id}`)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div ref={searchRef} className="relative w-full lg:w-80">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)} // open suggestions on focus
          placeholder="Search movies, TV shows, anime..."
          className="w-full pl-10 pr-10 py-2 bg-background/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full glass rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : query.trim().length === 0 ? (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Start typing to search your collection</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => (
                <button
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => handleResultClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors text-left"
                >
                  <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={getImageUrl(item.poster_path, "w92") || "/placeholder.svg"}
                      alt={getTitle(item)}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{getTitle(item)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                        {item.media_type === "tv" ? "TV" : item.media_type === "anime" ? "Anime" : "Movie"}
                      </span>
                      {(item.release_date || item.first_air_date) && (
                        <span className="text-xs text-muted-foreground">{getYear(item)}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-sm text-accent hover:bg-accent/10 transition-colors border-t border-border"
              >
                View all results →
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
