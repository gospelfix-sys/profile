# 02. 색상

## 원칙 (shadcn/ui)

> "We use semantic background and foreground pairs. The base token controls the surface color and the `-foreground` token controls the text and icon color that sits on that surface."

즉 색은 항상 **표면(배경) + 그 위의 글자색**이 쌍으로 움직인다. `bg-primary`를 쓰면 반드시 `text-primary-foreground`와 짝지어 쓴다 — 임의의 텍스트 색을 새로 만들지 않는다.

---

## 레이어 ① shadcn 표준 (대시보드/관리 영역)

출처: `frontend/src/app/globals.css`. 전체 원본 값은 [09-shadcn-tokens.md](./09-shadcn-tokens.md) 참고. 핵심만 요약:

- 전부 **oklch** 색공간, **무채색(neutral, chroma 0)** 베이스 — `components.json`의 `baseColor: "neutral"`과 일치
- 유일한 유채색은 `--destructive`(oklch 0.577 0.245 27.325 — 레드)
- 다크모드는 같은 변수를 `.dark` 셀렉터 안에서 재정의하는 방식(라이트/다크가 1:1 대응)
- `admin/` 앱은 Tailwind/shadcn을 쓰지 않으므로 이 레이어가 적용되지 않는다 — frontend `(dashboard)` 전용

## 레이어 ② GospelFix 브랜드 (공개 프로필 페이지)

출처: `frontend/src/styles/profile.css`의 `.gf-profile-page` 스코프. **px 기반 HEX/rgba**, `:root`가 아닌 클래스 스코프라는 점이 shadcn 레이어와 가장 큰 차이.

### 중립 색상 (라이트 전용 — 다크모드 미정의)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#f4f5f7` | 페이지 배경 |
| `--color-surface` | `#ffffff` | 카드/표면 |
| `--color-chip-bg` | `#eef0f3` | 태그/칩 배경 |
| `--color-border` | `rgba(20,21,26,0.08)` | 기본 테두리 |
| `--color-border-strong` | `rgba(20,21,26,0.14)` | 강조 테두리 |
| `--color-text` | `#14151a` | 본문 텍스트 |
| `--color-text-secondary` | `rgba(20,21,26,0.55)` | 보조 텍스트 |
| `--color-text-muted` | `rgba(20,21,26,0.35)` | 비활성/플레이스홀더 |
| `--color-positive` | `#1f9d55` | 긍정 상태(영업중 등) |

### 브랜드 악센트 — 테라코타 그라데이션

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-hero-glow-1` | `#f0a878` | 히어로 배경 그라데이션 시작 |
| `--color-hero-glow-2` | `#d9713f` | 히어로 배경 그라데이션 중간 (가장 진함) |
| `--color-hero-glow-3` | `#c98a6a` | 히어로 배경 그라데이션 끝 |

`ProfileHero`는 `mode="classic" | "gradient"` 두 가지로 렌더링되며(`data-mode` 속성으로 분기), 이 악센트 색은 `mode="gradient"`에서만 쓰인다. `classic` 모드는 전체 프로필 사진 배경이라 별도 악센트 색이 필요 없다.

CTA/배지류의 그림자에는 이 악센트의 어두운 축(`rgba(120, 72, 45, ...)`, 테라코타를 어둡게 한 값)을 쓴다 — 자세한 내용은 [06-elevation.md](./06-elevation.md).

---

## 규칙

- 공개 프로필 페이지(`.gf-profile-page` 하위) 작업 중에는 **레이어 ②**만 쓴다. shadcn의 `bg-primary` 등을 끌어오면 안 된다(토큰 이름이 겹치지 않아 깨지진 않지만, 두 디자인 언어가 섞여 일관성이 무너진다).
- `(dashboard)` 영역 작업 중에는 **레이어 ①**만 쓴다.
- 새 색이 필요하면 하드코딩하지 말고 해당 레이어에 토큰을 추가한 뒤 `var(--token)`으로 참조한다.
