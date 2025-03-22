'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: 'auto',
      padding: '2rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '12px',
      color: 'white',
    }}>
      <div style={{ position: 'relative', width: '850px', margin: '0 auto 2rem' }}>
  <img
    src="/logo-off.png"
    alt="Logo Off"
    style={{
      width: '100%',
      display: 'block',
    }}
  />
  <img
    src="/logo-on.png"
    alt="Logo On"
    className="flicker"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      pointerEvents: 'none',
    }}
  />
</div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter your VIN"
          required
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: '4px',
            outline: 'none',
            backgroundColor: '#222',
            color: '#fff',
            boxShadow: '0 0 8px 2px orange, inset 0 0 4px orange',
            transition: 'box-shadow 0.2s ease-in-out'
          }}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Roasting...' : 'Roast'}
        </button>
      </form>

      {recentRoasts.length > 0 && (
  <div>
    <h2 style={{ marginBottom: '1rem' }}>🔥 Latest Roast</h2>
    <div className="flaming-roast-box">
      <p style={{ whiteSpace: 'pre-line' }}>{recentRoasts[0].roast}</p>
    </div>
  </div>
)}

    </div>
  )
}
