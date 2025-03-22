'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function RoastPage() {
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

  return (
    <div
      style={{
        maxWidth: '850px',
        margin: 'auto',
        padding: '2rem',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '12px',
        color: 'white',
      }}
    >
      {/* Flickering roast logo */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto 2rem' }}>
        <img
          src="/roast-off.png"
          alt="Roast Off"
          style={{ width: '100%', display: 'block' }}
        />
        <img
          src="/roast-on.png"
          alt="Roast On"
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
      {/* Roast text */}
      {loading ? (
        <p>Loading roast...</p>
      ) : roast ? (
        <div className="flaming-roast-box">
        <p style={{ whiteSpace: 'pre-line',margin:0 }}>{roast}</p>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Home
      </Link>

      </div>
      ) : (
        <p>Roast not found.</p>
      )}
    </div>
  )
}
