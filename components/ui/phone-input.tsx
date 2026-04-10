"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface Country {
  code: string   // ISO 2-letter, e.g. "KH"
  dial: string   // e.g. "+855"
  flag: string   // emoji flag
  name: string
}

export const COUNTRIES: Country[] = [
  { code: "KH", dial: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "TH", dial: "+66",  flag: "🇹🇭", name: "Thailand" },
  { code: "VN", dial: "+84",  flag: "🇻🇳", name: "Vietnam" },
  { code: "LA", dial: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "MM", dial: "+95",  flag: "🇲🇲", name: "Myanmar" },
  { code: "SG", dial: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "MY", dial: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "ID", dial: "+62",  flag: "🇮🇩", name: "Indonesia" },
  { code: "PH", dial: "+63",  flag: "🇵🇭", name: "Philippines" },
  { code: "CN", dial: "+86",  flag: "🇨🇳", name: "China" },
  { code: "JP", dial: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "KR", dial: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "IN", dial: "+91",  flag: "🇮🇳", name: "India" },
  { code: "US", dial: "+1",   flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", name: "France" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "AU", dial: "+61",  flag: "🇦🇺", name: "Australia" },
]

interface PhoneInputProps {
  id?: string
  value: string
  onChange: (phone: string, country: Country) => void
  defaultCountry?: string // ISO code e.g. "KH"
  className?: string
  required?: boolean
  placeholder?: string
}

export function PhoneInput({
  id,
  value,
  onChange,
  defaultCountry = "KH",
  className,
  required,
  placeholder,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    () => COUNTRIES.find(c => c.code === defaultCountry) ?? COUNTRIES[0]
  )
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(
    () => COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
    ),
    [search]
  )

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (country: Country) => {
    setSelectedCountry(country)
    setOpen(false)
    setSearch("")
    onChange(value, country)
  }

  return (
    <div className={cn("relative flex h-11", className)} ref={dropdownRef}>
      {/* Country selector button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1.5 shrink-0 border border-r-0 rounded-l-md bg-muted/50 px-3",
          "text-sm font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
          open && "bg-muted ring-2 ring-primary ring-inset"
        )}
        aria-label="Select country code"
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <span className="text-muted-foreground tabular-nums">{selectedCountry.dial}</span>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {/* Phone number input */}
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ""), selectedCountry)}
        required={required}
        placeholder={placeholder ?? "Phone Number"}
        className="rounded-l-none h-11 bg-background flex-1 focus-visible:ring-primary"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64 rounded-lg border bg-popover shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm px-2 py-1.5 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {/* List */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
            )}
            {filtered.map(country => (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left",
                    selectedCountry.code === country.code && "bg-primary/10 font-medium"
                  )}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{country.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
