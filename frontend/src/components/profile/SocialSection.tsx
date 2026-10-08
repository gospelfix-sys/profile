import { ChevronRight } from 'lucide-react'
import type { SiteProfile } from '@/types/profile.types'

export default function SocialSection({ profile }: { profile: SiteProfile }) {
  return (
    <div className="section">
      <h2 className="section-title">소셜</h2>
      <div className="card">
        <a href={profile.homepageUrl} className="list-item" target="_blank" rel="noopener noreferrer">
          <span className="item-label">GospelFix 홈페이지</span>
          <span className="item-value-group">
            <span className="item-value">gospelfix.vercel.app/layer</span>
            <span className="item-arrow">
              <ChevronRight />
            </span>
          </span>
        </a>
        <a href="https://instagram.com/gospelfix_creative" className="list-item" target="_blank" rel="noopener noreferrer">
          <span className="item-label">Instagram</span>
          <span className="item-value-group">
            <span className="item-value">@gospelfix_creative</span>
            <span className="item-arrow">
              <ChevronRight />
            </span>
          </span>
        </a>
        <a href="https://pf.kakao.com/_CqKlX?from=qr" className="list-item" target="_blank" rel="noopener noreferrer">
          <span className="item-label">카카오 채널</span>
          <span className="item-value-group">
            <span className="item-value">pf.kakao.com/_CqKlX</span>
            <span className="item-arrow">
              <ChevronRight />
            </span>
          </span>
        </a>
      </div>
    </div>
  )
}
