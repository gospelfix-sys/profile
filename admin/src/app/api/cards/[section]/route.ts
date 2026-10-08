import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';
import { CARD_TABLES, isCardSection } from '@/types/content.types';
import { cardSchema } from '@/libs/validation/content';
import { parseJsonBody } from '@/libs/http';

export async function GET(
  _request: Request,
  { params }: { params: { section: string } },
) {
  if (!isCardSection(params.section)) {
    return NextResponse.json(
      { error: '존재하지 않는 섹션입니다.' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from(CARD_TABLES[params.section])
    .select('*')
    .order('sort_order');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(
  request: Request,
  { params }: { params: { section: string } },
) {
  if (!isCardSection(params.section)) {
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

  const table = CARD_TABLES[params.section];
  const { data: maxRow } = await supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from(table)
    .insert({ ...parsed.data, sort_order: nextSortOrder })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
