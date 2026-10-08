'use client';

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { isCardSection, type CardRow } from '@/types/content.types';
import CardForm, {
  cardFormToPayload,
  type CardFormState,
} from '@/components/CardForm';

function rowToForm(row: CardRow): CardFormState {
  return {
    title: row.title,
    title_suffix: row.title_suffix,
    subtitle: row.subtitle,
    date: row.date,
    info: row.info,
    link: row.link,
    tags: row.tags.join(', '),
    image_url: row.image_url ?? '',
    unavailable: row.unavailable,
    unavailable_message: row.unavailable_message ?? '',
  };
}

async function fetchCard(section: string, id: string): Promise<CardRow | null> {
  const res = await fetch(`/api/cards/${section}/${id}`);
  if (!res.ok) throw new Error('카드를 불러오지 못했습니다.');
  const { data } = await res.json();
  return data;
}

export default function EditCardPage() {
  const params = useParams<{ section: string; id: string }>();
  const { section, id } = params;
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['card', section, id],
    queryFn: () => fetchCard(section, id),
    enabled: isCardSection(section),
  });

  if (!isCardSection(section)) {
    notFound();
  }

  const handleSubmit = async (form: CardFormState) => {
    setPending(true);
    setError('');

    const res = await fetch(`/api/cards/${section}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardFormToPayload(form)),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(
        typeof body.error === 'string' ? body.error : '저장에 실패했습니다.',
      );
      setPending(false);
      return;
    }

    router.push(`/cards/${section}`);
  };

  if (isLoading) return <p>불러오는 중...</p>;
  if (!data) return <p>카드를 찾을 수 없습니다.</p>;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        카드 수정
      </h1>
      <CardForm
        initial={rowToForm(data)}
        onSubmit={handleSubmit}
        submitLabel="저장"
        pending={pending}
        error={error}
      />
    </div>
  );
}
