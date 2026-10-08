# 01. 스타일 레퍼런스

> 이 문서 세트(`docs/01`~`docs/09`)는 이 저장소의 디자인 아이덴티티를 정의한다. 디자인 철학은 **shadcn/ui**를 따른다.

## 참고 자료

- 공식 사이트: https://ui.shadcn.com/
- 테마 문서: https://ui.shadcn.com/docs/theming

## shadcn/ui 디자인 철학 (5원칙)

이 저장소의 `frontend/components.json`(`style: "base-nova"`)이 직접 채택하고 있는 철학이다. 원문은 shadcn/ui 공식 문서에서 그대로 인용한다.

| 원칙 | 원문 | 의미 |
|---|---|---|
| **Open Code** | "The top layer of your component code is open for modification." | 컴포넌트를 블랙박스 라이브러리가 아니라 `src/components/ui/`에 복사된 내 코드로 다룬다. 스타일 오버라이드가 아니라 코드 자체를 고친다. |
| **Composition** | "Every component uses a common, composable interface, making them predictable." | 모든 컴포넌트가 `data-slot`, `cn()`, `cva` 같은 공통 패턴을 공유해 예측 가능하다. |
| **Distribution** | "A flat-file schema and command-line tool make it easy to distribute components." | `npx shadcn add`로 컴포넌트를 받아오는 평면 파일 구조. 직접 손으로 복붙하지 않는다. |
| **Beautiful Defaults** | "Carefully chosen default styles, so you get great design out-of-the-box." | 토큰(색/라디우스/타이포)만 바꿔도 기본값 자체가 이미 정돈돼 있어야 한다. |
| **AI-Ready** | "Open code for LLMs to read, understand, and improve." | 코드가 공개돼 있고 패턴이 일관되므로 Claude 같은 도구가 안전하게 수정/확장할 수 있다. |

## 이 저장소에 존재하는 두 개의 디자인 레이어

이 문서 세트를 읽기 전에 반드시 구분해야 할 사실: **이 저장소에는 디자인 토큰 체계가 두 개 공존한다.**

1. **shadcn 표준 레이어** — `frontend/src/app/globals.css`의 `:root`/`.dark`에 정의된 oklch 기반 토큰(`--background`, `--primary` 등). `(dashboard)` 영역과 향후 shadcn 컴포넌트를 쓰는 모든 곳에 적용된다. → [`09-shadcn-tokens.md`](./09-shadcn-tokens.md)
2. **GospelFix 브랜드 레이어** — `frontend/src/styles/profile.css`의 `.gf-profile-page` 스코프에 정의된 자체 토큰(따뜻한 테라코타 계열, px 기반 타입/스페이싱/라디우스 스케일). 공개 프로필 페이지(`/`)에만 적용된다.

두 레이어는 **의도적으로 분리**돼 있다 — `profile.css`에 "`:root`가 아니라 `.gf-profile-page`로 스코프함... 신규 shadcn 요소인 QR Dialog의 radius/ring이 틀어진다"는 주석이 명시돼 있다. 공개 사이트 작업 중에는 브랜드 레이어를, 대시보드/관리 영역 작업 중에는 shadcn 레이어를 참조할 것 — 둘을 섞으면 안 된다.

## 문서 구성

| 파일 | 내용 |
|---|---|
| [02-colors.md](./02-colors.md) | 색상 토큰 (shadcn + 브랜드) |
| [03-typography.md](./03-typography.md) | 폰트, 타입 스케일 |
| [04-spacing.md](./04-spacing.md) | 간격 스케일 |
| [05-radius.md](./05-radius.md) | 모서리 반경 스케일 |
| [06-elevation.md](./06-elevation.md) | 그림자, z-index |
| [07-components.md](./07-components.md) | 설치된 shadcn 컴포넌트 인벤토리 |
| [08-guidelines.md](./08-guidelines.md) | 사용 규칙, 금지 패턴 |
| [09-shadcn-tokens.md](./09-shadcn-tokens.md) | shadcn 원본 토큰 전체 레퍼런스 |
