# 06. 고도감 (Elevation)

이 저장소는 그림자(box-shadow)를 색조에 따라 두 가지 **의도**로 나눠 쓴다 — 아무 회색 그림자나 쓰지 않는다.

## 레이어 ① shadcn / 대시보드 영역

`card.tsx`, `dialog.tsx` 등 base-nova 컴포넌트는 box-shadow 대신 **`ring`**으로 고도감을 표현하는 경우가 많다:

```
ring-1 ring-foreground/10   /* Card, Dialog content 공통 */
```

Dialog 오버레이는 다음 패턴:

```
fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs
```

즉 그림자보다 **반투명 ring + backdrop-blur**가 이 레이어의 깊이 표현 방식이다. 새 shadcn 컴포넌트를 추가할 때도 이 패턴(ring 우선, box-shadow는 보조)을 따른다.

## 레이어 ② GospelFix 브랜드 / 공개 프로필 페이지

`profile.css`에서 그림자 색은 **용도에 따라 두 색조**를 쓴다:

### 중립 그림자 — 구조적 요소 (카드, 히어로 패널)

```css
box-shadow: 0 8px 32px rgba(20, 21, 26, 0.12);   /* 히어로 카드 */
box-shadow: 0 2px 8px rgba(20, 21, 26, 0.04);    /* 얕은 카드 */
box-shadow: 0 -12px 24px rgba(20, 21, 26, 0.06); /* 하단에서 떠오르는 패널 */
box-shadow: 0 -8px 32px rgba(20, 21, 26, 0.2);   /* QR 바텀시트 */
```

`rgba(20, 21, 26, ...)` — `--color-text`와 같은 중립 톤을 그림자 색으로 재사용한다(별도 그림자 전용 색을 만들지 않음).

### 브랜드 그림자 — 액션/CTA 요소 (버튼, 배지, 아바타)

```css
box-shadow: 0 4px 14px rgba(120, 72, 45, 0.12);   /* 운영시간 배지 */
box-shadow: 0 14px 28px -10px rgba(120, 72, 45, 0.4); /* 아바타 */
box-shadow: 0 6px 16px rgba(120, 72, 45, 0.1);    /* 액션 버튼 */
```

`rgba(120, 72, 45, ...)`는 [02-colors.md](./02-colors.md)의 테라코타 악센트(`--color-hero-glow-2: #d9713f` 계열)를 어둡게 한 값이다 — 인터랙티브 요소일수록 브랜드 색조 그림자를 쓴다는 규칙.

## z-index 스케일 (공개 프로필 페이지)

| 값 | 용도 |
|---|---|
| `0` | 히어로 배경 장식(글로우) |
| `1` | 일반 콘텐츠 레이어 |
| `50` | 히어로 상단 액션바(뒤로가기/공유) |
| `100` | (레이어 상승이 필요한 플로팅 요소) |
| `1000` | 토스트(sonner) |
| `1001` | QR 공유 바텀시트 — 코드 주석: "`.toast`(z-index:1000)보다 위에 뜬다" |

새 오버레이 요소를 추가할 때는 이 스케일 안에서 값을 고르고, 임의의 큰 숫자(`z-index: 9999` 등)를 새로 만들지 않는다.

## 규칙

- 구조적 요소(카드, 패널)는 중립 그림자, 인터랙티브/CTA 요소는 브랜드 그림자 — 이 구분을 유지한다.
- `(dashboard)` 영역에서는 box-shadow보다 `ring-{n} ring-foreground/{opacity}` 패턴을 우선한다.
