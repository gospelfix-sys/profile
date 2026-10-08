import type { CardData } from '@/types/profile.types'
import CardCarousel from './CardCarousel'

export default function PortfolioCarousel({ cards }: { cards: CardData[] }) {
  return (
    <div className="section portfolio-section">
      <div className="section-header">
        <h2 className="section-title">포트폴리오</h2>
      </div>
      <CardCarousel cards={cards} className="swiper portfolio-swiper" />
    </div>
  )
}
