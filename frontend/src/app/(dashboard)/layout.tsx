import { createClient } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import RecoilProvider from '@/components/providers/RecoilProvider'
import AuthProvider from '@/components/auth/AuthProvider'

// 공개 프로필(루트 "/")은 로그인 상태와 무관하므로 RecoilProvider/AuthProvider를
// 루트 layout.tsx가 아니라 이 (dashboard) 그룹에만 둔다 — 공개 페이지에서 불필요한
// supabase.auth.getSession() 구독이 일어나지 않게 하기 위함.
async function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
    : { data: null }

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardHeader
        email={user?.email ?? ''}
        fullName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilProvider>
      <AuthProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </AuthProvider>
    </RecoilProvider>
  )
}
