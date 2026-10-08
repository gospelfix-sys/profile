# 04. 간격 (Spacing)

## 레이어 ① shadcn / 대시보드 영역

별도 간격 토큰이 없다 — Tailwind 기본 spacing scale(`p-4`, `gap-2`, `px-6` 등)을 그대로 쓴다. 관찰된 실사용 패턴:

- `(dashboard)/layout.tsx`: 컨테이너 `max-w-5xl px-6 py-8`
- shadcn 컴포넌트(`card.tsx`, `dialog.tsx`): `gap-4`, `p-4`, `py-4` 등 4 단위 배수

새 대시보드 UI를 만들 때는 이 Tailwind 기본값을 그대로 따르면 된다 — 별도 토큰을 만들지 않는다(GFix Craft 5단계: 설치된 도구로 이미 해결됨).

## 레이어 ② GospelFix 브랜드 / 공개 프로필 페이지

출처: `profile.css`의 `.gf-profile-page`. 4px 기준 스케일.

| 토큰 | 값 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |

Tailwind의 기본 spacing scale(4px 단위)과 숫자 네이밍이 호환되도록 맞춰져 있다(`--space-4` = Tailwind `4` = 16px) — 다만 이 토큰은 Tailwind 클래스가 아니라 `profile.css` 안에서 `var(--space-N)`으로 직접 쓰인다.

## 규칙

- 공개 프로필 페이지 안에서 간격이 필요하면 `--space-*` 토큰을 쓰고, 스케일에 없는 임의의 px 값(`13px`, `18px` 등)을 새로 만들지 않는다.
- 스케일에 없는 간격이 정말 필요하다면 먼저 왜 기존 스케일로 안 되는지 확인한다(GFix Craft 7단계: 10줄 이하 인라인이 아니라 디자인 시스템 확장이 필요한 수준인지부터 판단).
