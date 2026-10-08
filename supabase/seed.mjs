// GospelFix 프로필 사이트 — 1회성 초기 데이터 주입 스크립트
// schema.sql을 Supabase 대시보드에서 먼저 실행한 뒤, 로컬에서 한 번만 실행하세요.
// 어느 앱의 node_modules에도 의존하지 않도록 PostgREST REST API를 fetch로 직접 호출합니다(Node 18+).
//
// 실행 방법:
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... node supabase/seed.mjs
//
// service role key는 RLS를 모두 우회하므로 반드시 로컬에서만 쓰고 커밋/배포 환경에 넣지 마세요.
// 카드 두 테이블은 INSERT만 수행합니다 — 이미 데이터가 있는 상태에서 다시 실행하면 중복 생성되니
// 1회만 실행하거나, 재실행 전 Supabase 대시보드에서 해당 테이블을 직접 비우세요.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

// frontend/src/lib/profile-data.ts(Phase 1 픽스처)를 그대로 옮긴 원본 데이터.
// 배열 순서 = 화면 표시 순서이며 sort_order로 그대로 들어간다(기존 id 필드는 쓰지 않음 — DB가 새로 발급).

const SITE_PROFILE = {
  id: 1,
  name: '소윤호',
  image_url: '/images/propil_v1.avif',
  subtitle: 'GospelFix 대표 · AI Agent 자동화 솔루션',
  company: 'GospelFix',
  company_en: 'AI AGENT AUTOMATION',
  role_lines: ['가스펄픽스(GospelFix) 대표'],
  tags: ['AI 챗봇 예약 시스템', '1:1 문의', '온라인 서비스', '홈페이지', '쇼핑몰'],
  email: 'thdbsgh3443@kakao.com',
  phone: '010-3388-2024',
  phone_href: 'tel:010-3388-2024',
  homepage_url: 'https://gospelfix.vercel.app/layer',
};

const BUSINESS_HOURS = [
  { day: 1, label: '월요일', open_time: '09:00', close_time: '22:30', is_closed: false },
  { day: 2, label: '화요일', open_time: '09:00', close_time: '22:30', is_closed: false },
  { day: 3, label: '수요일', open_time: '09:00', close_time: '22:30', is_closed: false },
  { day: 4, label: '목요일', open_time: '09:00', close_time: '22:30', is_closed: false },
  { day: 5, label: '금요일', open_time: null, close_time: null, is_closed: true },
  { day: 6, label: '토요일', open_time: '09:00', close_time: '14:00', is_closed: false },
  { day: 0, label: '일요일', open_time: null, close_time: null, is_closed: true },
];

const PORTFOLIO_CARDS = [
  {
    title: '고품격대패',
    title_suffix: '',
    subtitle: '대패의 격이 다르다',
    date: '',
    info: '고품격대패 공식 웹사이트',
    link: 'https://xn--i89a2dz9q2p1bhpb.com/',
    tags: ['프랜차이즈', '외식업'],
    image_type: 'image',
    image_url: '/images/portfolio/gopoomgyeok.avif',
    unavailable: false,
    unavailable_message: null,
  },
  {
    title: '예작음악신문사',
    title_suffix: '',
    subtitle: '무대가 가장 좋은 스승이다.',
    date: '',
    info: '예작음악신문사 공식 웹사이트',
    link: 'http://yezakeumak.com',
    tags: ['음악', '신문사'],
    image_type: 'image',
    image_url: '/images/portfolio/yezakeumak.avif',
    unavailable: true,
    unavailable_message: '계약이 만료되어 더 이상 운영하지 않습니다.',
  },
  {
    title: 'Dear Tint Santa',
    title_suffix: '',
    subtitle: '크리스마스 감성을 담은 브랜드',
    date: '',
    info: 'Dear Tint Santa 공식 스토어',
    link: 'https://deartintsanta.com',
    tags: ['브랜드', '쇼핑몰'],
    image_type: 'image',
    image_url: '/images/portfolio/deartintsanta.avif',
    unavailable: false,
    unavailable_message: null,
  },
];

const MINISTRY_CARDS = [
  {
    title: '홀리윈 2026',
    title_suffix: '',
    subtitle: '전도 대상자 기도',
    date: '2026.10.24 (토)',
    info: '전도 대상자를 등록하고 함께 기도해요',
    link: 'https://gbc-sys.github.io/holy.win.2026/',
    tags: ['홀리윈', '전도'],
    image_type: 'image',
    image_url: '/images/portfolio/holywin.avif',
    unavailable: false,
    unavailable_message: null,
  },
  {
    title: '몽골 단기선교',
    title_suffix: '',
    subtitle: '몽골 사역 프로젝트',
    date: '2026.06.28 - 07.04',
    info: '몽골 단기선교팀 소식과 기도 요청을 확인하세요',
    link: 'https://mongolia-employment.vercel.app/',
    tags: ['몽골', '단기선교'],
    image_type: 'image',
    image_url: '/images/portfolio/mongolia.avif',
    unavailable: false,
    unavailable_message: null,
  },
  {
    title: 'LOVE in Action',
    title_suffix: '',
    subtitle: '강청 수련회',
    date: '2026.01.12 - 01.31',
    info: '강남중앙침례교회 청년부 온라인 서비스',
    link: 'https://gbc-sys.github.io/gangcheong/exaction',
    tags: ['수련회', '신청하기'],
    image_type: 'image',
    image_url: '/images/cards/thumbnail-1.png',
    unavailable: false,
    unavailable_message: null,
  },
  {
    title: '사랑의 언어 도장판',
    title_suffix: '',
    subtitle: 'LOVE in Action',
    date: '2026.02.06 - 02.08',
    info: '5가지 사랑의 언어로 미션을 완료하세요',
    link: 'https://gbc-sys.github.io/gangcheong/mission',
    tags: ['미션', '도장판'],
    image_type: 'image',
    image_url: '/images/cards/thumbnail-2.png',
    unavailable: false,
    unavailable_message: null,
  },
];

async function postgrest(path, { method = 'POST', body, prefer } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${path} 실패 (${res.status}): ${text}`);
  }

  return res.status === 204 ? null : res.json();
}

async function seedSiteProfile() {
  await postgrest('site_profile?on_conflict=id', {
    body: SITE_PROFILE,
    prefer: 'resolution=merge-duplicates,return=representation',
  });
  console.log('✓ site_profile 주입 완료');
}

async function seedBusinessHours() {
  await postgrest('business_hours?on_conflict=day', {
    body: BUSINESS_HOURS,
    prefer: 'resolution=merge-duplicates,return=representation',
  });
  console.log('✓ business_hours 주입 완료');
}

async function seedCards(table, rows) {
  const payload = rows.map((row, index) => ({ ...row, sort_order: index }));
  await postgrest(table, { body: payload, prefer: 'return=representation' });
  console.log(`✓ ${table} 주입 완료 (${payload.length}건)`);
}

async function main() {
  await seedSiteProfile();
  await seedBusinessHours();
  await seedCards('portfolio_cards', PORTFOLIO_CARDS);
  await seedCards('ministry_cards', MINISTRY_CARDS);
  console.log('모든 초기 데이터 주입이 끝났습니다.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
