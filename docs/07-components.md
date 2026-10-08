# 07. 컴포넌트

## 설치된 shadcn 컴포넌트 (`frontend/src/components/ui/`)

스타일: `base-nova` (`components.json` — `@base-ui/react` 기반, `baseColor: "neutral"`, `iconLibrary: "lucide"`)

| 컴포넌트 | 파일 | 비고 |
|---|---|---|
| Avatar | `avatar.tsx` | |
| Button | `button.tsx` | `cva` 기반, variant 6종 / size 8종 (아래 표) |
| Card | `card.tsx` | `ring-1 ring-foreground/10`로 고도감 표현, `size: "default" \| "sm"` |
| Dialog | `dialog.tsx` | QR 공유 시트 등에서 사용 |
| Form | `form.tsx` | **레지스트리에 없어 수동 생성됨** — `react-hook-form` + `@hookform/resolvers`(zod) 연동용 |
| Input | `input.tsx` | |
| Sonner | `sonner.tsx` | 토스트 — `toast` 컴포넌트 대신 이것을 씀 |

이 외 컴포넌트(Select, DropdownMenu, Table, Tabs, Sheet 등)는 **아직 설치돼 있지 않다.** 필요해지면 손으로 새로 만들지 말고 `npx shadcn add <name>`으로 가져온다(GFix Craft 5단계).

## Button variant / size 전체 표

`button.tsx` 실제 정의 기준:

| variant | 용도 |
|---|---|
| `default` | 기본 (`bg-primary`) |
| `outline` | 테두리만 |
| `secondary` | 보조 액션 |
| `ghost` | 배경 없음 |
| `destructive` | 삭제 등 위험 액션 |
| `link` | 텍스트 링크 스타일 |

| size | 높이 |
|---|---|
| `xs` | h-6 |
| `sm` | h-7 |
| `default` | h-8 |
| `lg` | h-9 |
| `icon-xs` / `icon-sm` / `icon` | 정사각형 아이콘 버튼 |

## base-nova 고유 패턴

- **`asChild` prop이 없다.** `@base-ui/react`는 Radix와 달리 이 패턴을 지원하지 않는다. 링크를 버튼처럼 보이게 하려면:
  ```tsx
  // ❌ Radix 스타일 — 이 프로젝트에서 동작 안 함
  <Button asChild><Link href="/x">이동</Link></Button>

  // ✅ base-nova 패턴
  <Link href="/x" className={buttonVariants({ variant: "default" })}>이동</Link>
  ```
- 모든 컴포넌트에 `data-slot="..."` 속성이 붙는다(예: `data-slot="button"`, `data-slot="card"`) — CSS 선택자나 테스트 셀렉터에서 이걸 활용한다.
- `group/button`, `group/card` 같은 Tailwind **named group**을 적극 사용 — 중첩 컴포넌트가 부모 상태(hover 등)에 반응할 때 이 패턴을 따른다.
- 접근성 상태(`aria-invalid`, `aria-expanded`, `data-open`/`data-closed`)에 반응하는 유틸리티 클래스가 이미 base 스타일에 포함돼 있다 — 커스텀 에러 스타일을 따로 만들 필요 없이 `aria-invalid` 속성만 올바르게 설정하면 된다.

## 공개 프로필 페이지 전용 컴포넌트 (`frontend/src/components/profile/`)

shadcn 컴포넌트가 아니라 `profile.css` 토큰으로 직접 스타일링된 사이트 전용 컴포넌트군이다: `ProfileHero`(mode: classic/gradient), `ContactSection`, `SocialSection`, `PortfolioCarousel`/`MinistryCarousel`(+ `CardCarousel`/`CardItem` 공통 베이스), `QrShareSheet`, `BusinessHoursBadge`, `FloatingActions`, `Footer`. 이 컴포넌트들을 수정할 때는 shadcn 토큰이 아니라 [02](./02-colors.md)~[06](./06-elevation.md)의 브랜드 토큰을 따른다.
