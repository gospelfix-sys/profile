import { ExternalLink, Globe, Phone, Share2 as ShareIcon } from 'lucide-react'
import type { HeroMode, SiteProfile, BusinessHourEntry } from '@/types/profile.types'
import HeroBackButton from './HeroBackButton'
import HeroMailtoAction from './HeroMailtoAction'
import ShareButton from './ShareButton'
import BusinessHoursBadge from './BusinessHoursBadge'

function Badge({ profile }: { profile: SiteProfile }) {
  return (
    <div className="profile-hero-badge">
      <div className="profile-hero-badge-text">
        <span className="profile-hero-company">{profile.company}</span>
        <span className="profile-hero-company-en">{profile.companyEn}</span>
      </div>
    </div>
  )
}

function RoleAndTags({ profile }: { profile: SiteProfile }) {
  return (
    <>
      <p className="profile-hero-role">
        {profile.roleLines.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
      <div className="profile-hero-tags">
        {profile.tags.map((tag) => (
          <span key={tag} className="hero-tag">
            {tag}
          </span>
        ))}
      </div>
    </>
  )
}

export default function ProfileHero({
  mode,
  profile,
  hours,
}: {
  mode: HeroMode
  profile: SiteProfile
  hours: BusinessHourEntry[]
}) {
  if (mode === 'classic') {
    return (
      <div className="profile-hero" data-mode="classic">
        <div className="profile-hero-image">
          <img src={profile.imageUrl} alt={`${profile.name} 프로필`} id="profileImg" />
        </div>
        <div className="profile-hero-card">
          <div className="profile-hero-top">
            <h1 className="profile-hero-name">{profile.name}</h1>
            <Badge profile={profile} />
          </div>
          <RoleAndTags profile={profile} />
        </div>
      </div>
    )
  }

  return (
    <div className="profile-hero" data-mode="gradient">
      <div className="hero-glow-zone">
        <video
          className="hero-bg-video"
          src="/video/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-topbar">
          <HeroBackButton />
          <div className="hero-topbar-right">
            <ShareButton
              profileName={profile.name}
              className="hero-icon-btn hero-share-trigger"
              ariaLabel="프로필 공유하기"
            >
              <ShareIcon />
            </ShareButton>
            <a
              href={profile.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-icon-btn"
              aria-label="GospelFix 홈페이지 바로가기"
            >
              <ExternalLink />
            </a>
          </div>
        </div>

        <div className="hero-avatar-wrap">
          <div className="hero-avatar">
            <img src={profile.imageUrl} alt={`${profile.name} 프로필`} id="profileImg" />
          </div>
        </div>

        <h1 className="profile-hero-name">{profile.name}</h1>
        <p className="hero-subtitle">{profile.subtitle}</p>

        <div className="hero-actions">
          <HeroMailtoAction email={profile.email} />
          <a href={profile.phoneHref} className="hero-action">
            <span className="hero-action-icon">
              <Phone />
            </span>
            <span className="hero-action-label">전화</span>
          </a>
          <ShareButton
            profileName={profile.name}
            className="hero-action hero-share-trigger"
            ariaLabel="프로필 공유하기"
          >
            <span className="hero-action-icon">
              <ShareIcon />
            </span>
            <span className="hero-action-label">공유</span>
          </ShareButton>
          <a href={profile.homepageUrl} target="_blank" rel="noopener noreferrer" className="hero-action">
            <span className="hero-action-icon">
              <Globe />
            </span>
            <span className="hero-action-label">홈페이지</span>
          </a>
        </div>

        <BusinessHoursBadge hours={hours} />
      </div>

      <div className="profile-hero-card">
        <div className="profile-hero-top">
          <Badge profile={profile} />
        </div>
        <RoleAndTags profile={profile} />
      </div>
    </div>
  )
}
