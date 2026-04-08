"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { SideSheet } from "@/components/SideSheet"
import { Button } from "@/components/ui/button"
import {
  getCart,
  removeFromCart,
  subscribeStore,
  updateCartQty,
  type CartItem,
} from "@/lib/store"
import { useLanguage } from "@/components/LanguageProvider"

type CartSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { t } = useLanguage()
  const [items, setItems] = React.useState<CartItem[]>([])

  React.useEffect(() => {
    if (!open) return
    setItems(getCart())
    return subscribeStore(() => setItems(getCart()))
  }, [open])

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  return (
    <SideSheet open={open} onOpenChange={onOpenChange} title={t("cart.title")}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="text-sm font-semibold">{t("cart.empty")}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("cart.addItems")}
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
              className="flex gap-3 rounded-2xl border bg-card p-3"
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

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={it.href}
                    className="truncate text-sm font-semibold hover:text-primary transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    {it.name}
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label="Remove"
                    onClick={() => removeFromCart(it.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-primary">
                    ${(it.price * it.qty).toFixed(2)}
                  </div>

                  <div className="inline-flex items-center rounded-full border bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full"
                      aria-label="Decrease quantity"
                      onClick={() => updateCartQty(it.id, it.qty - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="px-2 text-xs font-semibold tabular-nums">
                      {it.qty}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full"
                      aria-label="Increase quantity"
                      onClick={() => updateCartQty(it.id, it.qty + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                  ${it.price.toFixed(2)} each
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-3" asChild>
              <Link href="/checkout" onClick={() => onOpenChange(false)}>{t("cart.checkout")}</Link>
            </Button>
          </div>
        </div>
      )}
    </SideSheet>
  )
}
