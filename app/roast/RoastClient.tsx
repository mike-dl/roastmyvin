'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DieselRepairFooter from '@/components/DieselRepairFooter'

export default function RoastClient() {
  const searchParams = useSearchParams()
  const [roastId, setRoastId] = useState<string | null>(null)
  const [roast, setRoast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  // Get roast ID and current URL in a client-safe way
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = searchParams.get('roastid')
      setRoastId(id)
      setCurrentUrl(window.location.href)
    }
  }, [searchParams])

  // Fetch roast data once we have the roastId
  useEffect(() => {
    if (roastId) {
      fetch(`/api/roast/${roastId}`)
        .then((res) => res.json())
        .then((data) => {
          setRoast(data.roast ?? 'No roast found.')
        })
        .catch(() => setRoast('Error loading roast.'))
        .finally(() => setLoading(false))
    }
  }, [roastId])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full max-w-[900px] mx-auto p-8 bg-black/70 text-white box-border">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-block text-[#ff5722] font-bold uppercase tracking-wide text-sm no-underline hover:text-[#ffa726] transition-all"
          >
            ← Roast Another!
          </Link>
        </div>

        <div className="relative w-full max-w-[800px] mx-auto mb-8">
          <img
            src="/roast-off.png"
            alt="Roast Off"
            className="w-full h-auto block"
          />
          <img
            src="/roast-on.png"
            alt="Roast On"
            className="flicker absolute top-0 left-0 w-full h-auto pointer-events-none"
          />
        </div>

        <div className="mt-4 mb-10 text-center">
          <h2 className="mb-4 font-bold text-3xl">🔥🔥 Share this roast 🔥🔥</h2>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUrl)
                alert('Roast URL copied to clipboard!')
              }}
              className="px-4 py-2 bg-[#ffb81c] text-black font-bold flex items-center"
            >
              📋 Copy link to share!
            </button>
          </div>
        </div>

        {/* Roast Display */}
        {loading ? (
          <p>Loading roast...</p>
        ) : roast ? (
          <div className="flaming-roast-box">
            <p className="whitespace-pre-line m-0">{roast}</p>
          </div>
        ) : (
          <p>Roast not found.</p>
        )}
      </main>
      <DieselRepairFooter />
    </div>
  )
}
