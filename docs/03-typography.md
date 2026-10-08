# 03. 타이포그래피

## 폰트 패밀리

### Pretendard — 실제 사용 중 (공개 프로필 페이지)

`frontend/src/styles/profile.css`에서 `@font-face`로 직접 로드(`/fonts/Pretendard-*.woff2`, `frontend/public/fonts/`). 한글 최적화 폰트.

| weight | 값 |
|---|---|
| Regular | 400 |
| Medium | 500 |
| SemiBold | 600 |
| Bold | 700 |
| ExtraBold | 800 |

`.gf-profile-page` 하위 전체가 이 폰트를 쓴다.

### Geist — 설치돼 있으나 미연결 (주의)

`frontend/src/app/fonts/GeistVF.woff`, `GeistMonoVF.woff` 파일이 존재하지만, `next/font`로 로드하는 코드도 `tailwind.config.ts`의 `fontFamily` 확장도 없다. `globals.css`에는 다음과 같이 선언돼 있다:

```css
.theme {
  --font-heading: var(--font-sans);
  --font-sans: var(--font-sans);
}
```

`--font-sans`가 자기 자신을 참조하는 순환 정의라 **실제로는 아무 값도 설정되지 않는다** — `html { @apply font-sans; }`는 결국 Tailwind 기본 시스템 폰트 스택으로 폴백된다. 즉 `(dashboard)` 영역은 지금 의도한 커스텀 폰트 없이 브라우저 기본 sans-serif로 렌더링되고 있다.

**이 문서를 읽는 사람에게:** Geist 폰트를 실제로 쓰려면 `next/font/local`로 `fonts/GeistVF.woff`를 로드해 `--font-sans` 변수에 연결하는 작업이 필요하다 — 파일만 있고 배선이 안 된 상태다. 없애거나 연결하거나, 둘 중 하나를 결정해야 한다(GFix Craft 1단계 NEED 재확인 대상).

---

## 타입 스케일 — GospelFix 브랜드 레이어

출처: `profile.css`의 `.gf-profile-page`. shadcn 레이어(`globals.css`)에는 별도 타입 스케일이 정의돼 있지 않다 — Tailwind 기본 `text-sm`/`text-base` 등을 그대로 쓴다.

| 토큰 | 값 | 비고 |
|---|---|---|
| `--text-xs` | 10px | 배지, 캡션 |
| `--text-sm` | 12px | 보조 텍스트 |
| `--text-md` | 13px | 본문 보조 |
| `--text-base` | 15px | 기본 본문 |
| `--text-lg` | 16px | 강조 본문 |
| `--text-xl` | 20px | 소제목 |
| `--text-2xl` | 24px | 제목 |
| `--text-3xl` | 28px | 히어로 이름 등 최상위 제목 |

### 행간(line-height)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--leading-tight` | 1.25 | 제목 |
| `--leading-snug` | 1.4 | 소제목 |
| `--leading-base` | 1.5 | 본문 |
| `--leading-loose` | 1.7 | 긴 설명 텍스트 |

## 규칙

- `(dashboard)` 영역: Tailwind 유틸리티(`text-sm`, `text-base` 등) 그대로 사용.
- 공개 프로필 페이지: 위 `--text-*`/`--leading-*` 토큰만 사용, px를 직접 쓰지 않는다.
- 새 폰트를 추가하기 전에 Geist 미사용 건을 먼저 정리할 것 — 쓰지 않을 폰트 파일을 두 벌 유지할 이유가 없다(GFix Craft 1단계).
