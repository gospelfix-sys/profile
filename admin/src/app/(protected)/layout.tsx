import type { ReactNode } from 'react';

import { createClient } from '@/libs/supabase/server';
import QueryProvider from '@/components/QueryProvider';
import Nav from '@/components/Nav';

// 인증 리다이렉트 자체는 middleware.ts가 이미 처리한다(이 레이아웃까지 도달한 요청은
// 항상 로그인 상태) — 여기서는 Nav에 표시할 이메일만 조회한다.
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <QueryProvider>
      <Nav email={user?.email ?? ''} />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px' }}>
        {children}
      </main>
    </QueryProvider>
  );
}
