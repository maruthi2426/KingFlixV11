import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { MediaCarousel } from "@/components/media-carousel"
import { Footer } from "@/components/footer"
import { Top10CombinedSection } from "@/components/top-10-combined-section"
import { RecentlyAddedSection } from "@/components/recently-added-section"
import { AnimeSection } from "@/components/anime-section"
import { GenreMoviesSection } from "@/components/genre-movies-section"
import { discoverMovies, discoverTV } from "@/lib/api"

export const dynamic = "force-dynamic"

async function HomeContent() {
  try {
    const moviesData = await discoverMovies(1)
    const tvData = await discoverTV(1)

    const heroItems = [...(moviesData.results || []), ...(tvData.results || [])].slice(0, 5)
    const movies = moviesData.results || []
    const tvShows = tvData.results || []

    if (movies.length === 0 && tvShows.length === 0) {
      return (
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome to MovieFlix</h2>
            <p className="text-muted-foreground mb-6">
              To display movies and TV shows, please configure your TMDB API key.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-yellow-500 mb-2">Setup Required:</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  Get your API key from{" "}
                  <a
                    href="https://www.themoviedb.org/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    TMDB Settings
                  </a>
                </li>
                <li>
                  Open the <strong>Vars</strong> section in the left sidebar
                </li>
                <li>
                  Add variable: <code className="bg-black/30 px-2 py-1 rounded">TMDB_API_KEY</code>
                </li>
                <li>Paste your API key and save</li>
                <li>Redeploy your app</li>
              </ol>
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        {heroItems.length > 0 && (
          <section className="container mx-auto px-4 pt-24 pb-4">
            <HeroCarousel items={heroItems} />
          </section>
        )}
        <section className="container mx-auto px-4 space-y-4">
          <Top10CombinedSection />

          <RecentlyAddedSection />

          {movies.length > 0 && <MediaCarousel title="Movies" items={movies} mediaType="movie" enableShuffle={true} />}

          {tvShows.length > 0 && (
            <MediaCarousel title="TV Series" items={tvShows} mediaType="tv" enableShuffle={true} />
          )}

          <GenreMoviesSection genreId="28" genreName="Action" />
          <GenreMoviesSection genreId="27" genreName="Horror" />
          <GenreMoviesSection genreId="878" genreName="Sci-Fi" />

          <AnimeSection />
        </section>
      </>
    )
  } catch (error) {
    console.error("[v0] Error loading home page:", error)

    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="glass-card rounded-3xl p-12 text-center">
          <h2 className="text-xl font-bold mb-4">Welcome to MovieFlix</h2>
          <p className="text-muted-foreground text-sm mb-6">Browse movies, TV shows, and anime from TMDB.</p>
        </div>
      </div>
    )
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HomeContent />
      </main>
      <Footer />
    </div>
  )
}
