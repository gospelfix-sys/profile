# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 성격

`service.supabase.v2` 스타터킷(`docs/PRD.md`, `docs/ROADMAP.md` 참고 — Supabase 인증 + 사용자/관리자 분리 모노레포) 위에, 소윤호(GospelFix 대표)의 **공개 프로필/포트폴리오 사이트**를 얹은 저장소다. 두 레이어가 공존한다는 점이 가장 먼저 알아야 할 사실이다.

- **공개 레이어**: `frontend`의 루트(`/`)는 인증과 무관한 정적 프로필 페이지(`src/app/page.tsx`) — 히어로, 연락처, 포트폴리오/사역 카드 캐러셀, QR 공유 등. 현재는 `src/lib/profile-data`의 픽스처 데이터를 쓰는 **Phase 1(정적 사이트 1:1 포팅)** 상태이고, Phase 2에서 Supabase 조회로 교체될 예정이다. 실제 콘텐츠 테이블(`site_profile`, `business_hours`, `portfolio_cards`, `ministry_cards`)은 `supabase/schema.sql`에 이미 정의돼 있고, `admin`에는 이를 관리하는 `(protected)/cards`, `(protected)/hours`, `(protected)/profile` 페이지와 대응 API 라우트가 이미 구현돼 있다.
- **스타터킷 레이어**: `frontend`의 `(auth)/login`, `(auth)/register`, `(dashboard)/dashboard`와 `admin`의 사용자/역할 관리 기능. `docs/ROADMAP.md`에 Phase별 완료 상태가 추적된다 — frontend의 로그인/회원가입 라우트는 아직 기능이 비어있는 스캐폴드이고, `(dashboard)` 영역도 "아무 기능도 없는 미사용 스캐폴드"(코드 주석 원문)다.

작업 전에 어떤 레이어를 건드리는지 먼저 구분할 것. 공개 프로필 쪽 콘텐츠/카드 작업이라면 `supabase/schema.sql` + admin의 `cards`/`hours`/`profile` 라우트를 기준으로, 인증/대시보드 스타터킷 작업이라면 `docs/ROADMAP.md`의 Phase 2/3 미완료 항목을 기준으로 삼는다.

## 프로젝트 구조

```
profile/
├── frontend/    # 사용자 앱 (포트 3000)
├── admin/       # 관리자 앱 (포트 3001)
├── docs/        # PRD.md, ROADMAP.md, TECH-STACK-PRIORITY.md, 디자인 아이덴티티 문서(01~09)
└── supabase/    # schema.sql, seed.mjs — Supabase 관련 작업/SQL은 전부 이 폴더에 모은다
```

Supabase 스키마는 **대시보드에서 직접 관리**한다(로컬 CLI 마이그레이션 미사용). 새 테이블/컬럼이 필요하면 `supabase/schema.sql`에 추가하고 Supabase 대시보드 SQL Editor에서 직접 실행한다.

---

## 개발 철학 — GFix Craft

이 프로젝트는 **GospelFix 개발 철학**을 따른다. 코드를 작성하기 전 반드시 9단계 결정 사다리를 통과해야 한다.
상세 원칙: [`.claude/GOSPELFIX.md`](.claude/GOSPELFIX.md)

```
1. [NEED]    지금 이 기능 없으면 동작 안 되나?
2. [EXIST]   frontend/src/lib(hooks/store) 또는 admin/src/libs/ 에 이미 있나?
3. [NEXT]    Next.js 내장 기능으로 처리되나? (Server Actions, Route Handlers 등)
4. [SUPA]    Supabase가 처리하나? (Auth, RLS, Storage, Realtime, Edge Functions)
5. [PKG]     설치된 패키지로 되나? (zod, react-hook-form, shadcn/ui, recoil 등)
6. [PATTERN] 기존 lib/axios/, lib/supabase/ 패턴 확장으로 되나?
7. [INLINE]  10줄 이하 인라인으로 해결되나?
8. [SHARED]  두 앱 모두 필요한가? (packages/shared/ 현재 미존재)
9. [BUILD]   위 모두 해당 없을 때만: 최소 구현
```

