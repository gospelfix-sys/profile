'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import type { CardData } from '@/types/profile.types'
import CardItem from './CardItem'

// 기존 cards.js의 initSwiper() 옵션을 그대로 포팅: slidesPerView:'auto' + CSS의
// .swiper-slide { width: 240px } 조합으로 폭 기준 가로 스와이프 캐러셀을 구성한다.
export default function CardCarousel({ cards, className }: { cards: CardData[]; className: string }) {
  return (
    <Swiper
      modules={[Pagination]}
      className={className}
      slidesPerView="auto"
      spaceBetween={16}
      centeredSlides={false}
      pagination={{ clickable: true }}
    >
      {cards.map((card) => (
        <SwiperSlide key={card.id}>
          <CardItem card={card} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
