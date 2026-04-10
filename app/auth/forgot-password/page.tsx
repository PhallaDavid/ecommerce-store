"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Eye, EyeOff, Lock, ArrowLeft, GalleryVerticalEndIcon, ChevronLeft, KeyRound, CheckCircle2 } from "lucide-react"

import api from "@/utils/axios"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { PhoneInput, type Country } from "@/components/ui/phone-input"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useLanguage } from "@/components/LanguageProvider"

type Step = "phone" | "otp" | "newPassword" | "success"

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [step, setStep] = React.useState<Step>("phone")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // Fields
  const [phone, setPhone] = React.useState("")
  const [country, setCountry] = React.useState<Country>({ code: "KH", dial: "+855", flag: "🇰🇭", name: "Cambodia" })
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  // OTP resend timer
  const [resendTimer, setResendTimer] = React.useState(0)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const startTimer = () => {
    setResendTimer(60)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleError = (err: unknown) => {
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
  }

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    const fullPhone = `${country.dial}${phone}`
    try {
      await api.post("/auth/forgot-password-send-otp", { phone: fullPhone })
      toast.success("Verification code sent!")
      startTimer()
      setOtp(["", "", "", "", "", ""])
      setStep("otp")
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    setError("")
    setIsLoading(true)
    const fullPhone = `${country.dial}${phone}`
    try {
      await api.post("/auth/forgot-password-send-otp", { phone: fullPhone })
      toast.success("Code resent!")
      startTimer()
      setOtp(["", "", "", "", "", ""])
      otpRefs.current[0]?.focus()
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP via API then move to new password step
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const otpCode = otp.join("")
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.")
      return
    }
    setIsLoading(true)
    const fullPhone = `${country.dial}${phone}`
    try {
      await api.post("/auth/verify-otp", { phone: fullPhone, otp: otpCode })
      toast.success("OTP verified!")
      setStep("newPassword")
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setIsLoading(true)
    const fullPhone = `${country.dial}${phone}`
    try {
      await api.post("/auth/forgot-password", {
        phone: fullPhone,
        otp: otp.join(""),
        newPassword,
      })
      toast.success("Password reset successfully!")
      setStep("success")
      setTimeout(() => router.push("/auth/login"), 2500)
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = ["", "", "", "", "", ""]
    pasted.split("").forEach((c, i) => { next[i] = c })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const STEPS: Step[] = ["phone", "otp", "newPassword"]
  const stepIndex = STEPS.indexOf(step)

  // Success screen
  if (step === "success") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm border border-green-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Password Reset!</h1>
            <p className="text-muted-foreground">
              Your password has been reset successfully. Redirecting to login…
            </p>
          </div>
          <Button asChild className="w-full h-11">
            <Link href="/auth/login">{t("auth.login")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/30 p-6 md:p-10">
      <Link
        href="/auth/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">

            {/* Step progress dots */}
            {stepIndex >= 0 && (
              <div className="flex justify-center gap-1.5 mb-6">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i < stepIndex
                        ? "w-4 bg-muted-foreground/40"
                        : i === stepIndex
                        ? "w-6 bg-foreground"
                        : "w-4 bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Back button for later steps */}
            {(step === "otp" || step === "newPassword") && (
              <button
                type="button"
                onClick={() => { setError(""); setStep(step === "otp" ? "phone" : "otp") }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {/* ── STEP 1: Phone ── */}
            {step === "phone" && (
              <form onSubmit={handleSendOtp}>
                <FieldGroup className="gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <GalleryVerticalEndIcon className="size-6" />
                      </div>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight mt-2">Forgot Password</h1>
                    <FieldDescription>
                      Enter your phone number and we&apos;ll send you a verification code.
                    </FieldDescription>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="phone">{t("auth.phone")}</FieldLabel>
                    <PhoneInput
                      id="phone"
                      value={phone}
                      onChange={(val, c) => { setPhone(val); setCountry(c) }}
                      defaultCountry="KH"
                      required
                    />
                  </Field>

                  <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{t("common.loading")}</span>
                      </div>
                    ) : (
                      "Send verification code"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                      {t("auth.signIn")}
                    </Link>
                  </p>
                </FieldGroup>
              </form>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp}>
                <FieldGroup className="gap-6">
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Enter OTP</h1>
                    <FieldDescription>
                      We sent a 6-digit code to <span className="font-semibold text-foreground">+{phone}</span>
                    </FieldDescription>
                  </div>

                  {/* OTP digit inputs */}
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-11 text-center text-xl font-semibold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ height: "52px" }}
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div className="text-center text-sm text-muted-foreground">
                    {resendTimer > 0 ? (
                      <span>Resend code in <strong>{resendTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-primary hover:underline font-medium"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-11 text-base" disabled={isLoading || otp.join("").length < 6}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{t("common.loading")}</span>
                      </div>
                    ) : (
                      "Verify code"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === "newPassword" && (
              <form onSubmit={handleResetPassword}>
                <FieldGroup className="gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <KeyRound className="size-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mt-2">New Password</h1>
                    <FieldDescription>Choose a strong password for your account.</FieldDescription>
                  </div>

                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </span>
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className="pl-9 pr-10 h-11 bg-background"
                          minLength={6}
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

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </span>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="pl-9 pr-10 h-11 bg-background"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <FieldDescription>{t("auth.minCharacters")}</FieldDescription>
                    </Field>
                  </div>

                  <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{t("common.loading")}</span>
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            )}

          </div>

          <FieldDescription className="text-center px-4">
            {t("auth.byClicking")} <Link href="#" className="underline">{t("auth.terms")}</Link>{" "}
            {t("auth.privacy")}.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}
