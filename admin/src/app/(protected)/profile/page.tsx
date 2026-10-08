'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { SiteProfileRow } from '@/types/content.types';

type FormState = {
  name: string;
  image_url: string;
  subtitle: string;
  company: string;
  company_en: string;
  role_lines: string;
  tags: string;
  email: string;
  phone: string;
  phone_href: string;
  homepage_url: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  image_url: '',
  subtitle: '',
  company: '',
  company_en: '',
  role_lines: '',
  tags: '',
  email: '',
  phone: '',
  phone_href: '',
  homepage_url: '',
};

function rowToForm(row: SiteProfileRow): FormState {
  return {
    name: row.name,
    image_url: row.image_url,
    subtitle: row.subtitle,
    company: row.company,
    company_en: row.company_en,
    role_lines: row.role_lines.join('\n'),
    tags: row.tags.join(', '),
    email: row.email,
    phone: row.phone,
    phone_href: row.phone_href,
    homepage_url: row.homepage_url,
  };
}

async function fetchProfile(): Promise<SiteProfileRow | null> {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('프로필을 불러오지 못했습니다.');
  const { data } = await res.json();
  return data;
}

async function saveProfile(form: FormState) {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form,
      role_lines: form.role_lines
        .split('\n')
        .map((v) => v.trim())
        .filter(Boolean),
      tags: form.tags
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    }),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(typeof error === 'string' ? error : '저장에 실패했습니다.');
  }
  return res.json();
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setForm(rowToForm(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => {
      setMessage('저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    mutation.mutate(form);
  };

  if (isLoading) return <p>불러오는 중...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        프로필 관리
      </h1>
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
          이름
          <input value={form.name} onChange={handleChange('name')} required />
        </label>
        <label>
          프로필 이미지 URL
          <input
            value={form.image_url}
            onChange={handleChange('image_url')}
            required
          />
        </label>
        <label>
          한 줄 소개
          <input
            value={form.subtitle}
            onChange={handleChange('subtitle')}
            required
          />
        </label>
        <label>
          회사(한글)
          <input
            value={form.company}
            onChange={handleChange('company')}
            required
          />
        </label>
        <label>
          회사(영문)
          <input
            value={form.company_en}
            onChange={handleChange('company_en')}
            required
          />
        </label>
        <label>
          직함 목록 (줄바꿈으로 구분)
          <textarea
            value={form.role_lines}
            onChange={handleChange('role_lines')}
            rows={3}
          />
        </label>
        <label>
          태그 (쉼표로 구분)
          <input value={form.tags} onChange={handleChange('tags')} />
        </label>
        <label>
          이메일
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
          />
        </label>
        <label>
          전화번호(표시용)
          <input value={form.phone} onChange={handleChange('phone')} required />
        </label>
        <label>
          전화번호(tel: 링크)
          <input
            value={form.phone_href}
            onChange={handleChange('phone_href')}
            required
          />
        </label>
        <label>
          홈페이지 URL
          <input
            value={form.homepage_url}
            onChange={handleChange('homepage_url')}
            required
          />
        </label>
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
