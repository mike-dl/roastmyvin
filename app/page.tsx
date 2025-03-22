'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DieselRepairFooter from '@/components/DieselRepairFooter'

interface Roast {
  id: string
  roast: string
  created_at: string
}

export default function HomePage() {
  const [vin, setVin] = useState('')
  const [loading, setLoading] = useState(false)
  const [recentRoasts, setRecentRoasts] = useState<Roast[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/recent-roasts')
      .then((res) => res.json())
      .then((data) => setRecentRoasts(data.roasts ?? []))
      .catch(() => setRecentRoasts([]))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin }),
      })

      const data = await res.json()
      if (res.ok && data?.roastId) {
        router.push(`/roast?roastid=${data.roastId}`)
      } else {
        throw new Error('No roast ID returned.')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong roasting your VIN.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-[850px] mx-auto p-8 bg-black/70 rounded-xl text-white box-border">
        {/* Flickering Logo */}
        <div className="relative w-full max-w-[800px] mx-auto mb-8">
          <img
            src="/logo-off.png"
            alt="Logo Off"
            className="w-full h-auto block"
          />
          <img
            src="/logo-on.png"
            alt="Logo On"
            className="flicker absolute top-0 left-0 w-full h-auto pointer-events-none"
          />
        </div>

        {/* VIN Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap rounded-md overflow-hidden shadow-lg bg-[#222] mb-8"
        >
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter your VIN"
            required
            className="flex-1 min-w-[250px] p-3 bg-transparent text-white outline-none text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white font-bold px-6 flex items-center gap-2"
          >
            🔥 {loading ? 'Roasting...' : 'Roast It!'}
          </button>
        </form>
        {/* Latest Roast */}
        {recentRoasts.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">🔥 Latest Roast</h2>
            <div className="flaming-roast-box">
              <p className="whitespace-pre-line m-0">{recentRoasts[0].roast}</p>
            </div>
            <p className="mb-10 text-sm">This site does not store VINs or collect any personal information.</p>
          </div>
        )}
      </div>

      <DieselRepairFooter />
    </>
  )
}
