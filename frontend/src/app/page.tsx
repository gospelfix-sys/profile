// Phase 1: 픽스처 데이터로 기존 정적 사이트를 1:1 포팅한 공개 프로필 페이지.
// Phase 2에서 이 import를 Supabase 서버사이드 조회로 교체한다 (plan 2-3절).
import { SITE_PROFILE, BUSINESS_HOURS, PORTFOLIO_CARDS, MINISTRY_CARDS } from '@/lib/profile-data'
import ProfileHero from '@/components/profile/ProfileHero'
import ContactSection from '@/components/profile/ContactSection'
import SocialSection from '@/components/profile/SocialSection'
import PortfolioCarousel from '@/components/profile/PortfolioCarousel'
import MinistryCarousel from '@/components/profile/MinistryCarousel'
import Footer from '@/components/profile/Footer'
import FloatingActions from '@/components/profile/FloatingActions'

export default function HomePage() {
  return (
    <div className="gf-profile-page">
      <div className="container">
        <ProfileHero mode="gradient" profile={SITE_PROFILE} hours={BUSINESS_HOURS} />

        <ContactSection profile={SITE_PROFILE} />
        <SocialSection profile={SITE_PROFILE} />

        <p className="catchphrase">
          심플함 속에 강력함을 담다 — 이제 &apos;AI 자동화&apos;로 도약할 시간입니다.
        </p>

        <PortfolioCarousel cards={PORTFOLIO_CARDS} />
        <MinistryCarousel cards={MINISTRY_CARDS} />

        <Footer />
      </div>

      {/* container 바깥에 있어야 position:fixed가 뷰포트 기준으로 동작한다 */}
      <FloatingActions profileName={SITE_PROFILE.name} />
    </div>
  )
}
