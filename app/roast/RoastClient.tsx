'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DieselRepairFooter from '@/components/DieselRepairFooter'

export default function RoastClient() {
  const searchParams = useSearchParams()
  const roastId = searchParams.get('roastid')
  const [roast, setRoast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  const socialBtnStyle = (bg: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: bg,
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontSize: '0.95rem',
  })

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full max-w-[850px] mx-auto p-8 bg-black/70 rounded-xl text-white box-border">
        {/* Home Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-block text-[#ff5722] font-bold uppercase tracking-wide text-sm no-underline hover:text-[#ffa726] transition-all"
          >
            ← Home
          </Link>
        </div>

        {/* Flickering Roast Logo */}
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

        {/* Roast Display */}
        {loading ? (
          <p>Loading roast...</p>
        ) : roast ? (
          <>
            <div className="flaming-roast-box">
              <p className="whitespace-pre-line m-0">{roast}</p>
            </div>

            {/* Share CTA */}
            <div className="mt-8 text-center">
              <p className="mb-4 font-bold">Share this roast 👇</p>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => {
                    const url = window.location.href
                    navigator.clipboard.writeText(url)
                    alert('Roast URL copied to clipboard!')
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded font-bold flex items-center"
                >
                  📋 Copy Link
                </button>

                <a
                  href={`https://twitter.com/intent/tweet?text=Check out this brutal truck roast&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded font-bold text-sm"
                >
                  <img src="/icons/x.svg" alt="X Logo" className="h-5 invert" />
                  Share on X
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded font-bold text-sm"
                >
                  <img src="/icons/fb.svg" alt="Facebook Logo" className="h-5 invert" />
                  Share on Facebook
                </a>

                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=Roast%20My%20VIN`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded font-bold text-sm"
                >
                  <img src="/icons/linkedin.svg" alt="LinkedIn Logo" className="h-5" />
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </>
        ) : (
          <p>Roast not found.</p>
        )}
      </main>

      {/* Footer outside the main container */}
      <DieselRepairFooter />
    </div>
  )
}
