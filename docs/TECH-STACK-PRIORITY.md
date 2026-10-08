# 기술 스택 & 우선순위

이 문서는 ① 이 저장소에 실제로 설치된 기술 스택 전체 인벤토리와 ② 무언가를 구현할 때 어떤 기술을 먼저 고려해야 하는지의 우선순위를 정리한다.

## 우선순위 원칙

새 기능을 구현하기 전에는 항상 [`.claude/GOSPELFIX.md`](../.claude/GOSPELFIX.md)의 **GFix Craft 9단계 결정 사다리**를 먼저 통과한다:

```
1. [NEED]    지금 이 기능 없으면 동작 안 되나?
2. [EXIST]   frontend/src/lib(hooks/store) 또는 admin/src/libs/ 에 이미 있나?
3. [NEXT]    Next.js 내장 기능으로 처리되나?
4. [SUPA]    Supabase가 처리하나? (Auth, RLS, Storage, Realtime, Edge Functions)
5. [PKG]     아래 "설치된 패키지" 목록으로 되나?
6. [PATTERN] 기존 lib/axios/, lib/supabase/ 패턴 확장으로 되나?
7. [INLINE]  10줄 이하 인라인으로 해결되나?
8. [SHARED]  두 앱 모두 필요한가? (packages/shared/ 현재 미존재)
9. [BUILD]   위 모두 해당 없을 때만: 최소 구현
```

이 문서는 특히 **5단계(PKG)**를 구체화한다 — "이미 뭐가 설치돼 있는지" 매번 package.json을 뒤지지 않도록 아래에 전체 목록을 정리해둔다.

---

## 공통 (두 앱 동일)

| 항목 | 값 |
|---|---|
| 프레임워크 | Next.js **14** (App Router) |
| 언어 | TypeScript 5 |
| 인증/DB | Supabase (`@supabase/ssr` + `@supabase/supabase-js`) |
| 패키지 매니저 | Yarn (스크립트가 `yarn dev`/`yarn build` 전제) |
| 린트 | ESLint 8 + `eslint-config-next` |
| Node 버전 | 명시 안 됨 (`engines` 필드 없음) — Next 14 요구사항(Node 18.17+) 기준으로 맞출 것 |

---

## frontend (포트 3000) — 실제 설치 버전

| 분류 | 패키지 | 버전 |
|---|---|---|
| UI 프리미티브 | `@base-ui/react` | ^1.3.0 |
| UI 프리미티브 | `@radix-ui/react-label`, `@radix-ui/react-slot` | ^2.1.8 / ^1.2.4 |
| 스타일 | `tailwindcss` | ^3.4.1 |
| 스타일 유틸 | `class-variance-authority`, `clsx`, `tailwind-merge` | ^0.7.1 / ^2.1.1 / ^3.5.0 |
| 스타일 애니메이션 | `tailwindcss-animate`, `tw-animate-css` | ^1.0.7 / ^1.4.0 |
| 아이콘 | `lucide-react` | ^1.8.0 |
| 상태 관리 | `recoil` | ^0.7.7 |
| 폼 | `react-hook-form`, `@hookform/resolvers` | ^7.72.1 / ^5.2.2 |
| 검증 | `zod` | **^4.3.6** (실설치 4.6.5) |
| HTTP | `axios` | ^1.15.0 |
| Supabase | `@supabase/ssr`, `@supabase/supabase-js` | ^0.10.2 / ^2.103.0 |
| 테마 | `next-themes` | ^0.4.6 (설치만 됨, 토글 UI 미사용 — [03-typography.md](./03-typography.md) 참고) |
| 토스트 | `sonner` | ^2.0.7 |
| 캐러셀 | `swiper` | ^11.1.14 |
| QR | `qrcode` + `@types/qrcode` | ^1.5.4 |
| shadcn CLI | `shadcn` | ^4.2.0 |

## admin (포트 3001) — 실제 설치 버전

| 분류 | 패키지 | 버전 |
|---|---|---|
| 데이터 패칭 | `@tanstack/react-query` | ^5.45.1 |
| 검증 | `zod` | **^3.22.4** (실설치 3.25.76) |
| HTTP | `axios` | ^1.7.2 |
| Supabase | `@supabase/ssr`, `@supabase/supabase-js` | ^0.5.1 / ^2.45.4 |
| 포맷 | `prettier` + `eslint-plugin-prettier` + `eslint-config-prettier` | ^3.1.1 / ^5.1.0 / ^10.1.1 |

admin은 Tailwind/shadcn/Recoil을 **쓰지 않는다** — 경량 구성이 의도된 설계([CLAUDE.md](../CLAUDE.md) 참고).

---

## ⚠️ 버전 불일치 — 실측 확인됨

두 앱이 독립 배포되는 모노레포이긴 하지만, 아래는 의도된 설계가 아니라 **방치된 드리프트**로 보인다. 새로 건드리기 전에 인지하고 있을 것:

| 패키지 | frontend | admin | 위험도 |
|---|---|---|---|
| `zod` | **v4** (4.6.5) | **v3** (3.25.76) | 높음 — v3→v4는 `.parse()`/에러 포맷 등 breaking change가 있는 메이저 버전차. 두 앱의 zod 스키마 코드는 서로 복붙/공유하면 안 된다 |
| `@supabase/supabase-js` | 2.103.0 | 2.45.4 | 중간 — 마이너 드리프트, API 차이 가능성 낮지만 동일 버전 권장 |
| `@supabase/ssr` | 0.10.2 | 0.5.1 | 중간 — 동일 사유 |
| `axios` | 1.15.0 | 1.7.2 | 낮음 |
| `next` | 14.2.35 | 14.2.3 | 낮음 (둘 다 14.x) |
| lockfile | `yarn.lock` 있음 | **없음** | 높음 — admin은 재설치 시 버전이 고정되지 않는다 |

새 기능 구현 중 이 중 하나를 건드리게 되면(특히 zod), 먼저 사용자에게 두 앱 버전을 맞출지 그대로 둘지 확인할 것 — 조용히 한쪽을 다른 쪽에 맞춰 올리지 않는다.

---

## 새 패키지를 추가하기 전에

1. 위 표에 이미 있는 패키지로 되는가? (GFix Craft 5단계)
2. 정말 새 패키지가 필요하다면: 두 앱 중 어디에 필요한지 먼저 확정 — `admin`에 Tailwind/shadcn류를 끌어오지 않는다(경량 구성 설계를 깨뜨림), `frontend`에 `@tanstack/react-query`처럼 Recoil과 역할이 겹치는 상태관리 라이브러리를 중복 설치하지 않는다.
3. `yarn add` 실행 전에 사용자에게 왜 필요한지, 기존 패키지로 안 되는 이유를 먼저 설명한다.
