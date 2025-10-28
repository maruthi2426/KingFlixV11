import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { Pagination } from "@/components/pagination"

export default function AnimePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number.parseInt(searchParams.page || "1", 10)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Suspense fallback={null}>
          <AnimeContent page={page} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

async function AnimeContent({ page }: { page: number }) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  baseUrl = baseUrl.replace(/\/$/, "")
  const url = `${baseUrl}/api/animation?page=${page}`

  const res = await fetch(url, { cache: "force-cache" })
  if (!res.ok) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Unable to Load Anime</h2>
        <p className="text-muted-foreground text-sm">Please try again later.</p>
      </div>
    )
  }

  const data = await res.json()
  const content = data.results || []
  const totalPages = data.total_pages || 1
  const totalResults = data.total_results || 0

  if (content.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <h2 className="text-xl font-bold mb-4">No Anime Available</h2>
        <p className="text-muted-foreground text-sm">Check back soon for more anime.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Anime</h1>
        <p className="text-muted-foreground text-sm">Animation genre collection from TMDB ({totalResults} total)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map((item: any) => (
          <MediaCard key={item.tmdb_id || item.id} item={item} mediaType={item.media_type || "movie"} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/anime" />
    </div>
  )
}
