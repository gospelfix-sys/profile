// (dashboard) 영역은 아직 Phase 2(Supabase 연동) 전이라 환경변수가 비어 있을 수 있다.
// 공개 "/" 페이지는 lib/supabase/middleware.ts가 이미 안전하게 건너뛰지만, server.ts/client.ts는
// (dashboard)/layout.tsx 등에서 그대로 호출된다. admin의 env.ts와 달리 프로덕션에서도 무조건
// 더미로 대체한다 — frontend의 (dashboard)는 아직 아무 기능도 없는 미사용 스캐폴드라 지키고
// 있는 보안 경계가 없고(admin의 CMS 쓰기 권한과 다름), 환경변수를 깜빡해도 공개 사이트 방문자가
// 엉뚱하게 /dashboard로 들어갔다가 500을 보는 것보단 조용히 무력화되는 쪽이 낫다.
// TODO: (dashboard)에 실제 기능이 들어가면 admin/src/libs/supabase/env.ts처럼
// NODE_ENV==='production'에서는 던지도록 바꿀 것 — 그래야 배포 설정 누락이 조용히
// 묻히지 않는다.
const DEV_FALLBACK_URL = 'http://127.0.0.1:54321'
const DEV_FALLBACK_ANON_KEY = 'local-dev-placeholder-anon-key'

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && anonKey) {
    return { url, anonKey }
  }

  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY가 비어있어 더미 값으로 대체합니다. (dashboard) 기능은 동작하지 않습니다.'
  )

  return { url: DEV_FALLBACK_URL, anonKey: DEV_FALLBACK_ANON_KEY }
}
