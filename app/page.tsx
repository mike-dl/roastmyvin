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
  const [style, setStyle] = useState('Choose')
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
        body: JSON.stringify({ vin, style }),
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
    <div className="flex flex-col min-h-screen">
      <main className="w-full max-w-[900px] mx-auto p-8 bg-black/70 text-white box-border flex-grow">
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:gap-0 rounded-md overflow-hidden mb-8">
          
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Enter your VIN"
            required
            className="w-full sm:w-1/2 bg-[#222] p-1 text-white outline-none text-2xl"
          />

          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            required
            className="w-full sm:w-2/6 bg-[#222] text-white p-1 px-1 sm:mx-3 text-xl">    
            <option value="Choose">Style</option>
            <option value="New Yorker">🗽 New Yorker</option>
            <option value="Pirate">🏴‍☠️ Pirate</option>
            <option value="Tyler Robertson">👨‍💼 CEO Tyler Robertson</option>
            <option value="The Diesel Queen">🌶️ The Diesel Queen</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-1/6 bg-[#a11703] p-3 text-white font-bold text-xl flex items-center justify-center"
          >
           {loading ? '🔥🔥🔥' : '🔥 Roast'}
          </button>
        </form>

        <div className="flex flex-wrap gap-3 mb-8">
          <h2>Need a VIN? Use one of ours!</h2>
          <button
            type="button"
            onClick={() => setVin('1XP4DP9XXED223076')}
            className="bg-[#444] text-white font-bold px-4 py-2 rounded hover:bg-[#666]">
          Peterbilt
          </button>

          <button
            type="button"
            onClick={() => setVin('1FUJGEDV3CSBD6707')}
            className="bg-[#444] text-white font-bold px-4 py-2 rounded hover:bg-[#666]">
          Freightliner
          </button>

          <button
            type="button"
            onClick={() => setVin('1HSDJSJR8CH672960')}
            className="bg-[#444] text-white font-bold px-4 py-2 rounded hover:bg-[#666]">
          International
          </button>

          <button
            type="button"
            onClick={() => setVin('4V4NC9TH9EN157866')}
            className="bg-[#444] text-white font-bold px-4 py-2 rounded hover:bg-[#666]">
          Volvo
          </button>
        </div>


        {/* Latest Roast */}
        {recentRoasts.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">🔥 Latest Roast</h2>
            <div className="flaming-roast-box">
              <p className="whitespace-pre-line m-0">{recentRoasts[0].roast}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <DieselRepairFooter />
    </div>
  )
}
