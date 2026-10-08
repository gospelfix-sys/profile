'use client';

import { useState } from 'react';

export type CardFormState = {
  title: string;
  title_suffix: string;
  subtitle: string;
  date: string;
  info: string;
  link: string;
  tags: string;
  image_url: string;
  unavailable: boolean;
  unavailable_message: string;
};

export const EMPTY_CARD_FORM: CardFormState = {
  title: '',
  title_suffix: '',
  subtitle: '',
  date: '',
  info: '',
  link: '',
  tags: '',
  image_url: '',
  unavailable: false,
  unavailable_message: '',
};

export function cardFormToPayload(form: CardFormState) {
  return {
    title: form.title,
    title_suffix: form.title_suffix,
    subtitle: form.subtitle,
    date: form.date,
    info: form.info,
    link: form.link,
    tags: form.tags
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
    // icon 타입은 지원 UI가 없어(스키마상 과거 cards.js 호환용 보존 필드) 항상 'image'만 쓴다.
    image_type: 'image' as const,
    image_url: form.image_url || null,
    unavailable: form.unavailable,
    unavailable_message: form.unavailable
      ? form.unavailable_message || null
      : null,
  };
}

export default function CardForm({
  initial,
  onSubmit,
  submitLabel,
  pending,
  error,
}: {
  initial: CardFormState;
  onSubmit: (form: CardFormState) => void;
  submitLabel: string;
  pending: boolean;
  error: string;
}) {
  const [form, setForm] = useState<CardFormState>(initial);

  const handleChange =
    (key: keyof CardFormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 480,
      }}
    >
      <label>
        제목
        <input value={form.title} onChange={handleChange('title')} required />
      </label>
      <label>
        제목 접미사
        <input
          value={form.title_suffix}
          onChange={handleChange('title_suffix')}
        />
      </label>
      <label>
        부제목
        <input
          value={form.subtitle}
          onChange={handleChange('subtitle')}
          required
        />
      </label>
      <label>
        날짜 표기
        <input
          value={form.date}
          onChange={handleChange('date')}
          placeholder="예: 2026.01.12 - 01.31"
        />
      </label>
      <label>
        설명
        <textarea
          value={form.info}
          onChange={handleChange('info')}
          rows={3}
          required
        />
      </label>
      <label>
        링크 URL
        <input value={form.link} onChange={handleChange('link')} required />
      </label>
      <label>
        태그 (쉼표로 구분)
        <input value={form.tags} onChange={handleChange('tags')} />
      </label>
      <label>
        이미지 URL
        <input value={form.image_url} onChange={handleChange('image_url')} />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={form.unavailable}
          onChange={handleChange('unavailable')}
        />
        운영 종료(클릭 시 안내 토스트만 표시, 링크 이동 안 함)
      </label>
      {form.unavailable && (
        <label>
          안내 메시지
          <input
            value={form.unavailable_message}
            onChange={handleChange('unavailable_message')}
            placeholder="예: 계약만료되어서 더이상 운영하지 않습니다."
          />
        </label>
      )}
      {error && <p style={{ fontSize: 14, color: 'red' }}>{error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? '저장 중...' : submitLabel}
      </button>
    </form>
  );
}
