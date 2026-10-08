import { ChevronRight } from 'lucide-react'
import type { CardData } from '@/types/profile.types'
import CardCarousel from './CardCarousel'

export default function MinistryCarousel({ cards }: { cards: CardData[] }) {
  return (
    <div className="section ministry-section">
      <div className="section-header">
        <h2 className="section-title">교회 사역</h2>
        <a
          href="https://www.notion.so/GBC-Developer-18a611d7cbb080cd8fc3f51bce514606?source=copy_link"
          className="section-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          개발팀 소개
          <ChevronRight />
        </a>
      </div>
      <CardCarousel cards={cards} className="swiper ministry-swiper" />
    </div>
  )
}
