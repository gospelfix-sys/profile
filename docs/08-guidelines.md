# 08. 가이드라인

## 레이어를 먼저 판단한다

작업을 시작하기 전에 항상 먼저 질문: **공개 프로필 페이지(`/`)인가, `(dashboard)`/`admin` 영역인가?**

| | 공개 프로필 페이지 | `(dashboard)` / `admin` |
|---|---|---|
| 토큰 출처 | `profile.css` (`.gf-profile-page`) | `globals.css` (`:root`/`.dark`) |
| 색상 | [02](./02-colors.md) 브랜드 팔레트 | [09](./09-shadcn-tokens.md) shadcn 팔레트 |
| 타이포 | Pretendard, px 스케일 | Tailwind 기본, rem 스케일 |
| 컴포넌트 | `components/profile/*` | `components/ui/*` (shadcn) |

두 레이어를 섞지 않는다 — 공개 페이지에 `bg-primary`를 쓰거나, 대시보드에 `var(--color-hero-glow-1)`을 쓰지 않는다.

## 하드코딩 금지

색상 HEX, px 간격, px 반경, 임의의 box-shadow 값을 직접 쓰지 않는다. 항상 해당 레이어의 토큰(`var(--...)` 또는 shadcn Tailwind 클래스)을 참조한다. 스케일에 맞는 토큰이 없다면 — 정말 없는지 먼저 [02](./02-colors.md)~[06](./06-elevation.md)을 확인한 뒤에 추가한다.

## base-nova 함정

- `<Button asChild>` 없음 → `<Link className={buttonVariants()}>` 패턴 ([07](./07-components.md) 참고)
- `toast()`는 `sonner`에서 가져온다, 별도 Toast 컴포넌트를 만들지 않는다
- 새 UI 프리미티브가 필요하면 손으로 만들기 전에 `npx shadcn add`부터 시도한다(GFix Craft 5단계)

## 라디우스/스페이싱은 기준값만 조정

[05-radius.md](./05-radius.md) 원칙과 동일하게, 간격·반경 스케일 전체의 "느낌"을 바꾸고 싶을 땐 파생 토큰 각각이 아니라 기준 토큰(`--radius`, 또는 스케일 비율) 하나만 조정한다.

## 다크모드

- shadcn 레이어(`globals.css`)는 `.dark` 클래스로 다크모드가 **이미 정의돼 있다.**
- GospelFix 브랜드 레이어(`profile.css`)는 **다크모드가 정의돼 있지 않다** — 라이트 전용. 공개 프로필 페이지에 다크모드를 추가하는 건 디자인 결정이 필요한 별도 작업이다. 먼저 필요성부터 확인할 것(GFix Craft 1단계) — `next-themes`가 `frontend`에 설치는 돼 있지만 현재 어디서도 다크모드 토글을 노출하지 않는다.

## 접근성

- `a:focus-visible`, `button:focus-visible`에 `outline: 2px solid var(--ring)` 패턴이 이미 적용돼 있다(`profile.css`) — 마우스 클릭 시에는 나타나지 않고 키보드 포커스에서만 보인다. 새 인터랙티브 요소를 만들 때 이 아웃라인이 사라지지 않게 할 것.
- base-nova 컴포넌트는 `aria-invalid`, `aria-expanded` 등에 반응하는 스타일이 기본 내장돼 있다 — 커스텀 에러/확장 상태 스타일을 중복으로 만들지 않는다.

## 새 디자인 토큰을 추가하기 전에

GFix Craft 9단계 사다리를 그대로 적용한다 — 특히:
1. 기존 스케일(이 문서 세트 02~06)에 이미 있는 값으로 되는가?
2. Tailwind 기본값으로 되는가? (대시보드 영역)
3. 두 앱 모두 필요한 변경인가, 공개 페이지만의 변경인가? → 레이어를 확실히 구분해서 추가
