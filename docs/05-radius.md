# 05. 모서리 반경 (Radius)

## 원칙 (shadcn/ui)

> "`--radius` is the base radius token for your theme. We derive a small radius scale from it so components can use consistent corner sizes while still sharing a single source of truth."

**기준 토큰 하나(`--radius`)에서 나머지를 `calc()`로 파생시킨다.** 개별 단계 값을 직접 덮어쓰지 않는다 — 기준값만 바꾸면 스케일 전체가 비례해서 따라온다. 이 원칙은 이 저장소의 두 레이어 모두에서 동일하게 지켜지고 있다.

---

## 레이어 ① shadcn / 대시보드 영역

출처: `frontend/src/app/globals.css` + `tailwind.config.ts`.

```css
--radius: 0.625rem; /* 10px — 기준값 */
```

```ts
// tailwind.config.ts
borderRadius: {
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)',
}
```

| Tailwind 클래스 | 계산값 |
|---|---|
| `rounded-sm` | 6px |
| `rounded-md` | 8px |
| `rounded-lg` | 10px (기준값 그대로) |

`button.tsx`의 `xs`/`sm` 사이즈는 `rounded-[min(var(--radius-md),10px)]`처럼 **상한을 걸어 파생**하는 패턴도 쓴다 — 기준값이 커져도 작은 버튼의 모서리가 과도하게 둥글어지지 않도록 하는 안전장치다.

## 레이어 ② GospelFix 브랜드 / 공개 프로필 페이지

출처: `profile.css`의 `.gf-profile-page`. 코드 주석에 이 문서를 직접 가리키고 있다:

> "반경 — 기준값(`--radius`)에서 파생. 개별 값을 덮어쓰지 않고 기준값만 조정한다 (`docs/05-radius.md` 참고)"

```css
--radius: 16px; /* 기준값 */
--radius-sm: calc(var(--radius) - 10px);  /* 6px */
--radius-md: calc(var(--radius) - 6px);   /* 10px */
--radius-lg: calc(var(--radius) - 2px);   /* 14px */
--radius-xl: calc(var(--radius) + 4px);   /* 20px */
--radius-full: 9999px;                    /* 완전한 원형/필 모양 */
```

| 토큰 | 계산값 | 대표 용도 |
|---|---|---|
| `--radius-sm` | 6px | 작은 칩 |
| `--radius-md` | 10px | 입력 요소 |
| `--radius-lg` | 14px | 카드 내부 섹션 |
| `--radius-xl` | 20px | 히어로 카드 상단 |
| `--radius-full` | 9999px | 아바타, 배지, 필 버튼 |

## 규칙

- 반경이 필요하면 항상 `var(--radius-*)`(또는 shadcn 레이어라면 `rounded-{sm,md,lg}`)를 쓴다. `border-radius: 12px` 같은 하드코딩 금지.
- 전체 느낌을 더 각지거나 더 둥글게 바꾸고 싶으면 **기준 `--radius` 하나만** 수정한다. 파생 토큰을 개별적으로 고치면 스케일의 비례 관계가 깨진다.
