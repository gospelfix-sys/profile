'use client'

import { Mail } from 'lucide-react'

export default function HeroMailtoAction({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="hero-action hero-mailto-btn"
      onClick={(e) => {
        if (!confirm(`${email}으로 이메일을 보내시겠습니까?`)) {
          e.preventDefault()
        }
      }}
    >
      <span className="hero-action-icon">
        <Mail />
      </span>
      <span className="hero-action-label">이메일</span>
    </a>
  )
}
