"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Loader2, Save, User } from "lucide-react"

import api from "@/utils/axios"
import { AuthDialog } from "@/components/auth-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ProfilePayload = {
  age?: number
  name?: string
  avatar?: string
  gender?: string
  address?: string
}

type ProfileResponse = {
  age?: unknown
  name?: unknown
  avatar?: unknown
  gender?: unknown
  address?: unknown
  phone?: unknown
  fullName?: unknown
  username?: unknown
}

function getInitials(name?: string | null) {
  const safeName = (name ?? "").trim()
  if (!safeName) return "?"
  const initials = safeName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2)
  return initials || "?"
}

function normalizeProfile(raw: unknown): ProfileResponse | null {
  if (!raw || typeof raw !== "object") return null
  return raw as ProfileResponse
}

function coerceString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function coerceNumberString(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  if (typeof value === "string" && value.trim()) return value.trim()
  return ""
}

export default function ProfilePage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [tokenAvailable, setTokenAvailable] = React.useState(false)

  const [phone, setPhone] = React.useState("")

  const [name, setName] = React.useState("")
  const [age, setAge] = React.useState("")
  const [avatar, setAvatar] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [address, setAddress] = React.useState("")

  const fetchProfile = React.useCallback(async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    try {
      const res = await api.get("/auth/profile")
      const data = res.data as { user?: unknown; profile?: unknown } | undefined
      const raw = data?.profile ?? data?.user ?? res.data
      const profile = normalizeProfile(raw)
      if (!profile) throw new Error("Invalid profile response")

      const rawName =
        coerceString(profile.name) ||
        coerceString(profile.fullName) ||
        coerceString(profile.username)

      setName(rawName)
      setAge(coerceNumberString(profile.age))
      setAvatar(coerceString(profile.avatar))
      setGender(coerceString(profile.gender).toLowerCase())
      setAddress(coerceString(profile.address))
      setPhone(coerceString(profile.phone))

      if (typeof window !== "undefined") {
        localStorage.setItem("user_data", JSON.stringify(raw))
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // Avoid hydration mismatch: don't read localStorage during render.
    const hasToken = !!localStorage.getItem("auth_token")
    setTokenAvailable(hasToken)
  }, [])

  React.useEffect(() => {
    if (!tokenAvailable) {
      setIsLoading(false)
      return
    }
    void fetchProfile()
  }, [fetchProfile, tokenAvailable])

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSaving(true)

    const payload: ProfilePayload = {
      name: name.trim() || undefined,
      avatar: avatar.trim() || undefined,
      gender: gender.trim() || undefined,
      address: address.trim() || undefined,
    }

    const ageTrimmed = age.trim()
    if (ageTrimmed) {
      const parsedAge = Number(ageTrimmed)
      if (!Number.isFinite(parsedAge) || parsedAge < 0) {
        setError("Age must be a valid number")
        setIsSaving(false)
        return
      }
      payload.age = parsedAge
    }

    try {
      await api.post("/auth/update-profile", payload)
      setSuccess("Profile updated")
      await fetchProfile()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <nav className="mb-8 flex items-center space-x-2 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Profile</span>
        </nav>

        <div className="rounded-lg border bg-card p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-lg border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar} alt={name || "User"} />
                    <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-base font-semibold truncate">{name || "Account"}</p>
                    <p className="text-xs text-muted-foreground truncate">{phone || " "}</p>
                  </div>
                </div>

                {!tokenAvailable ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAuthDialogOpen(true)}
                  >
                    Login
                  </Button>
                ) : (
                  <Button asChild type="button" variant="outline">
                    <Link href="/orders">Orders</Link>
                  </Button>
                )}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Update your personal details and shipping address.
              </div>
            </aside>

            <main>
              {!tokenAvailable ? (
                <div className="rounded-lg border bg-background p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    You are not logged in
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Login to fetch your profile and update it.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading profile
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-5">
                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                {success && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="age">Age</FieldLabel>
                      <Input
                        id="age"
                        inputMode="numeric"
                        value={age}
                        onChange={(e) =>
                          setAge(e.target.value.replace(/[^\d.]/g, ""))
                        }
                        placeholder="25"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="gender">Gender</FieldLabel>
                      <select
                        id="gender"
                        name="gender"
                        className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="avatar">Avatar URL</FieldLabel>
                    <Input
                      id="avatar"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://example.com/my-picture.png"
                    />
                    <FieldDescription>
                      Paste an image URL to update your avatar.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Awesome St, Phnom Penh"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input id="phone" value={phone} readOnly />
                    <FieldDescription>Read-only from profile.</FieldDescription>
                  </Field>
                </FieldGroup>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void fetchProfile()}
                    disabled={isSaving}
                  >
                    Refresh
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
                </form>
              )}
            </main>
          </div>
        </div>

        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => {
            setIsAuthDialogOpen(false)
            if (localStorage.getItem("auth_token")) {
              setTokenAvailable(true)
              void fetchProfile()
            }
          }}
        />
      </div>
    </div>
  )
}
