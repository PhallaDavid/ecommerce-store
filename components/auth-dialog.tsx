import * as React from "react"
import { Button } from "@/components/ui/button"
import api from "@/utils/axios"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { X, Eye, EyeOff, Lock, Smartphone } from "lucide-react"
import axios from "axios"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = React.useState(true)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    setPhone('')
    setPassword('')
    setError('')
    setShowPassword(false)
  }, [isLogin])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { phone, password })
        const token = response.data?.token
        if (typeof token === "string" && token) {
          localStorage.setItem('auth_token', token)
        }
        if (response.data?.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }

        // Fetch full profile after login (in case login response is partial)
        try {
          const profileRes = await api.get("/auth/profile")
          const profile = profileRes.data?.profile ?? profileRes.data?.user ?? profileRes.data
          if (profile) {
            localStorage.setItem("user_data", JSON.stringify(profile))
          }
        } catch {
          // Ignore profile fetch failures; user can still be considered logged in via token.
        }

        window.location.href = '/'
      } else {
        await api.post('/auth/register', { phone, password })
        setIsLogin(true)
      }
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? (() => {
              const data = err.response?.data as { message?: unknown } | undefined
              return (typeof data?.message === "string" && data.message) || err.message
            })()
          : err instanceof Error
            ? err.message
            : 'An error occurred. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-white/10 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-lg bg-background p-4 border animate-in zoom-in-95">

        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted">
          <X className="h-5 w-5" />
        </button>

        {/* Tabs */}
        <div className="mb-4 flex border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isLogin ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isLogin ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="text-center">
            <h2 className="text-xl font-bold">
              {isLogin ? "Login to your account" : "Create your account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Welcome back! Please login to continue" : "Fill in your details to get started"}
            </p>
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </div>
            )}
          </div>

          <FieldGroup className="gap-2">
            {/* Phone */}
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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  className="bg-background pl-9"
                />
              </div>
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  className="bg-background pl-9 pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                    : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </Field>

            {/* Submit */}
            <Field>
              <Button type="submit" className="w-full h-9 mt-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{isLogin ? "Logging in..." : "Creating account..."}</span>
                  </div>
                ) : (
                  <span>{isLogin ? "Login" : "Create Account"}</span>
                )}
              </Button>
            </Field>

            <Field>
              <FieldDescription className="text-center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium hover:underline hover:text-primary"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}
