import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase-server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { vin, style } = await request.json()
    if (!vin) throw new Error('No VIN provided')

    const { roast, roastId } = await generateRoast(vin, style)
    return NextResponse.json({ roast, roastId })
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: 'Unable to roast VIN', details: String(error) }),
      { status: 400 }
    )
  }
}

async function generateRoast(vin: string, style: string): Promise<{ roast: string; roastId: string }> {
  const apiKey = process.env.API_KEY
  const baseUrl = process.env.API_BASE_URL
  const apiVersion = process.env.API_VERSION
  const url = `${baseUrl}?vin=${encodeURIComponent(vin)}&apiVersion=${apiVersion}`

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'x-api-key': apiKey! },
  })

  if (!response.ok) {
    throw new Error(`VIN API request failed: ${response.status}`)
  }

  const data = await response.json()
  if (data.status !== 'success') {
    throw new Error(`VIN decode returned failure: ${JSON.stringify(data)}`)
  }

  const truckManufacturer = data['Truck Manufacturer'] ?? 'Unknown Make'
  const vehicleModel = data['Vehicle Model'] ?? 'Unknown Model'
  const engineModel = data['Engine Model'] ?? 'Unknown Engine'
  const gvwr = data['GVWR'] ?? 'Unknown GVWR'
  const cabtype = data['Cab Type'] ?? 'Unknown Cab Type'
  const brakeSystem = data['Brake System'] ?? 'Unknown Brake System'

  // Style-based personality
  const personalities: Record<string, string> = {
    'Choose':
    'You are a savage but clever roast comedian and expert diesel mechanic.',
    'New Yorker':
      'Every roast must include references to New York City, including food, buroughs, culture, etc. Make sure to spell words in the way that a new yorder would say them.',
    'Pirate':
      'Every roast must include pirate slang and comparisons to ships, treasure, scurvy, etc.Make sure to spell words in the way a pirate would say them',
    'Tyler Robertson':
      'Make a hilarious joke about each component',
  }

  const persona = personalities[style] ?? 'You are a savage but clever roast comedian and expert diesel mechanic.'

  const prompt = `
Format your reply like this, in plain text:

🛻 Make: ${truckManufacturer} — <2-line roast>
🚛 Model: ${vehicleModel} — <2-line roast>
🔧 Engine: ${engineModel} — <2-line roast>
⚖️ GVWR: ${gvwr} — <2-line roast>
🛏️ Cab Type: ${cabtype} — <2-line roast>
🛑 Brake System: ${brakeSystem} — <2-line roast>
`

  const chatResponse = await openai.chat.completions.create({
    model: 'chatgpt-4o-latest',
    messages: [
      {
        role: 'system',
        content: `${persona} Brutally roast this truck, say nothing nice. Keep it safe for work. Output must use line breaks and exactly match the emoji-labeled format.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.9,
    max_tokens: 400,
  })

  const aiRoast = chatResponse.choices[0].message.content?.trim() ?? 'This truck roasted itself.'
  const roastId = crypto.randomBytes(6).toString('hex')

  const { error } = await supabase
    .from('roasts')
    .insert([{ id: roastId, roast: aiRoast }])

  if (error) {
    console.error('Supabase insert error:', error)
  }

  return { roast: aiRoast, roastId }
}
