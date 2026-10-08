// 로컬 개발 중 Supabase를 아직 연결하지 않았을 때 createClient()가 즉시 크래시하지 않도록
// 하는 더미 값. 프로덕션(Vercel)에서는 절대 쓰이지 않는다 — 실제 환경변수가 없으면 그대로
// 크래시해서 배포 설정 누락을 바로 드러내야 하기 때문에 NODE_ENV==='production'에서는
// 폴백하지 않는다. 127.0.0.1은 존재하지 않는 .supabase.co 도메인과 달리 연결이 즉시
// 거부되어(ECONNREFUSED) 요청이 DNS 타임아웃으로 오래 멈추지 않는다.
const DEV_FALLBACK_URL = 'http://127.0.0.1:54321';
const DEV_FALLBACK_ANON_KEY = 'local-dev-placeholder-anon-key';

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    return { url, anonKey };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.",
    );
  }

  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY가 비어있어 로컬 더미 값으로 대체합니다. 실제 로그인/DB 조회는 동작하지 않습니다.',
  );

  return { url: DEV_FALLBACK_URL, anonKey: DEV_FALLBACK_ANON_KEY };
}
