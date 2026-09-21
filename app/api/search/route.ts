import { NextRequest, NextResponse } from 'next/server';
import { providerManager } from '@/lib/providers/manager';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: 'Query parameter q is required' },
      { status: 400 }
    );
  }

  try {
    const result = await providerManager.executeSearch(query.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API/search] Error executing search:', error);
    return NextResponse.json(
      { error: 'Failed to search providers' },
      { status: 500 }
    );
  }
}
