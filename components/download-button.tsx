"use client"
import { Download, Loader2 } from "lucide-react"
import useSWR from "swr"
import type { Movie } from "@/lib/tmdb"
import { getTitle, getYear } from "@/lib/tmdb"

interface DownloadButtonProps {
  item: Movie
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch")
    return r.json()
  })

export function DownloadButton({ item }: DownloadButtonProps) {
  const title = getTitle(item)
  const year = getYear(item)

  const { data, isLoading, error } = useSWR(
    `/api/download-check?title=${encodeURIComponent(title)}&year=${year}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  )

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-sm border border-white/30 opacity-50"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Checking...
      </button>
    )
  }

  if (!data?.available) {
    return null
  }

  return (
    <a
      href={data.download.telegramLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
    >
      <Download className="w-5 h-5" />
      Download
    </a>
  )
}
