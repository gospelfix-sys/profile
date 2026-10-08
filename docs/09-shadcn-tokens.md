# 09. shadcn 토큰 전체 레퍼런스

출처: `frontend/src/app/globals.css`. `(dashboard)` 영역에서 Tailwind 유틸리티로 쓰이는 전체 원본 값이다. `admin/`은 Tailwind/shadcn을 쓰지 않으므로 이 토큰이 적용되지 않는다.

> `profile.css`의 주석: "shadcn/ui 네이밍 별칭 — 실제 쓰는 것만 정의. 전체 매핑(`--background`/`--foreground`/`--card` 등)은 지금 당장 참조하는 코드가 없어 `docs/09-shadcn-tokens.md`에 문서로만 남기고 CSS에는 추가하지 않는다." — 즉 이 표는 **브랜드 레이어에는 적용하지 않고 참고용으로만 둔다.**

## 색상 토큰 (oklch)

| 토큰 | Light | Dark | Tailwind 클래스 |
|---|---|---|---|
| `background` / `foreground` | `1 0 0` / `0.145 0 0` | `0.145 0 0` / `0.985 0 0` | `bg-background` / `text-foreground` |
| `card` / `card-foreground` | `1 0 0` / `0.145 0 0` | `0.205 0 0` / `0.985 0 0` | `bg-card` / `text-card-foreground` |
| `popover` / `popover-foreground` | `1 0 0` / `0.145 0 0` | `0.205 0 0` / `0.985 0 0` | `bg-popover` / `text-popover-foreground` |
| `primary` / `primary-foreground` | `0.205 0 0` / `0.985 0 0` | `0.922 0 0` / `0.205 0 0` | `bg-primary` / `text-primary-foreground` |
| `secondary` / `secondary-foreground` | `0.97 0 0` / `0.205 0 0` | `0.269 0 0` / `0.985 0 0` | `bg-secondary` / `text-secondary-foreground` |
| `muted` / `muted-foreground` | `0.97 0 0` / `0.556 0 0` | `0.269 0 0` / `0.708 0 0` | `bg-muted` / `text-muted-foreground` |
| `accent` / `accent-foreground` | `0.97 0 0` / `0.205 0 0` | `0.269 0 0` / `0.985 0 0` | `bg-accent` / `text-accent-foreground` |
| `destructive` | `0.577 0.245 27.325` | `0.704 0.191 22.216` | `bg-destructive` |
| `border` | `0.922 0 0` | `1 0 0 / 10%` | `border-border` |
| `input` | `0.922 0 0` | `1 0 0 / 15%` | `border-input` |
| `ring` | `0.708 0 0` | `0.556 0 0` | `ring-ring` |
| `chart-1`~`chart-5` | `0.87`→`0.269` (0 chroma, 단계적 명도) | 동일 | `bg-chart-1` 등 |
| `sidebar*` | `sidebar`, `sidebar-foreground`, `sidebar-primary(-foreground)`, `sidebar-accent(-foreground)`, `sidebar-border`, `sidebar-ring` | | `bg-sidebar` 등 |

유채색은 `destructive`(레드)와 다크모드의 `sidebar-primary`(`0.488 0.243 264.376` — 블루 계열, 라이트에는 없는 값)뿐. 나머지는 전부 chroma 0(순수 무채색).

## Radius

```css
--radius: 0.625rem; /* 10px, 기준값 — 상세 파생 규칙은 docs/05-radius.md */
```

## 다크모드 적용 방식

> "Dark mode works by overriding the same tokens inside a `.dark` selector."

`darkMode: ['class']`(`tailwind.config.ts`) — `<html>`에 `.dark` 클래스를 토글하는 방식. 현재 `frontend`에 `next-themes`가 설치돼 있지만 토글 UI는 아직 어디에도 노출돼 있지 않다.

## Tailwind 매핑 (`tailwind.config.ts`)

모든 색상이 `colors.*` 아래 `DEFAULT`/`foreground` 쌍으로, `--radius`가 `borderRadius.{lg,md,sm}`으로 매핑돼 있다 — 원본은 [05-radius.md](./05-radius.md), [02-colors.md](./02-colors.md) 참고.
