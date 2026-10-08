import { ChevronRight } from 'lucide-react'
import MailtoConfirmLink from './MailtoConfirmLink'
import type { SiteProfile } from '@/types/profile.types'

export default function ContactSection({ profile }: { profile: SiteProfile }) {
  return (
    <div className="section">
      <h2 className="section-title">연락처</h2>
      <div className="card">
        <MailtoConfirmLink email={profile.email} />
        <a href={profile.phoneHref} className="list-item">
          <span className="item-label">전화번호</span>
          <span className="item-value-group">
            <span className="item-value">{profile.phone}</span>
            <span className="item-arrow">
              <ChevronRight />
            </span>
          </span>
        </a>
      </div>
    </div>
  )
}