스킬은 `.claude/skills/gfix-*/`에, 슬래시 커맨드는 `.claude/commands/gfix-*.md`에 위치한다. `/gfix-help`로 전체 커맨드 목록을 확인할 수 있다.

---

## 명령어

두 앱 모두 루트에 통합 package.json이 없으므로 각 디렉터리에서 개별 실행한다. 둘 다 테스트 스크립트는 정의돼 있지 않다.

### frontend/
```bash
cd frontend
yarn dev      # 개발 서버 (포트 3000)
yarn build    # 프로덕션 빌드 + TypeScript 검사
yarn lint     # ESLint
```

### admin/
```bash
cd admin
yarn dev      # 개발 서버 (포트 3001)
yarn build    # 프로덕션 빌드
yarn pretty   # Prettier 포맷 (src/**/*.{ts,js,tsx,jsx})
```

---

## frontend/ 아키텍처

**기술 스택:** Next.js 14 (App Router) · Tailwind CSS v3 · shadcn/ui (base-nova) · Recoil · Axios · @supabase/ssr

### 인증 흐름과 그 한계

```
브라우저 요청
  → middleware.ts              # 모든 요청 인터셉트 (정적 자산 제외)
  → lib/supabase/middleware.ts # updateSession() — 세션 쿠키 갱신만 수행
```

**중요:** frontend의 `updateSession()`은 **리다이렉트를 하지 않는다** — 세션 쿠키 갱신만 한다(코드 주석: "리다이렉트 등 보안 경계가 아니다"). `/dashboard` 보호나 `/login`↔`/dashboard` 리다이렉트는 아직 구현돼 있지 않다(`docs/ROADMAP.md` Phase 2 미완료 항목). admin과 달리 frontend는 이 부분이 아직 스캐폴드 상태라는 걸 전제하고 작업할 것.

서버 컴포넌트는 `lib/supabase/server.ts`의 `createClient()` (async, `await cookies()`)를 사용. 클라이언트 컴포넌트는 `lib/supabase/client.ts`의 `createClient()`를 사용.

`lib/supabase/env.ts`는 환경변수가 없을 때 **프로덕션에서도 무조건** 더미 값으로 조용히 폴백한다 — admin과 반대 동작이다(아래 admin 섹션 참고). 이유는 코드 주석에 명시: `(dashboard)`가 아직 미사용 스캐폴드라 지킬 보안 경계가 없고, 공개 프로필 페이지 방문자가 환경변수 누락으로 500을 보는 것보다 조용히 무력화되는 게 낫기 때문. `(dashboard)`에 실제 기능이 들어가면 admin 패턴(프로덕션에서 throw)으로 바꿔야 한다는 TODO가 남아있다.

### 상태 관리 (Recoil)

`RecoilProvider`/`AuthProvider`는 루트 `layout.tsx`가 아니라 **`(dashboard)` 그룹에만** 적용돼 있다 — 공개 프로필 페이지(`/`)에서 불필요한 `supabase.auth.getSession()` 구독이 일어나지 않게 하기 위한 의도적 설계다. 공개 페이지 작업 중에 Recoil 상태가 안 보인다면 이게 원인이다.

`AuthProvider`가 `supabase.auth.onAuthStateChange()`를 구독하여 Recoil atoms를 동기화:
- `store/atoms/authAtom.ts` — `sessionAtom`, `authUserAtom`, `authLoadingAtom`
- `store/atoms/userAtom.ts` — `userProfileAtom`
- `store/atoms/uiAtom.ts` — `sidebarOpenAtom`, `toastAtom`

커스텀 훅 `useAuth()`(`hooks/useAuth.ts`), `useUser()`(`hooks/useUser.ts`)로 접근.

### Axios 인스턴스

