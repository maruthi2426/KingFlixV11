"use client"
import { Download, Loader2 } from "lucide-react"
<<<<<<< HEAD
import useSWR from "swr"
import type { Movie } from "@/lib/tmdb"
import { getTitle, getYear } from "@/lib/tmdb"
=======
import { useState } from "react"
import useSWR from "swr"
import type { Movie } from "@/lib/tmdb"
import { getTitle, getYear } from "@/lib/tmdb"
import { DownloadOptionsModal } from "./download-options-modal"
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655

interface DownloadButtonProps {
  item: Movie
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch")
    return r.json()
  })

export function DownloadButton({ item }: DownloadButtonProps) {
<<<<<<< HEAD
  console.log(item)
=======
  const [showModal, setShowModal] = useState(false)

>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
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
<<<<<<< HEAD
    <a
      href={data.download.telegramLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
    >
      <Download className="w-5 h-5" />
      Download
    </a>
=======
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
      >
        <Download className="w-5 h-5" />
        Download
      </button>

      <DownloadOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        movieTitle={title}
        downloads={data.downloads || []}
      />
    </>
>>>>>>> a43fb06f7e1ab2e1ce81dc30cf3dbe4cf86da655
  )
}
