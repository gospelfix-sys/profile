'use client'

import { useShareProfile } from '@/hooks/useShareProfile'

// hero 상단바 아이콘, hero 액션 행, 하단 플로팅 바 세 군데서 전부 재사용한다
// (기존 .hero-share-trigger 클래스가 여러 엘리먼트에 붙어 querySelectorAll로 일괄
// 바인딩되던 것과 동일한 재사용 의도). 마크업은 children으로 호출부가 결정한다.
export default function ShareButton({
  profileName,
  className,
  ariaLabel,
  children,
}: {
  profileName: string
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}) {
  const { share } = useShareProfile(profileName)

  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={share}>
      {children}
    </button>
  )
}
