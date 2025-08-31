import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

// CORS headers function
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function GET(request: NextRequest) {
  try {
    // Get the query from URL parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' }, 
        { status: 400, headers: corsHeaders() }
      )
    }

    // Execute the Sanity query
    const data = await client.fetch(query)
    
    return NextResponse.json({ data }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Sanity API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Sanity' },
      { status: 500, headers: corsHeaders() }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, params } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' }, 
        { status: 400, headers: corsHeaders() }
      )
    }

    // Execute the Sanity query with optional parameters
    const data = await client.fetch(query, params || {})
    
    return NextResponse.json({ data }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Sanity API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Sanity' },
      { status: 500, headers: corsHeaders() }
    )
  }
}
