import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { getSupabaseEnv } from './env';

/**
 * 미들웨어 전용 Supabase 클라이언트
 * 요청/응답 객체에서 쿠키를 읽고 써서 세션을 자동 갱신한다
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          // 요청 쿠키 업데이트
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // 응답 쿠키 업데이트
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 세션 갱신 (토큰 자동 refresh)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
