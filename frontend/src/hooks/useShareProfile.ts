'use client'

import { toast } from 'sonner'
import { SITE_URL } from '@/lib/site-config'

// 기존 app.js의 handleShare: Web Share API 지원 시 네이티브 공유 시트, 아니면
// 클립보드 복사(execCommand 폴백 포함)로 대체. 토스트는 기존 수작업 .toast 엘리먼트 대신
// 이미 설치된 sonner로 교체.
//
// isSharing은 모듈 스코프 변수다(컴포넌트 내부 useRef 아님) — 원본 app.js의 state.isSharing도
// IIFE 모듈 스코프 전역이라, 히어로 상단바/액션행/플로팅 바 세 곳의 공유 버튼이 이 플래그
// 하나를 같이 참조해 거의 동시 클릭 시 중복 실행을 막았다. useShareProfile()을 호출하는
// 컴포넌트마다 따로 ref를 쓰면 그 중복 방지가 인스턴스별로 쪼개져 깨진다.
let isSharing = false

export function useShareProfile(title: string) {
  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      toast('링크가 복사되었습니다')
    } catch {
      toast('복사에 실패했습니다')
    }
    document.body.removeChild(textArea)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast('링크가 복사되었습니다')
    } catch {
      fallbackCopy(text)
    }
  }

  const share = async () => {
    if (isSharing) return
    isSharing = true

    const shareData = { title, url: SITE_URL }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await copyToClipboard(shareData.url)
      }
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        await copyToClipboard(shareData.url)
      }
    } finally {
      isSharing = false
    }
  }

  return { share }
}