`lib/axios/interceptors.ts`가 매 요청마다 Supabase `access_token`을 `Authorization: Bearer` 헤더에 자동 주입(요청 인터셉터에서 `supabase.auth.getSession()` 호출). 401 응답 시 `refreshSession()` 후 원요청 재시도, 실패 시 `window.location.href = '/login'`로 하드 리다이렉트.

### shadcn/ui 주의사항

- **base-nova 스타일** 사용 — `@base-ui/react` 기반으로 `asChild` prop 없음(실제로 `button.tsx`에 없음을 확인함)
- 링크 버튼은 `<Button asChild>` 대신 `<Link className={buttonVariants()}>` 패턴 사용
- `form` 컴포넌트는 레지스트리에 없어 `src/components/ui/form.tsx`에 수동 생성됨
- `toast`는 `sonner`로 처리 (`frontend/package.json`에 실제 의존성 있음, `components/profile/QrShareSheet.tsx`·`CardItem.tsx`·`hooks/useShareProfile.ts`에서 사용 중) — 루트 `layout.tsx`에 `<Toaster position="bottom-center">` 전역 마운트됨
- `tailwind.config.ts`에 모든 shadcn CSS 변수가 `var(--color-name)` 형태로 매핑돼 있음

---

## admin/ 아키텍처

**기술 스택:** Next.js 14 (App Router) · @tanstack/react-query · Axios · @supabase/ssr · Prettier (+ eslint-plugin-prettier)

Tailwind, Recoil, shadcn/ui 미사용. 경량 관리자 전용 구성이며, 데이터 패칭은 `components/QueryProvider.tsx`로 감싼 `@tanstack/react-query`를 쓴다.

### 라우트

- `/sign/in`, `/sign/up`, `/auth/callback` — 공개
- `(protected)/cards`, `(protected)/hours`, `(protected)/profile` — 공개 프로필 사이트의 콘텐츠(포트폴리오/사역 카드, 영업시간, 사이트 프로필) 관리, 대응 API는 `api/cards/[section]/`, `api/hours/`, `api/profile/`
- 그 외 모든 경로 — 보호 (비인증 시 `/sign/in` 리다이렉트)

frontend와 달리 admin의 `middleware.ts`는 **실제로 리다이렉트를 수행**한다 — `updateSession()`이 `{ supabaseResponse, user }`를 반환하고, 미들웨어가 `user` 유무로 `/sign/in`↔`/` 리다이렉트를 직접 결정한다.

### admin vs frontend 차이점 (헷갈리기 쉬운 부분)

| | frontend | admin |
|---|---|---|
| 디렉터리 | `src/lib/` | `src/libs/` |
| `cookies()` 호출 | `await cookies()` (async) | `cookies()` (sync) |
| 미들웨어 리다이렉트 | 없음 (세션 갱신만) | 있음 |
| env 폴백(`env.ts`) | 프로덕션에서도 항상 더미로 폴백 | 프로덕션에서는 throw (env 누락을 숨기지 않음) |

---

## 환경변수

```env
# frontend/.env.local, admin/.env.local 동일
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

로컬에서 비워두면 `127.0.0.1:54321` + 더미 anon key로 폴백한다(두 앱의 `env.ts` 공통, ECONNREFUSED로 빠르게 실패하도록 의도된 값).

---

## Supabase 스키마

전체 DDL은 `supabase/schema.sql`(공개 콘텐츠: `site_profile`/`business_hours`/`portfolio_cards`/`ministry_cards`, RLS는 공개 읽기 + `is_admin()` 기반 관리자 쓰기)에 있다. 인증 기반 `profiles` 테이블과 `handle_new_user()` 트리거는 `docs/PRD.md` 4절에 정의돼 있다. 스키마를 바꿀 때는 Supabase 대시보드 SQL Editor에서 직접 실행하고, 변경 내용을 `supabase/schema.sql`에도 반영한다.

시드 스크립트: `supabase/seed.mjs`.

**컨벤션**: Supabase 관련 작업(스키마, 시드, 마이그레이션 노트 등)은 앞으로 전부 `supabase/`에 둔다 — `docs/`에는 두지 않는다.
