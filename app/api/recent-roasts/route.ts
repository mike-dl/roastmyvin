// app/api/recent-roasts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(_: NextRequest) {
  const { data, error } = await supabase
    .from('roasts')
    .select('id, roast, created_at')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch recent roasts' }, { status: 500 })
  }

  return NextResponse.json({ roasts: data })
}
