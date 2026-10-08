import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 세션 쿠키를 자동으로 갱신하기 위한 미들웨어 클라이언트
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 이 미들웨어는 모든 요청(공개 "/" 페이지 포함)에서 실행되지만 하는 일은 (dashboard)
  // 영역의 세션 쿠키 갱신뿐 — 리다이렉트 등 보안 경계가 아니다. Phase 2(Supabase 연동) 전까지는
  // 환경변수가 비어 있을 수 있으므로, 없으면 조용히 건너뛴다(크래시 시 공개 페이지까지 막힌다).
  if (!url || !anonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 토큰 자동 갱신 (리다이렉트 없음)
  await supabase.auth.getUser()

  return supabaseResponse
}
