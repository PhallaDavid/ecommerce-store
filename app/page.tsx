"use client";

import Link from "next/link";
import { NewArrivalsProducts } from "@/components/NewArrivalsProducts";
import { NewCollection } from "@/components/NewCollection";
import { ImageBanners } from "@/components/ImageBanner";
import { PromotionProducts } from "@/components/PromotionProducts";
import { TopBrands } from "@/components/TopBrands";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import api from "@/utils/axios";
import { useState, useEffect, useRef } from "react";
import { Category, Banner, PaginatedResponse } from "@/types/api";

import { useLanguage } from "@/components/LanguageProvider";
import { fixImageUrl } from "@/lib/store";

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
  const { t } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState<string | null>(null);

  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const slidesLength = bannersLoading ? 4 : Math.max(1, banners.length);
  const { activeIndex, setActiveIndex, apiRef, scrollToSlide, isTransitioning } = useCarouselDots(slidesLength);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBannersLoading(true);
      setBannersError(null);
      try {
        const res = await api.get<Banner[]>("/banners");
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setBanners(list.filter((b) => b.status === "active").map(b => ({ ...b, image: fixImageUrl(b.image) })));
      } catch (e: unknown) {
        if (cancelled) return;
        setBanners([]);
        setBannersError(e instanceof Error ? e.message : t("common.error"));
      } finally {
        if (!cancelled) setBannersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await api.get<PaginatedResponse<Category>>("/categories");
        if (cancelled) return;

        // Handle both paginated and non-paginated (legacy) responses
        const rawData = res.data && "data" in res.data 
          ? res.data.data 
          : (Array.isArray(res.data) ? res.data : [])

        const data = rawData.map((c: any) => ({ ...c, avatar: fixImageUrl(c.avatar) }))
        setTopCategories(data.slice(0, 12));
      } catch (e: unknown) {
        if (cancelled) return;
        setTopCategories([]);
        setCategoriesError(e instanceof Error ? e.message : t("common.error"));
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  // Pause auto-slide on hover
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (apiRef.current && !isTransitioning) {
        const nextIndex = (activeIndex + 1) % slidesLength;
        scrollToSlide(nextIndex);
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, slidesLength, isTransitioning, scrollToSlide, isHovered]);

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
              {bannersLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={`skeleton-${index}`}>
                      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-md border bg-muted/60 animate-pulse" />
                    </CarouselItem>
                  ))
                : banners.length === 0 ? (
                    <CarouselItem key="empty-banner">
                      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-md border bg-muted/40">
                        <div className="absolute inset-0 bg-linear-to-b from-muted/30 to-muted/60" />
                        <div className="relative z-10 h-full flex items-center justify-center p-6">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-foreground">
                              {t("home.noBanners")}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {t("home.addBanners")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ) : (
                    banners.map((banner) => (
                    <CarouselItem key={banner.id}>
                      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-md">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/35" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-xl md:text-3xl font-bold transition-all">
                          <div className="text-center px-4">
                            <span className="block animate-in slide-in-from-bottom-2 duration-700 delay-100">
                              {banner.title}
                            </span>
                            {banner.description ? (
                              <p className="mt-2 text-sm md:text-base font-medium text-white/90 max-w-xl mx-auto">
                                {banner.description}
                              </p>
                            ) : null}
                            <Button
                              className="mt-3 bg-primary text-white hover:bg-primary-50/90 transition-transform hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-200"
                              size="lg"
                            >
                              {t("home.shopNow")}
                            </Button>
                          </div>
                        </div>

                        {/* DOTS inside banner */}
                        <div className="absolute z-10 bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 animate-in fade-in duration-500">
                          {Array.from({ length: slidesLength }).map((_, dotIndex) => (
                            <button
                              key={dotIndex}
                              onClick={() => scrollToSlide(dotIndex)}
                              className={`relative h-2 rounded-full transition-all duration-300 ${
                                activeIndex === dotIndex
                                  ? "w-6 bg-white"
                                  : "w-2 bg-white/40 hover:bg-white/70"
                              }`}
                            >
                              {activeIndex === dotIndex ? (
                                <span className="absolute inset-0 rounded-full bg-white/40 blur-sm" />
                              ) : null}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CarouselItem>
                  )))}
            </CarouselContent>

            {/* LEFT ARROW inside banner */}
            <CarouselPrevious className="absolute hidden md:inline-flex left-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all hover:scale-110 animate-in fade-in duration-500" />

            {/* RIGHT ARROW inside banner */}
            <CarouselNext className="absolute hidden md:inline-flex right-4 top-1/2 -translate-y-1/2 z-10 text-white p-2 bg-black/30 rounded-full hover:bg-black/50 transition-all hover:scale-110 animate-in fade-in duration-500" />
          </Carousel>

          {bannersError ? (
            <div className="mt-3 rounded-md border bg-card p-3 text-sm text-destructive">
              {bannersError}
            </div>
          ) : null}
        </div>

        {/* Top categories (4 visible, swipe for more) */}
	        <section className="space-y-3">
	          <div className="flex items-end justify-between">
	            <h2 className="text-base font-semibold tracking-tight">{t("home.topCategories")}</h2>
	            <Link
	              href="/categories"
	              className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
	            >
	              {t("home.seeAll")}
	            </Link>
		          </div>

              {categoriesError ? (
                <div className="rounded-md border bg-card p-3 text-sm text-destructive">
                  {categoriesError}
                </div>
              ) : null}

	          <Carousel
	            className="w-full"
	            opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
	          >
	            <CarouselContent>
	              {categoriesLoading
	                ? Array.from({ length: 6 }).map((_, i) => (
	                    <CarouselItem
	                      key={i}
	                      className="basis-1/2 sm:basis-1/3 md:basis-1/6"
	                    >
	                      <div className="flex w-full p-2 flex-col items-center rounded-md bg-card">
	                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted animate-pulse" />
	                        <div className="mt-3 h-4 w-2/3 rounded bg-muted animate-pulse" />
	                      </div>
	                    </CarouselItem>
	                  ))
	                : topCategories.map((cat) => (
	                    <CarouselItem
	                      key={cat.id}
	                      className="basis-1/2 sm:basis-1/3  md:basis-1/6"
	                    >
	                      <Link
	                        href={`/category/${cat.id}`}
	                        className="group flex w-full p-2 flex-col items-center rounded-md bg-card transition-colors"
	                        aria-label={cat.name}
	                      >
	                        <div className="flex w-full aspect-square items-center justify-center rounded-md bg-primary/8 text-primary overflow-hidden">
	                          {cat.avatar ? (
	                            <img
	                              src={cat.avatar}
	                              alt={cat.name}
	                              className="w-full h-full rounded-md object-cover hover:scale-105 transition-transform duration-300"
	                            />
	                          ) : (
	                            <div className="w-full h-full rounded-md flex items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground">
	                              {cat.name.slice(0, 1).toUpperCase()}
	                            </div>
	                          )}
	                        </div>
	                        <div className="mt-3 truncate text-sm font-semibold">
	                          {cat.name}
	                        </div>
	                      </Link>
	                    </CarouselItem>
	                  ))}
	            </CarouselContent>

            <CarouselPrevious className="hidden md:inline-flex -left-6" />
            <CarouselNext className="hidden md:inline-flex -right-6" />
          </Carousel>
        </section>

        <TopBrands />

        <PromotionProducts />

        <NewArrivalsProducts />
        <ImageBanners />
        <NewCollection />

      </div>
    </div>
  );
}
