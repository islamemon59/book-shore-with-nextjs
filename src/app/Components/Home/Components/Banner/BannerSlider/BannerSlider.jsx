"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function BannerSlider({ slides }) {
  return (
    <div className="w-full h-[80vh] relative">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        speed={1200}
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              {/* Slide Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id === 1} // preload first slide
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Content */}
              <div className="relative z-10 max-w-2xl text-center px-4 space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-base-100 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-[var(--color-secondary)]">
                  {slide.subtitle}
                </p>
                <button className="px-6 py-2 mt-4 rounded-lg shadow-lg transition bg-primary hover:bg-secondary text-white">
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
