import { NextResponse } from 'next/server';
import { INITIAL_PRICE_ALERTS, evaluatePriceAlerts } from '@/lib/alerts';

export async function POST() {
  try {
    const result = evaluatePriceAlerts(INITIAL_PRICE_ALERTS);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checkedCount: result.checkedCount,
      triggeredCount: result.triggeredAlerts.length,
      triggeredAlerts: result.triggeredAlerts,
    });
  } catch (error) {
    console.error('[API/alerts/check] Error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate alerts' },
      { status: 500 }
    );
  }
}
