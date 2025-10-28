import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Film, Tv, Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - CineVerse",
  description: "Learn more about CineVerse",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About CineVerse</h1>

          <div className="space-y-8">
            <section>
              <p className="text-lg text-muted-foreground leading-relaxed">
                CineVerse is your cinematic gateway to discovering movies, TV shows, and anime. We curate content
                through our Telegram bot, making it easy to build and share your personal collection.
              </p>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <Film className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">Movies</h3>
                <p className="text-sm text-muted-foreground">
                  Discover and track your favorite films from classics to the latest releases.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <Tv className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">TV Shows</h3>
                <p className="text-sm text-muted-foreground">
                  Keep up with your favorite series and discover new shows to binge.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <Sparkles className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2">Anime</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the world of anime with curated recommendations and tracking.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Powered by TMDb</h2>
              <p className="text-muted-foreground leading-relaxed">
                This product uses the TMDb API but is not endorsed or certified by TMDb. All movie, TV show, and anime
                data is provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  The Movie Database
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content Curation</h2>
              <p className="text-muted-foreground leading-relaxed">
                Content on CineVerse is curated from The Movie Database (TMDb). We provide access to a vast collection
                of movies, TV shows, and anime with download options available through our integrated download service.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
