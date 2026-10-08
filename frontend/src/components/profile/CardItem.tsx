'use client'

import { toast } from 'sonner'
import type { CardData } from '@/types/profile.types'

// 기존 cards.js의 renderCardHTML 포팅. escapeHtml()은 JSX 자동 이스케이프로 대체되어 불필요.
export default function CardItem({ card }: { card: CardData }) {
  const isExternal = !card.unavailable && card.link.startsWith('http')
  const href = card.unavailable ? '#' : card.link

  return (
    <a
      href={href}
      className={`ministry-card-link${card.unavailable ? ' ministry-card-link--unavailable' : ''}`}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={(e) => {
        if (!card.unavailable) return
        e.preventDefault()
        toast.error(card.unavailableMessage || '현재 이용할 수 없습니다')
      }}
    >
      {card.imageType === 'image' && card.imageUrl && (
        <div className="ministry-card-image has-image">
          <img src={card.imageUrl} alt={card.title} />
        </div>
      )}
      <div className="ministry-card-content">
        <p className="ministry-card-subtitle">{card.subtitle}</p>
        <h3 className="ministry-card-title">
          <span className="highlight">{card.title}</span>
          {card.titleSuffix}
        </h3>
        {card.date && <p className="ministry-card-date">{card.date}</p>}
        <p className="ministry-card-info">{card.info}</p>
        <div className="ministry-card-tags">
          {card.tags.map((tag, i) => (
            <span key={tag} className={`tag ${i === 0 ? 'tag-primary' : 'tag-outline'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
