"use client"

import * as React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

import { SideSheet } from "@/components/SideSheet"
import { Button } from "@/components/ui/button"
import { getFavourites, subscribeStore, type FavouriteItem } from "@/lib/store"

type FavouritesSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FavouritesSheet({ open, onOpenChange }: FavouritesSheetProps) {
  const [items, setItems] = React.useState<FavouriteItem[]>([])

  React.useEffect(() => {
    if (!open) return
    setItems(getFavourites())
    return subscribeStore(() => setItems(getFavourites()))
  }, [open])

  return (
    <SideSheet open={open} onOpenChange={onOpenChange} title="Favourites">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Heart className="h-6 w-6" />
          </div>
          <div className="text-sm font-semibold">No favourites yet</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Tap the heart icon on a product to save it.
          </div>
          <Button className="mt-4" onClick={() => onOpenChange(false)}>
            Browse products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <Link
              key={it.id}
              href={it.href}
              className="flex gap-3 rounded-2xl border bg-card p-3 hover:bg-muted/30 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <img
                src={it.image}
                alt={it.name}
                className="h-16 w-16 rounded-xl object-cover bg-muted"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{it.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  ${it.price.toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SideSheet>
  )
}
