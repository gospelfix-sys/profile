// supabase-schema.sql 컬럼과 1:1 대응되는 admin 전용 타입. snake_case 그대로 사용
// (frontend/src/types/profile.types.ts의 camelCase 타입과는 별개 — admin은 DB row를 그대로 다룬다)

export interface SiteProfileRow {
  id: number;
  name: string;
  image_url: string;
  subtitle: string;
  company: string;
  company_en: string;
  role_lines: string[];
  tags: string[];
  email: string;
  phone: string;
  phone_href: string;
  homepage_url: string;
  updated_at: string;
  updated_by: string | null;
}

export interface BusinessHourRow {
  day: number;
  label: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  updated_at: string;
}

export type CardSection = 'portfolio' | 'ministry';

export const CARD_TABLES: Record<
  CardSection,
  'portfolio_cards' | 'ministry_cards'
> = {
  portfolio: 'portfolio_cards',
  ministry: 'ministry_cards',
};

export const CARD_SECTION_LABELS: Record<CardSection, string> = {
  portfolio: '포트폴리오',
  ministry: '교회 사역',
};

export function isCardSection(value: string): value is CardSection {
  return value === 'portfolio' || value === 'ministry';
}

export interface CardRow {
  id: number;
  title: string;
  title_suffix: string;
  subtitle: string;
  date: string;
  info: string;
  link: string;
  tags: string[];
  image_type: 'image' | 'icon';
  image_url: string | null;
  icon: unknown | null;
  unavailable: boolean;
  unavailable_message: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
