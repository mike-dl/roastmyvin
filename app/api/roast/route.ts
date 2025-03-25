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
  const brakeSystem = data['Brake System'] ?? 'Unknown Brake System'
  const gvwr = data['GVWR'] ?? 'Unknown GVWR'
  const cabtype = data['Cab Type'] ?? 'Unknown Cab Type'

  // Style-based personality
  const personalities: Record<string, string> = {
    'Choose':
    'You are a savage but clever roast comedian and expert diesel mechanic.',
    'New Yorker':
      'two sentences. Your are a new yorker. Every roast must contain a comparison to a NYC feature, burough, maybe a train running late. Also references to bagels, coffee, or hot dogs. Times square or the statue of liberty are good.',
    'Pirate':
      'two sentences. You are a grumpy old pirate who is now a diesel mechanic. Roast the truck like it betrayed you treasure. Speak with pirate flair and only pirate slang, but make the mechanical roasts clever.',
    'Tyler Robertson':
      'two sentences. You are Tyler Robertson, CEO of Diesel Laptops. Every roast should include a lesson about not being scared and going after things in life you really want.',
  }

  const persona = personalities[style] ?? 'You are a savage but clever roast comedian and expert diesel mechanic.'

  const prompt = `
Given the following truck details, write a short roast for each major category. Format it **exactly like this**, including line breaks:

🛻 <value> — <1-line roast>
🚛 <value> — <1-line roast>
🔧 <value> — <1-line roast>
⚖️  <value> — <1-line roast>
🛏️  <value> — <1-line roast>
🛑 Brake System: <value> — <1-line roast>

Truck Info:
Make: ${truckManufacturer}
Model: ${vehicleModel}
Engine: ${engineModel}
GVWR: ${gvwr}
Cab Type: ${cabtype}
Brake System: ${brakeSystem}
`.trim()

  const chatResponse = await openai.chat.completions.create({
    model: `gpt-3.5-turbo`,
    messages: [
      {
        role: 'system',
        content: `${persona} Keep it safe for kids. Output must use line breaks and exactly match the emoji-labeled format.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.9,
    max_tokens: 200,
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
