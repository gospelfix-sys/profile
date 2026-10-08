import { NextResponse } from 'next/server';

// request.json()은 바디가 유효한 JSON이 아니면 그대로 throw해서 Route Handler를 벗어난
// 500으로 떨어진다 — 다른 모든 실패 케이스처럼 { error } JSON으로 일관되게 응답하려면 감싸야 한다.
export async function parseJsonBody<T = unknown>(
  request: Request,
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    return { data: (await request.json()) as T };
  } catch {
    return {
      error: NextResponse.json({ error: '요청 본문이 올바른 JSON이 아닙니다.' }, { status: 400 }),
    };
  }
}
