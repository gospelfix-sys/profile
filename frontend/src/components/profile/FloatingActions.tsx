'use client'

import { useEffect } from 'react'
import { Share2 } from 'lucide-react'
import ShareButton from './ShareButton'
import QrShareSheet from './QrShareSheet'

// 기존 app.js의 positionFloatingBtn() 포팅 — position:fixed는 뷰포트 기준이라
// CSS left:50%만으로는 가운데 카드형 레이아웃(.container)과 어긋날 수 있어 JS로 보정한다.
export default function FloatingActions({ profileName }: { profileName: string }) {
  useEffect(() => {
    const positionFloatingBtn = () => {
      const container = document.querySelector('.container')
      const floatingActions = document.querySelector<HTMLElement>('.floating-actions')
      if (!container || !floatingActions) return

      const { left, width } = container.getBoundingClientRect()
      floatingActions.style.left = `${left + 24}px`
      floatingActions.style.width = `${width - 48}px`
      floatingActions.style.transform = 'none'
    }

    positionFloatingBtn()
    window.addEventListener('resize', positionFloatingBtn)
    return () => window.removeEventListener('resize', positionFloatingBtn)
  }, [])

  return (
    <div className="floating-actions">
      <ShareButton profileName={profileName} className="contact-button">
        <Share2 />
        프로필 공유하기
      </ShareButton>
      <QrShareSheet />
    </div>
  )
}
