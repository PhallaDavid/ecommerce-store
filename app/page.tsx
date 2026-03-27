"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Headphones,
  Laptop,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Watch,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

function useCarouselDots(slidesLength: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const apiRef = useRef<any>(null);

  const scrollToSlide = (index: number) => {
    if (apiRef.current && !isTransitioning) {
      setIsTransitioning(true);
      apiRef.current.scrollTo(index);
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    apiRef,
    scrollToSlide,
    isTransitioning,
  };
}

export default function Home() {
  const slides = [
    { text: "Discover the latest trends in fashion", img: "/images/ten11 summer_cate_banner_Ten11.jpg",},
    { text: "Discover the latest trends in fashion", img: "/images/ten11 summer_cate_banner_Ten11.jpg",},
    { text: "Discover the latest trends in fashion", img: "/images/ten11 summer_cate_banner_Ten11.jpg",},
    { text: "Discover the latest trends in fashion", img: "/images/ten11 summer_cate_banner_Ten11.jpg",},
  ];

  const categories = [
    { label: "Fashion", icon: Shirt, href: "/?category=fashion" },
    { label: "Electronics", icon: Smartphone, href: "/?category=electronics" },
    { label: "Accessories", icon: Watch, href: "/?category=accessories" },
    { label: "Audio", icon: Headphones, href: "/?category=audio" },
    { label: "Computers", icon: Laptop, href: "/?category=computers" },
    { label: "Gaming", icon: Gamepad2, href: "/?category=gaming" },
    { label: "New Arrivals", icon: Sparkles, href: "/?category=new" },
    { label: "Essentials", icon: ShoppingBag, href: "/?category=essentials" },
  ] as const;

  const { activeIndex, setActiveIndex, apiRef, scrollToSlide, isTransitioning } = useCarouselDots(slides.length);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (apiRef.current && !isTransitioning) {
        const nextIndex = (activeIndex + 1) % slides.length;
        scrollToSlide(nextIndex);
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, slides.length, isTransitioning, scrollToSlide]);

  // Pause auto-slide on hover
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="py-6">
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Carousel
            className="w-full"
            setApi={(api) => {
              apiRef.current = api;
              if (api) {
                api.on("select", () => {
                  setActiveIndex(api.selectedScrollSnap());
                });
              }
            }}
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl">
                    <img
                      src={slide.img}
                      alt={`Slide ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/35" />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-xl md:text-3xl font-bold transition-all">
                      <div className="text-center px-4">
                        <span className="block animate-in slide-in-from-bottom-2 duration-700 delay-100">
                          {slide.text}
                        </span>
                        <Button
                          className="mt-3 bg-primary text-white hover:bg-primary/90 transition-transform hover:scale-105 duration-300 animate-in slide-in-from-bottom-4 duration-700 delay-200"
                          size="lg"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>

                    {/* DOTS inside banner */}
                    <div className="absolute z-10 bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 animate-in fade-in duration-500">
                      {slides.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() => scrollToSlide(dotIndex)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 border ${
                            activeIndex === dotIndex
                              ? "bg-white border-white scale-110"
                              : "bg-transparent border-white/50 hover:bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* LEFT ARROW inside banner */}
            <CarouselPrevious className="absolute hidden md:inline-flex left-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all duration-300 hover:scale-110 hover:bg-black/60 animate-in fade-in duration-500" />

            {/* RIGHT ARROW inside banner */}
            <CarouselNext className="absolute hidden md:inline-flex right-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all duration-300 hover:scale-110 hover:bg-black/60 animate-in fade-in duration-500" />
          </Carousel>
        </div>

        {/* Top categories (4 visible, swipe for more) */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-base font-semibold tracking-tight">Top Categories</h2>
            <p className="text-base font-semiboldhover:text-primary hover:underline transition-colors text-muted-foreground">
              See All
            </p>
          </div>

          <Carousel
            className="w-full"
            opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
          >
            <CarouselContent>
              {categories.map(({ label, href, icon: Icon }) => (
                <CarouselItem
                  key={label}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4"
                >
                  <Link
                    href={href}
                    className="group flex w-full flex-col items-center rounded-md bg-card  transition-colors"
                    aria-label={label}
                  >
                    <div className="flex w-full aspect-square items-center justify-center rounded-md bg-primary/8 text-primary ">
                      <img src="/images/STU_8189-cr-450x672.jpg" alt="" className="w-full h-full rounded-md" />
                    </div>
                    <div className="mt-3 truncate text-sm font-semibold">
                      {label}
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex -left-6" />
            <CarouselNext className="hidden md:inline-flex -right-6" />
          </Carousel>
        </section>
      </div>
    </div>
  );
}
