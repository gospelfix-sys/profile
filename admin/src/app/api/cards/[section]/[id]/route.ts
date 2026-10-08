import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';
import { CARD_TABLES, isCardSection } from '@/types/content.types';
import { cardSchema } from '@/libs/validation/content';
import { parseJsonBody } from '@/libs/http';

function resolveTable(section: string) {
  if (!isCardSection(section)) return null;
  return CARD_TABLES[section];
}

export async function GET(
  _request: Request,
  { params }: { params: { section: string; id: string } },
) {
  const table = resolveTable(params.section);
  if (!table) {
    return NextResponse.json(
      { error: '존재하지 않는 섹션입니다.' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  { params }: { params: { section: string; id: string } },
) {
  const table = resolveTable(params.section);
  if (!table) {
    return NextResponse.json(
      { error: '존재하지 않는 섹션입니다.' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const parsedBody = await parseJsonBody(request);
  if ('error' in parsedBody) return parsedBody.error;
  const parsed = cardSchema.safeParse(parsedBody.data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from(table)
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { section: string; id: string } },
) {
  const table = resolveTable(params.section);
  if (!table) {
    return NextResponse.json(
      { error: '존재하지 않는 섹션입니다.' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { error } = await supabase.from(table).delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// 순서 변경 — 인접 행과 sort_order를 맞바꾼다 (드래그앤드롭 라이브러리 없이 ▲▼ 버튼으로 처리)
export async function PATCH(
  request: Request,
  { params }: { params: { section: string; id: string } },
) {
  const table = resolveTable(params.section);
  if (!table) {
    return NextResponse.json(
      { error: '존재하지 않는 섹션입니다.' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const parsedBody = await parseJsonBody<{ direction?: string }>(request);
  if ('error' in parsedBody) return parsedBody.error;
  const { direction } = parsedBody.data;
  if (direction !== 'up' && direction !== 'down') {
    return NextResponse.json(
      { error: 'direction은 up 또는 down이어야 합니다.' },
      { status: 400 },
    );
  }

  const { data: current, error: currentError } = await supabase
    .from(table)
    .select('id, sort_order')
    .eq('id', params.id)
    .single();

  if (currentError || !current) {
    return NextResponse.json(
      { error: currentError?.message ?? '대상을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  // 'up'은 바로 위(sort_order가 작은 쪽 중 가장 가까운 값 = 내림차순 1번째),
  // 'down'은 바로 아래(sort_order가 큰 쪽 중 가장 가까운 값 = 오름차순 1번째)를 찾는다.
  const { data: neighbor, error: neighborError } = await supabase
    .from(table)
    .select('id, sort_order')
    .order('sort_order', { ascending: direction === 'down' })
    .gt('sort_order', direction === 'down' ? current.sort_order : -1)
    .lt(
      'sort_order',
      direction === 'up' ? current.sort_order : Number.MAX_SAFE_INTEGER,
    )
    .limit(1)
    .maybeSingle();

  if (neighborError) {
    return NextResponse.json({ error: neighborError.message }, { status: 500 });
  }

  if (!neighbor) {
    return NextResponse.json({ ok: true });
  }

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from(table)
      .update({ sort_order: neighbor.sort_order })
      .eq('id', current.id),
    supabase
      .from(table)
      .update({ sort_order: current.sort_order })
      .eq('id', neighbor.id),
  ]);

  if (error1 || error2) {
    return NextResponse.json(
      { error: (error1 ?? error2)?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
