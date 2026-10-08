import { createClient } from '@/libs/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        GospelFix Admin
      </h1>
      <p style={{ color: '#6b7280' }}>안녕하세요, {user?.email}</p>
    </div>
  );
}
