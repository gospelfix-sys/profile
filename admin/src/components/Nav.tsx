'use client';

import Link from 'next/link';

import { createClient } from '@/libs/supabase/client';

const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/profile', label: '프로필' },
  { href: '/hours', label: '영업시간' },
  { href: '/cards/portfolio', label: '포트폴리오 카드' },
  { href: '/cards/ministry', label: '사역 카드' },
];

export default function Nav({ email }: { email: string }) {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/sign/in';
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} style={{ fontSize: 14 }}>
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{email}</span>
        <button
          type="button"
          onClick={handleSignOut}
          style={{ backgroundColor: '#6b7280' }}
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
