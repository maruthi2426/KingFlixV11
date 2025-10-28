"use client"

import { useState } from "react"
import { X, Filter } from "lucide-react"

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  genre: string
  language: string
  year: string
  rating: string
  sortBy: string
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    genre: "all",
    language: "all",
    year: "all",
    rating: "all",
    sortBy: "popularity",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-sm border border-white/30 hover:border-accent hover:text-accent"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-8 space-y-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Genre Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => updateFilter("genre", e.target.value)}
                  className="w-full glass rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-accent focus:outline-none transition-colors text-sm"
                >
                  <option value="all">All Genres</option>
                  <option value="28">Action</option>
                  <option value="12">Adventure</option>
                  <option value="16">Animation</option>
                  <option value="35">Comedy</option>
                  <option value="80">Crime</option>
                  <option value="18">Drama</option>
                  <option value="14">Fantasy</option>
                  <option value="27">Horror</option>
                  <option value="10749">Romance</option>
                  <option value="878">Sci-Fi</option>
                  <option value="53">Thriller</option>
                </select>
              </div>

              {/* Language Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => updateFilter("language", e.target.value)}
                  className="w-full glass rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-accent focus:outline-none transition-colors text-sm"
                >
                  <option value="all">All Languages</option>
                  <option value="en">English</option>
                  <option value="ko">Korean</option>
                  <option value="ja">Japanese</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => updateFilter("year", e.target.value)}
                  className="w-full glass rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-accent focus:outline-none transition-colors text-sm"
                >
                  <option value="all">All Years</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => updateFilter("rating", e.target.value)}
                  className="w-full glass rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-accent focus:outline-none transition-colors text-sm"
                >
                  <option value="all">Any Rating</option>
                  <option value="9">9+ Stars</option>
                  <option value="8">8+ Stars</option>
                  <option value="7">7+ Stars</option>
                  <option value="6">6+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="w-full glass rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-accent focus:outline-none transition-colors text-sm"
                >
                  <option value="popularity">Popularity (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="recent">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
