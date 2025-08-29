"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import { SparklesIcon } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { Badge } from "@/components/ui/badge";

export const CardSwipe = ({
  children,
  autoplayDelay = 1500,
  slideShadows = false,
}) => {
  const css = `
  .swiper {
    width: 350px;
    max-width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `;

  return (
    <section className="w-ace-y-4">
      <style>{css}</style>
      <div className="flex w-full items-center justify-center gap-4">
        <div className="w-full">
          <Swiper
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
            }}
            effect={"cards"}
            grabCursor={true}
            loop={true}
            slidesPerView={"auto"}
            rewind={true}
            cardsEffect={{
              slideShadows: slideShadows,
            }}
            modules={[EffectCards, Autoplay, Pagination, Navigation]}
          >
            {children.map((child, index) => (
              <SwiperSlide key={index}>
                <div className="size-full rounded-3xl">{child}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
