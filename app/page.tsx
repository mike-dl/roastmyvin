'use client'

import React, { useState } from 'react'

export default function HomePage() {
  const [vin, setVin] = useState('')
  const [roast, setRoast] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setRoast('') 

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      setRoast(data.roast)
    } catch (error) {
      console.error(error)
      setRoast('Something went wrong roasting your VIN.')
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '1rem' }}>
      <h1>Roast My VIN</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter your VIN"
          required
          style={{ flex: 1 }}
        />
        <button type="submit">Roast</button>
      </form>
      {roast && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {roast}
        </div>
      )}
    </div>
  )
}
