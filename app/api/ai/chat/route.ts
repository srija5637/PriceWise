import { NextRequest, NextResponse } from 'next/server';
import { executeAiShoppingAssistant } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body?.query;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = executeAiShoppingAssistant(query.trim());
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API/ai/chat] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI query' },
      { status: 500 }
    );
  }
}
