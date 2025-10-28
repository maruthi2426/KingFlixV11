import { MediaCard } from "./media-card"
import { Pagination } from "./pagination"

interface SearchResultsProps {
  query: string
  page: number
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-serif font-bold">Start Searching</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Use the search bar above to discover movies, TV shows, and anime in your collection.
        </p>
      </div>
    )
  }

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "http://localhost:3000"
  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`
  }
  baseUrl = baseUrl.replace(/\/$/, "")

  const apiUrl = `${baseUrl}/api/db-content?q=${encodeURIComponent(query)}&limit=100`

  let allResults: any[] = []
  try {
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (res.ok) {
      const json = await res.json()
      allResults = json.results || []
    }
  } catch (err) {
    console.error("[v0] Search fetch error:", err)
  }

  const itemsPerPage = 20
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const data = allResults.slice(startIndex, endIndex)
  const totalPages = Math.ceil(allResults.length / itemsPerPage)

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-serif font-bold">No Results Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find anything matching "{query}" in your collection. Try different keywords or add more content
          via the Telegram bot.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Search Results for "{query}"</h1>
        <p className="text-muted-foreground">Found {allResults.length} results in your collection</p>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map((item: any) => (
            <MediaCard key={`${item.media_type}-${item.tmdb_id || item.id}`} item={item} mediaType={item.media_type} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/search?q=${encodeURIComponent(query)}`} />
      )}
    </div>
  )
}
