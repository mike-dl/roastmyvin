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

  // 🔐 Password gate
  const [showGate, setShowGate] = useState(true)
  const [inputPassword, setInputPassword] = useState('')
  const correctPassword = 'weekendroast'

  useEffect(() => {
    if (localStorage.getItem('access_granted') === 'true') {
      setShowGate(false)
    }
  }, [])

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

  // 🔐 Show password modal if locked
  if (showGate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
          <h2 className="text-2xl font-bold">Protected Page</h2>
          <p className="text-sm">This page is locked. Enter the password to continue.</p>
          <input
            type="password"
            className="input input-bordered w-full text-white"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button
            className="btn btn-neutral w-full"
            onClick={() => {
              if (inputPassword === correctPassword) {
                localStorage.setItem('access_granted', 'true')
                setShowGate(false)
              } else {
                alert('Incorrect password')
              }
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="w-full max-w-[850px] mx-auto p-8 bg-black/70 text-white box-border flex-grow">
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

        {/* VIN Input */}
        <form
  onSubmit={handleSubmit}
  className="flex flex-col sm:flex-row sm:flex-wrap gap-2 rounded-md overflow-hidden shadow-lg bg-[#222] mb-8"
>
  <input
    type="text"
    value={vin}
    onChange={(e) => setVin(e.target.value)}
    placeholder="Enter your VIN"
    required
    className="w-full sm:flex-1 min-w-[250px] p-3 bg-transparent text-white outline-none text-3xl"
  />
  <button
    type="submit"
    disabled={loading}
    className="w-full sm:w-auto bg-[#a11703] text-white font-bold px-6 py-3 text-xl flex items-center justify-center gap-2"
  >
    🔥 {loading ? 'Roasting...' : 'Roast Me!'}
  </button>
</form>


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
