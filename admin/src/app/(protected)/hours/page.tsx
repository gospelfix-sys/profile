'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BusinessHourRow } from '@/types/content.types';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function defaultHours(): BusinessHourRow[] {
  return DAY_LABELS.map((label, day) => ({
    day,
    label,
    open_time: null,
    close_time: null,
    is_closed: false,
    updated_at: '',
  }));
}

async function fetchHours(): Promise<BusinessHourRow[]> {
  const res = await fetch('/api/hours');
  if (!res.ok) throw new Error('영업시간을 불러오지 못했습니다.');
  const { data } = await res.json();
  return data ?? [];
}

async function saveHours(rows: BusinessHourRow[]) {
  const res = await fetch('/api/hours', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      rows.map(({ day, label, open_time, close_time, is_closed }) => ({
        day,
        label,
        open_time,
        close_time,
        is_closed,
      })),
    ),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(typeof error === 'string' ? error : '저장에 실패했습니다.');
  }
  return res.json();
}

export default function HoursPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['hours'],
    queryFn: fetchHours,
  });
  const [rows, setRows] = useState<BusinessHourRow[]>(defaultHours());
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data && data.length === 7) setRows(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: saveHours,
    onSuccess: () => {
      setMessage('저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['hours'] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const updateRow = (day: number, patch: Partial<BusinessHourRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.day === day ? { ...row, ...patch } : row)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    mutation.mutate(rows);
  };

  if (isLoading) return <p>불러오는 중...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        영업시간 관리
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 560,
        }}
      >
        {rows.map((row) => (
          <div
            key={row.day}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ width: 24 }}>{row.label}</span>
            <input
              type="time"
              value={row.open_time ?? ''}
              disabled={row.is_closed}
              onChange={(e) =>
                updateRow(row.day, { open_time: e.target.value || null })
              }
            />
            <span>~</span>
            <input
              type="time"
              value={row.close_time ?? ''}
              disabled={row.is_closed}
              onChange={(e) =>
                updateRow(row.day, { close_time: e.target.value || null })
              }
            />
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={row.is_closed}
                onChange={(e) =>
                  updateRow(row.day, {
                    is_closed: e.target.checked,
                    ...(e.target.checked
                      ? { open_time: null, close_time: null }
                      : {}),
                  })
                }
              />
              휴무
            </label>
          </div>
        ))}
        {message && (
          <p
            style={{ fontSize: 14, color: mutation.isError ? 'red' : 'green' }}
          >
            {message}
          </p>
        )}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  );
}
