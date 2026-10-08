-- GospelFix 프로필 사이트 — 공개 콘텐츠 스키마
-- Supabase 대시보드 SQL Editor에서 그대로 실행하세요.
-- (이 저장소는 로컬 CLI 마이그레이션을 쓰지 않고 대시보드에서 직접 스키마를 관리합니다 — CLAUDE.md 참고)
--
-- 전제: public.profiles 테이블이 이미 존재하고 role TEXT CHECK (role IN ('user','admin')) 컬럼을 가지고 있어야 합니다.
-- (README.md의 "회원가입 시 자동 생성 트리거" 섹션에서 이미 만들어짐)

-- =========================================================
-- 1. 테이블
-- =========================================================

-- 프로필 (단일 레코드 패턴 — id는 항상 1)
CREATE TABLE public.site_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  company TEXT NOT NULL,
  company_en TEXT NOT NULL,
  role_lines TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_href TEXT NOT NULL,
  homepage_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- 영업시간 (요일별 7행, day는 JS Date.getDay() 기준: 0=일 ~ 6=토)
CREATE TABLE public.business_hours (
  day SMALLINT PRIMARY KEY CHECK (day BETWEEN 0 AND 6),
  label TEXT NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 포트폴리오 카드
CREATE TABLE public.portfolio_cards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  title_suffix TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '',        -- 자유 서식 문자열("2026.01.12 - 01.31"), 실제 DATE 타입 아님
  info TEXT NOT NULL,
  link TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_type TEXT NOT NULL DEFAULT 'image' CHECK (image_type IN ('image', 'icon')),
  image_url TEXT,
  icon JSONB,                            -- { viewBox, paths:[], circles:[] } — 현재 미사용, 과거 cards.js 호환용 보존
  unavailable BOOLEAN NOT NULL DEFAULT FALSE,
  unavailable_message TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 교회사역 카드 (portfolio_cards와 컬럼 구조 동일 — cards.js가 두 섹션을 완전히 분리해서
-- 다루므로 category 컬럼으로 통합하지 않고 별도 테이블로 유지)
CREATE TABLE public.ministry_cards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  title_suffix TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  info TEXT NOT NULL,
  link TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_type TEXT NOT NULL DEFAULT 'image' CHECK (image_type IN ('image', 'icon')),
  image_url TEXT,
  icon JSONB,
  unavailable BOOLEAN NOT NULL DEFAULT FALSE,
  unavailable_message TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 2. RLS — 공개 읽기, admin만 쓰기
-- =========================================================

-- 관리자 판별 헬퍼 (여러 테이블에서 재사용, RLS 재귀 방지를 위해 SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON public.site_profile FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.site_profile FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public read" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.business_hours FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public read" ON public.portfolio_cards FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.portfolio_cards FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public read" ON public.ministry_cards FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.ministry_cards FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =========================================================
-- 3. 실행 후 체크
-- =========================================================
-- 1) 소윤호 계정으로 admin 앱 /sign/up 가입
-- 2) Supabase 대시보드 Table Editor에서 public.profiles의 해당 행 role을 'user' → 'admin'으로 수동 변경
--    (이 한 번만 수동으로 하면 됩니다. 트리거로 자동화하지 않습니다.)
