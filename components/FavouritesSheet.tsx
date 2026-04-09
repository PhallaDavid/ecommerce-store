"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, ShoppingCart } from "lucide-react"

import { SideSheet } from "@/components/SideSheet"
import { Button } from "@/components/ui/button"
import { getFavourites, subscribeStore, addToCart, type FavouriteItem } from "@/lib/store"
import { useLanguage } from "@/components/LanguageProvider"

type FavouritesSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FavouritesSheet({ open, onOpenChange }: FavouritesSheetProps) {
  const { t } = useLanguage()
  const [items, setItems] = React.useState<FavouriteItem[]>([])

  React.useEffect(() => {
    if (!open) return
    setItems(getFavourites())
    return subscribeStore(() => setItems(getFavourites()))
  }, [open])

  return (
    <SideSheet open={open} onOpenChange={onOpenChange} title={t("fav.title")}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="text-sm font-semibold">{t("fav.noFavs")}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("fav.description")}
          </div>
          <Button className="mt-4" onClick={() => onOpenChange(false)}>
            {t("cart.continueShopping")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative flex gap-3 rounded-2xl border bg-card p-3 transition-all hover:shadow-sm"
            >
              <Link
                href={it.href}
                className="shrink-0"
                onClick={() => onOpenChange(false)}
              >
                <Image
                  src={it.image}
                  alt={it.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-cover bg-muted"
                />
              </Link>
              
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    href={it.href}
                    className="block truncate text-sm font-semibold hover:text-primary transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    {it.name}
                  </Link>
                  <div className="mt-0.5 text-sm font-bold text-primary">
                    ${it.price.toFixed(2)}
                  </div>
                </div>

                <div className="mt-2">
                  <Button
                    size="sm"
                    className="h-8 w-full text-[11px] font-bold"
                    onClick={(e) => {
                      e.preventDefault()
                      addToCart({
                        id: it.id,
                        name: it.name,
                        href: it.href,
                        image: it.image,
                        price: it.price
                      })
                    }}
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    {t("cart.addToCart").toUpperCase()}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SideSheet>
  )
}
