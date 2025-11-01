import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
<<<<<<< HEAD
import { Pagination } from "@/components/pagination"
import FetchedMediaCard from "@/components/fetched-series"

=======
import { MediaCard } from "@/components/media-card"
import { Pagination } from "@/components/pagination"
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

export default function TVPage({
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
          <TVContent page={page} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

async function TVContent({ page }: { page: number }) {
<<<<<<< HEAD
  let baseUrl =   "https://cineverse-backend-3duy.onrender.com" 

  baseUrl = baseUrl.replace(/\/$/, "")
  const url = `${baseUrl}/allseries`
=======
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  baseUrl = baseUrl.replace(/\/$/, "")
  const url = `${baseUrl}/api/db-content?type=tv&page=${page}`
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

  const res = await fetch(url, { cache: "force-cache" })
  if (!res.ok) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Unable to Load TV Shows</h2>
        <p className="text-muted-foreground text-sm">Please try again later.</p>
      </div>
    )
  }

  const data = await res.json()
<<<<<<< HEAD
  const content = data.data || []
  console.log(content)
=======
  const content = data.results || []
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
  const totalPages = data.total_pages || 1
  const totalResults = data.total_results || 0

  if (content.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <h2 className="text-xl font-bold mb-4">No TV Shows Available</h2>
        <p className="text-muted-foreground text-sm">Check back soon for more TV shows.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">TV Series</h1>
<<<<<<< HEAD
        <p className="text-muted-foreground text-sm">Popular TV shows  ({content.length} total)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
       
         {content.map((item: any) => (
                   <FetchedMediaCard key={item.id} item={item} />
                   
                ))}
=======
        <p className="text-muted-foreground text-sm">Popular TV shows from TMDB ({totalResults} total)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {content.map((item: any) => (
          <MediaCard key={item.id} item={item} mediaType="tv" />
        ))}
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
      </div>

      <Pagination currentPage={page} totalPages={totalPages} baseUrl="/tv" />
    </div>
  )
}
