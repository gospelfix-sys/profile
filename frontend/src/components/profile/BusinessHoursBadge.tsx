'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Clock, ChevronDown } from 'lucide-react'
import type { BusinessHourEntry } from '@/types/profile.types'

const formatRange = (entry?: BusinessHourEntry) =>
  entry?.open && entry.close ? `${entry.open} ~ ${entry.close}` : '휴무'

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const isOpenNow = (entry: BusinessHourEntry | undefined, now: Date) => {
  if (!entry?.open || !entry.close) return false
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return nowMinutes >= toMinutes(entry.open) && nowMinutes < toMinutes(entry.close)
}

// 기존 hours.js 포팅. 패널은 .hero-glow-zone의 overflow:hidden을 피해야 해서
// document.body가 아니라(원본과 달리) .gf-profile-page 노드에 포털한다 — profile.css의
// CSS 변수(--color-*, --radius 등)가 .gf-profile-page에 스코프돼 있어 body에 직접
// 포털하면 변수가 상속되지 않기 때문. hours.js처럼 직접 DOM을 쿼리해서 셀프 컨테인드로 동작한다.
export default function BusinessHoursBadge({ hours }: { hours: BusinessHourEntry[] }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [now, setNow] = useState<Date | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setNow(new Date())
    setPortalContainer(document.querySelector<HTMLElement>('.gf-profile-page'))
  }, [])

  const todayDay = now?.getDay() ?? null
  const todayEntry = todayDay !== null ? hours.find((h) => h.day === todayDay) : undefined
  const open = now ? isOpenNow(todayEntry, now) : false

  const positionPanel = () => {
    if (!triggerRef.current || !panelRef.current || !portalContainer) return
    // .panelRef는 position:absolute인데 그 containing block은 .gf-profile-page가 아니라
    // body(profile.css에서 position:relative)다 — 지금은 .gf-profile-page가 body의 유일한
    // 자식이라 두 rect의 좌상단이 우연히 같아서 동작한다. .gf-profile-page에 margin/padding이
    // 붙거나 body에 형제 요소가 생기면 좌표가 어긋난다(QrShareSheet에서 겪은 것과 같은 함정).
    const containerRect = portalContainer.getBoundingClientRect()
    const rect = triggerRef.current.getBoundingClientRect()
    panelRef.current.style.top = `${rect.bottom - containerRect.top + 4}px`
    panelRef.current.style.left = `${rect.left - containerRect.left + rect.width / 2}px`
  }

  useEffect(() => {
    if (!isOpen) return
    positionPanel()

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      ) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('resize', positionPanel)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('resize', positionPanel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const panel = (
    <ul
      ref={panelRef}
      id="heroHoursPanel"
      className={`hero-hours-panel${isOpen ? ' is-open' : ''}`}
      aria-hidden={!isOpen}
    >
      {hours.map((entry) => (
        <li key={entry.day} className={`hero-hours-row${entry.day === todayDay ? ' is-today' : ''}`}>
          <span className="hero-hours-day">{entry.label}</span>
          <span className={`hero-hours-time${entry.open ? '' : ' is-closed'}`}>{formatRange(entry)}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="hero-hours">
      <button
        ref={triggerRef}
        type="button"
        className="hero-hours-trigger"
        aria-expanded={isOpen}
        aria-controls="heroHoursPanel"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((v) => !v)
        }}
      >
        <Clock />
        <span className={`hero-hours-status${now ? (open ? ' is-open' : ' is-closed') : ''}`}>
          {now ? (open ? '영업중' : '영업종료') : ''}
        </span>
        <span className="hero-hours-today">{todayEntry ? formatRange(todayEntry) : ''}</span>
        <ChevronDown className="hero-hours-chevron" />
      </button>
      {portalContainer && createPortal(panel, portalContainer)}
    </div>
  )
}
