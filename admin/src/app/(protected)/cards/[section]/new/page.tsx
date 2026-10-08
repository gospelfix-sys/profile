'use client';

import { useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';

import { isCardSection } from '@/types/content.types';
import CardForm, {
  cardFormToPayload,
  EMPTY_CARD_FORM,
  type CardFormState,
} from '@/components/CardForm';

export default function NewCardPage() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  if (!isCardSection(section)) {
    notFound();
  }

  const handleSubmit = async (form: CardFormState) => {
    setPending(true);
    setError('');

    const res = await fetch(`/api/cards/${section}`, {
      method: 'POST',
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

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        새 카드 추가
      </h1>
      <CardForm
        initial={EMPTY_CARD_FORM}
        onSubmit={handleSubmit}
        submitLabel="추가"
        pending={pending}
        error={error}
      />
    </div>
  );
}
