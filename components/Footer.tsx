import Link from "next/link"
import {
  CreditCard,
  Wallet,
  ShieldCheck,
} from "lucide-react"
import {
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons"

import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
]

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogoIcon },
  { label: "Twitter", href: "https://twitter.com", icon: TwitterLogoIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInLogoIcon },
  { label: "GitHub", href: "https://github.com", icon: GitHubLogoIcon },
]

// const paymentMethods = [
//   { label: "Visa", icon: CreditCard },
//   { label: "Mastercard", icon: CreditCard },
//   { label: "PayPal", icon: Wallet },
//   { label: "Apple Pay", icon: Wallet },
// ]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
             <div className="flex items-center flex-row" >
              <span className=" text-xl font-bold">R </span>
              <p className="text-sm font-medium" >4kie.S</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modern essentials, fast delivery, and secure checkout — built for everyday shopping.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Social</h3>
            <ul className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex w-full items-center gap-2 rounded-full border bg-background p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                    {/* <span className="truncate">{label}</span> */}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Payment Methods</h3>
          <img src="/images/we-accept-payment–for-web-footer – v2.png" alt="" />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} Phalla David. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
