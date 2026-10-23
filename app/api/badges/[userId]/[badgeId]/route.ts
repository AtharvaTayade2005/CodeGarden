import { NextRequest, NextResponse } from 'next/server';
import { getBadgeById, generateBadgeSvg, getAllMilestoneBadges } from '@/src/data/badges';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; badgeId: string }> }
) {
  const { userId, badgeId } = await params;

  // Clean badgeId if it has a .svg extension (e.g. control-flow-conquered.svg -> control-flow-conquered)
  const cleanBadgeId = badgeId.replace(/\.svg$/i, '');

  const badge = getBadgeById(cleanBadgeId) || getAllMilestoneBadges()[0];
  const svgContent = generateBadgeSvg(badge, userId);

  return new NextResponse(svgContent, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
