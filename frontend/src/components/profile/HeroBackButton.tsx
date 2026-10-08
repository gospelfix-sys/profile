'use client'

import { ChevronLeft } from 'lucide-react'

export default function HeroBackButton() {
  return (
    <button
      type="button"
      className="hero-icon-btn hero-back-btn"
      aria-label="뒤로가기"
      onClick={() => history.back()}
    >
      <ChevronLeft />
    </button>
  )
}
