import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const game = searchParams.get('game') || 'snake_3d';

    const scores = await prisma.score.findMany({
      where: { gameName: game },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedScores = scores.map((s, index) => ({
      rank: index + 1,
      id: s.id,
      score: s.score,
      applesEaten: s.applesEaten,
      starsCollected: s.starsCollected,
      playedAt: s.createdAt,
      username: s.user.username,
    }));

    return NextResponse.json({ scores: formattedScores }, { status: 200 });
  } catch (error) {
    console.error('Fetch scores error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve leaderboard scores.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required to save score to the leaderboard.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { score, applesEaten = 0, starsCollected = 0, gameName = 'snake_3d' } = body;

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score value provided.' },
        { status: 400 }
      );
    }

    // Anti-cheat verification
    // 100 points per apple, 300 points per star
    const expectedScore = (Number(applesEaten) * 100) + (Number(starsCollected) * 300);
    if (score !== expectedScore) {
      return NextResponse.json(
        { error: 'Score verification failed: telemetry does not match score.' },
        { status: 400 }
      );
    }

    // Check user's previous personal best
    const previousBest = await prisma.score.findFirst({
      where: {
        userId: session.userId,
        gameName,
      },
      orderBy: { score: 'desc' },
    });

    const isNewPersonalBest = !previousBest || score > previousBest.score;

    const savedScore = await prisma.score.create({
      data: {
        userId: session.userId,
        gameName,
        score,
        applesEaten: Number(applesEaten),
        starsCollected: Number(starsCollected),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Score recorded successfully.',
        score: {
          id: savedScore.id,
          score: savedScore.score,
          applesEaten: savedScore.applesEaten,
          starsCollected: savedScore.starsCollected,
          username: savedScore.user.username,
          createdAt: savedScore.createdAt,
          isNewPersonalBest,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit score error:', error);
    return NextResponse.json(
      { error: 'Failed to record score.' },
      { status: 500 }
    );
  }
}
