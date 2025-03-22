// app/api/roast/[roastid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { roastid: string } }
) {
  const { roastid } = params

  const { data, error } = await supabase
    .from('roasts')
    .select('*')
    .eq('id', roastid)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Roast not found' }, { status: 404 })
  }

  return NextResponse.json({
    roast: data.roast,
    created_at: data.created_at,
  })
}
