// app/api/roast/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { vin } = await request.json()

    if (!vin) {
      throw new Error('No VIN provided')
    }
    const roastText = await generateRoast(vin)
    return NextResponse.json({ roast: roastText })
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: 'Unable to roast VIN', details: String(error) }),
      { status: 400 }
    )
  }
}

async function generateRoast(vin: string): Promise<string> {
  try {
    const apiKey = process.env.API_KEY
    const baseUrl = process.env.API_BASE_URL
    const apiVersion = process.env.API_VERSION
    const url = `${baseUrl}?vin=${encodeURIComponent(vin)}&apiVersion=${apiVersion}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`VIN API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Full data:', JSON.stringify(data, null, 2))

    if (data.status !== 'success') {
      throw new Error(`VIN decode returned failure: ${JSON.stringify(data)}`)
    }
    const vinValue = data["VIN"] ?? "Unknown VIN"
    const gvwr = data["GVWR"] ?? "Unknown GVWR"
    const source = data["Source"] ?? "Unknown Source"
    const status = data["status"] ?? "Unknown Status"
    const cabType = data["Cab Type"] ?? "Unknown Cab Type"
    const fuelType = data["Fuel Type"] ?? "Unknown Fuel Type"
    const engineInfo = data["Engine Info"] ?? "Unknown Engine Info"
    const brakeSystem = data["Brake System"] ?? "Unknown Brake System"
    const engineModel = data["Engine Model"] ?? "Unknown Engine Model"
    const vehicleInfo = data["Vehicle Info"] ?? "Unknown Vehicle Info"
    const vehicleType = data["Vehicle Type"] ?? "Unknown Vehicle Type"
    const vehicleModel = data["Vehicle Model"] ?? "Unknown Vehicle Model"
    const driveLineType = data["Drive Line Type"] ?? "Unknown Drive Line Type"
    const engineCapacity = data["Engine Capacity"] ?? "Unknown Engine Capacity"
    const plantManufacturer = data["Plant Manufacturer"] ?? "Unknown Plant Manufacturer"
    const truckManufacturer = data["Truck Manufacturer"] ?? "Unknown Truck Manufacturer"
    const engineManufacturer = data["Engine Manufacturer"] ?? "Unknown Engine Manufacturer"
    const vehicleManufacturerYear = data["Vehicle Manufacturer Year"] ?? "Unknown Vehicle Manufacturer Year"
    const oemParts = data["oemParts"] ?? "No OEM parts"

    const roastText = `Lol, a cute ${truckManufacturer}, do they even sell the ${vehicleModel} anymore?`


    return roastText
  } catch (error) {
    console.error(error)
    return `We tried to decode VIN ${vin}, but even Diesel Laptops gave up on it.`
  }
}
