"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface DownloadOption {
  fileName: string
  telegramLink: string
  fileSize: number
  formattedSize: string
  quality: string
  codec: string
  duration: number
}

interface DownloadOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  movieTitle: string
  downloads: DownloadOption[]
}

export function DownloadOptionsModal({ isOpen, onClose, movieTitle, downloads }: DownloadOptionsModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-background rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-balance">Download Options for {movieTitle}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Download Options List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {downloads.map((download, index) => (
            <a
              key={index}
              href={download.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSelectedIndex(index)}
              className="group flex items-center justify-between p-4 rounded-lg border border-white/20 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {/* Quality Badge */}
                  <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-semibold">
                    {download.quality}
                  </span>
                  {/* Codec Badge */}
                  {download.codec && (
                    <span className="px-2 py-1 rounded-md bg-white/10 text-white text-xs font-medium">
                      {download.codec}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                  {download.fileName}
                </p>
              </div>

              {/* File Size and Download Icon */}
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className="text-sm font-semibold text-white whitespace-nowrap">{download.formattedSize}</span>
                <i className="fas fa-download text-red-500 text-lg animate-bounce-slow"></i>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-xs text-muted-foreground text-center">Click any option to download via Telegram</p>
        </div>
      </div>
    </div>
  )
}
