"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("promo-seen");
    const timer = setTimeout(() => {
      if (!hasSeen) {
        setIsOpen(true);
        sessionStorage.setItem("promo-seen", "true");
        
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsOpen(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-[100]  bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Popup content */}
      <div className="fixed left-[50%]  top-[50%] z-[101] grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background duration-200 sm:rounded-md overflow-hidden animate-in fade-in-0 zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 rounded-full bg-black/20  text-white hover:bg-black/40 transition-colors z-10 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
           {/* Replace with your actual banner image URL */}
           <img 
              src="https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/banner/2026/TEN11/Mar/KNY%20Sale/MAR26-CatFeed%20-Women-BestSellers-WEB%20HP.jpg" 
              alt="Special Promotion Banner" 
              className="h-full w-full object-cover"
           />
        </div>
        
        <div className="flex flex-col gap-2 p-6 pt-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Flash Sale 50% OFF!
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            Use code <span className="font-bold text-primary px-1 py-0.5 rounded bg-primary/10">SAVE50</span> at checkout.
            Offer ends soon!
          </p>
          
          <Button 
            className="w-full mt-4 h-12 text-base font-bold transition-transform"
            onClick={() => setIsOpen(false)}
          >
            Claim Discount Now
          </Button>
          
          <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
            Auto-closing in {countdown}s
          </p>
        </div>
      </div>
    </>
  );
}
