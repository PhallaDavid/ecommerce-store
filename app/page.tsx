"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
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
    { color: "bg-gray-500", text: "Slide 1" },
    { color: "bg-gray-300", text: "Slide 2" },
    { color: "bg-gray-100", text: "Slide 3" },
  ];

  const { activeIndex, setActiveIndex, apiRef, scrollToSlide, isTransitioning } = useCarouselDots(slides.length);

  // Auto-slide functionality
  useEffect(() => {
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
    <div 
      className="flex justify-center py-6  md:px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-7xl px-4 lg:px-8 relative">
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
                <div
                  className={`h-48 sm:h-64 md:h-80  lg:h-96 rounded-2xl ${slide.color} flex flex-col items-center justify-center text-white text-xl md:text-3xl font-bold transition-all relative`}
                >
                  <div className="text-center">
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

                  {/* DOTS inside banner */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 animate-in fade-in duration-500">
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
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all duration-300 hover:scale-110 hover:bg-black/60 animate-in fade-in duration-500" />
          
          {/* RIGHT ARROW inside banner */}
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all duration-300 hover:scale-110 hover:bg-black/60 animate-in fade-in duration-500" />
        </Carousel>
      </div>
    </div>
  );
}