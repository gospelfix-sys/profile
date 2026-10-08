import { z } from 'zod';

export const siteProfileSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().min(1),
  subtitle: z.string().min(1),
  company: z.string().min(1),
  company_en: z.string().min(1),
  role_lines: z.array(z.string()),
  tags: z.array(z.string()),
  email: z.string().email(),
  phone: z.string().min(1),
  phone_href: z.string().min(1),
  homepage_url: z.string().min(1),
});

export const businessHourSchema = z.object({
  day: z.number().int().min(0).max(6),
  label: z.string().min(1),
  open_time: z.string().nullable(),
  close_time: z.string().nullable(),
  is_closed: z.boolean(),
});

export const businessHoursBulkSchema = z.array(businessHourSchema).length(7);

export const cardSchema = z.object({
  title: z.string().min(1),
  title_suffix: z.string().default(''),
  subtitle: z.string().min(1),
  date: z.string().default(''),
  info: z.string().min(1),
  link: z.string().min(1),
  tags: z.array(z.string()),
  image_type: z.enum(['image', 'icon']),
  image_url: z.string().nullable(),
  unavailable: z.boolean(),
  unavailable_message: z.string().nullable(),
});
