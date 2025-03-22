import { Suspense } from 'react'
import RoastClient from './RoastClient'

export default function RoastPage() {
  return (
    <Suspense fallback={<p>Loading roast...</p>}>
      <RoastClient />
    </Suspense>
  )
}
