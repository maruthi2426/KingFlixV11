"use client"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="relative w-16 h-16 mb-8">
        <div className="rounded-full border-4 border-accent/30" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Loading content...</h2>

      <p className="text-muted-foreground text-sm md:text-base">Discovering amazing content</p>
    </div>
  )
}
