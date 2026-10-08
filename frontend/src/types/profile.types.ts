export type HeroMode = 'classic' | 'gradient'

export interface SiteProfile {
  name: string
  imageUrl: string
  subtitle: string
  company: string
  companyEn: string
  roleLines: string[]
  tags: string[]
  email: string
  phone: string
  phoneHref: string
  homepageUrl: string
}

// day: JS Date.prototype.getDay() 기준(0=일 ~ 6=토). open/close가 null이면 휴무.
export interface BusinessHourEntry {
  day: number
  label: string
  open: string | null
  close: string | null
}

export interface CardIcon {
  viewBox: string
  paths?: string[]
  circles?: { cx: number; cy: number; r: number }[]
}

export interface CardData {
  id: number
  title: string
  titleSuffix: string
  subtitle: string
  date: string
  info: string
  link: string
  tags: string[]
  imageType: 'image' | 'icon'
  imageUrl: string | null
  icon?: CardIcon | null
  unavailable: boolean
  unavailableMessage: string | null
}
