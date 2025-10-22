import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SettingsIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings - CineVerse",
  description: "Manage your CineVerse settings",
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-accent" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-semibold mb-2">Preferences</h2>
              <p className="text-muted-foreground">
                Settings and preferences will be available in a future update. Your watchlist is currently stored
                locally in your browser.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-semibold mb-2">Telegram Bot</h2>
              <p className="text-muted-foreground mb-4">
                Content on CineVerse is curated through our Telegram bot. Connect with the bot to add movies, TV shows,
                and anime to the collection.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-semibold mb-2">Download Service</h2>
              <p className="text-muted-foreground">
                Download links are available for select content. When viewing a movie or TV show, if a download is
                available, you'll see a download button that will direct you to the content.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <h2 className="text-xl font-semibold mb-2">Data Storage</h2>
              <p className="text-muted-foreground">
                Your watchlist is stored locally in your browser using localStorage. This data is not synced across
                devices and will be cleared if you clear your browser data.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
