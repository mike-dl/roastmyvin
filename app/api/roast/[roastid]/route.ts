import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const roastId = pathname.split('/').pop()

  if (!roastId) {
    return NextResponse.json({ error: 'Missing roast ID' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('roasts')
    .select('id, vin, roast, created_at')
    .eq('id', roastId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Roast not found' }, { status: 404 })
  }

  return NextResponse.json({
    roast: data.roast,
    vin: data.vin,
    created_at: data.created_at,
  })
}
