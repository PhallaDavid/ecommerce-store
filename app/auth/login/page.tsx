"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Eye, EyeOff, Lock, Smartphone, ArrowLeft, GalleryVerticalEndIcon } from "lucide-react"

import api from "@/utils/axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", { phone, password })
      const token = response.data?.token
      if (typeof token === "string" && token) {
        localStorage.setItem("auth_token", token)
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }
      if (response.data?.user) {
        localStorage.setItem("user_data", JSON.stringify(response.data.user))
      }

      toast.success("Welcome back! Login successful.")

      // Fetch full profile after login
      try {
        const profileRes = await api.get("/auth/profile")
        const rawProfile = profileRes.data?.profile ?? profileRes.data?.user ?? profileRes.data
        if (rawProfile) {
          localStorage.setItem("user_data", JSON.stringify(rawProfile))
        }
      } catch {
        // Ignore
      }

      const callbackUrl = searchParams.get("callbackUrl") || "/"
      window.location.href = callbackUrl
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (() => {
            const data = err.response?.data as { message?: unknown } | undefined
            return (typeof data?.message === "string" && data.message) || err.message
          })()
        : err instanceof Error
        ? err.message
        : "An error occurred. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/30 p-6 md:p-10">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <GalleryVerticalEndIcon className="size-6" />
                    </div>
                  </Link>
                  <h1 className="text-2xl font-bold tracking-tight mt-2">Welcome back</h1>
                  <FieldDescription>
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                      Sign up
                    </Link>
                  </FieldDescription>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <div className="grid gap-4">
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Smartphone className="h-4 w-4" />
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="016763049"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        required
                        className="pl-9 h-11 bg-background"
                      />
                    </div>
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link href="#" className="text-xs font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-9 pr-10 h-11 bg-background"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>

                <FieldSeparator>Or continue with</FieldSeparator>

                <div className="grid gap-4">
                  <Button variant="outline" type="button" className="h-11 w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </div>
          <FieldDescription className="text-center px-4">
            By clicking continue, you agree to our <Link href="#" className="underline">Terms of Service</Link>{" "}
            and <Link href="#" className="underline">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    }>
      <LoginFormContent />
    </React.Suspense>
  )
}
