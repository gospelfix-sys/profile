import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';
import { siteProfileSchema } from '@/libs/validation/content';
import { parseJsonBody } from '@/libs/http';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('site_profile')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const parsedBody = await parseJsonBody(request);
  if ('error' in parsedBody) return parsedBody.error;
  const parsed = siteProfileSchema.safeParse(parsedBody.data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('site_profile')
    .upsert({
      id: 1,
      ...parsed.data,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
