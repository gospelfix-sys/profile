import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getSupabaseEnv } from './env';

/**
 * 서버 컴포넌트 / API Route / Server Action에서 사용하는 Supabase 클라이언트
 * Next.js cookies()를 통해 세션을 읽고 쓴다
 */
export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서 호출 시 set은 무시됨 (미들웨어가 처리)
          }
        },
      },
    },
  );
}
