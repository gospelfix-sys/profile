'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CARD_SECTION_LABELS,
  isCardSection,
  type CardRow,
} from '@/types/content.types';

async function fetchCards(section: string): Promise<CardRow[]> {
  const res = await fetch(`/api/cards/${section}`);
  if (!res.ok) throw new Error('카드를 불러오지 못했습니다.');
  const { data } = await res.json();
  return data ?? [];
}

export default function CardListPage() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cards', section],
    queryFn: () => fetchCards(section),
    enabled: isCardSection(section),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({
      id,
      direction,
    }: {
      id: number;
      direction: 'up' | 'down';
    }) => {
      const res = await fetch(`/api/cards/${section}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      if (!res.ok) throw new Error('순서 변경에 실패했습니다.');
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['cards', section] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cards/${section}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('삭제에 실패했습니다.');
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['cards', section] }),
  });

  if (!isCardSection(section)) {
    notFound();
  }

  if (isLoading) return <p>불러오는 중...</p>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>
          {CARD_SECTION_LABELS[section]} 카드 관리
        </h1>
        <Link
          href={`/cards/${section}/new`}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: 6,
          }}
        >
          + 새 카드
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(data ?? []).map((card, index) => (
          <div
            key={card.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              opacity: card.unavailable ? 0.6 : 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                type="button"
                disabled={index === 0 || reorderMutation.isPending}
                onClick={() =>
                  reorderMutation.mutate({ id: card.id, direction: 'up' })
                }
                style={{ padding: '2px 8px' }}
              >
                ▲
              </button>
              <button
                type="button"
                disabled={
                  index === (data?.length ?? 0) - 1 || reorderMutation.isPending
                }
                onClick={() =>
                  reorderMutation.mutate({ id: card.id, direction: 'down' })
                }
                style={{ padding: '2px 8px' }}
              >
                ▼
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <strong>{card.title}</strong>
              {card.title_suffix && (
                <span style={{ color: '#6b7280' }}> {card.title_suffix}</span>
              )}
              {card.unavailable && (
                <span style={{ marginLeft: 8, fontSize: 12, color: '#b91c1c' }}>
                  운영종료
                </span>
              )}
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {card.subtitle}
              </div>
            </div>
            <Link href={`/cards/${section}/${card.id}/edit`}>수정</Link>
            <button
              type="button"
              onClick={() => {
                if (confirm('삭제하시겠습니까?'))
                  deleteMutation.mutate(card.id);
              }}
              style={{ backgroundColor: '#dc2626' }}
            >
              삭제
            </button>
          </div>
        ))}
        {(data ?? []).length === 0 && (
          <p style={{ color: '#6b7280' }}>등록된 카드가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
