'use client'

import { ChevronRight } from 'lucide-react'

export default function MailtoConfirmLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="list-item"
      onClick={(e) => {
        if (!confirm(`${email}으로 이메일을 보내시겠습니까?`)) {
          e.preventDefault()
        }
      }}
    >
      <span className="item-label">이메일</span>
      <span className="item-value-group">
        <span className="item-value">{email}</span>
        <span className="item-arrow">
          <ChevronRight />
        </span>
      </span>
    </a>
  )
}
