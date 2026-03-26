import * as React from "react"
import { Button } from "@/components/ui/button"
import api from "@/utils/axios"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  KeyRound,
  Smartphone,
} from "lucide-react"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = React.useState(true)
  const [inputMethod, setInputMethod] = React.useState<'email' | 'phone'>('email')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isForgotPassword, setIsForgotPassword] = React.useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = React.useState<'email' | 'otp'>('email')
  const [otpValues, setOtpValues] = React.useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // Form state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  // Clear form when switching tabs
  React.useEffect(() => {
    setName('')
    setEmail('')
    setPhone('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }, [isLogin, inputMethod])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await api.post('/login', {
          ...(inputMethod === 'email' ? { email } : { phone }),
          password,
        })
        
        // Check if email or phone needs verification
        const userData = response.data.user
        const isEmailInput = inputMethod === 'email'
        
        if ((isEmailInput && !userData.email_verified) || (!isEmailInput && !userData.phone_verified)) {
          // Store user data for OTP verification
          localStorage.setItem('pending_verification', JSON.stringify({
            token: response.data.token,
            user: userData,
            emailOrPhone: isEmailInput ? email : phone
          }))
          
          // Send OTP - use correct endpoint based on input type
          const otpEndpoint = isEmailInput ? '/email/verify-otp/send' : '/phone/verify-otp/send'
          await api.post(otpEndpoint, {
            ...(isEmailInput ? { email } : { phone })
          })
          
          // Switch to OTP verification mode
          setForgotPasswordStep('otp')
          setIsForgotPassword(true)
          return
        }
        
        console.log('Login successful:', response.data)
        // Save token and user data to localStorage
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        onClose()
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }

        const registrationData = {
          name,
          email: inputMethod === 'email' ? email : '',
          phone: inputMethod === 'phone' ? phone : '',
          password,
          password_confirmation: confirmPassword,
        }

        const response = await api.post('/register', registrationData)
        
        // Check if email or phone needs verification
        const userData = response.data.user
        const isEmailInput = inputMethod === 'email'
        
        if ((isEmailInput && !userData.email_verified) || (!isEmailInput && !userData.phone_verified)) {
          // Store user data for OTP verification
          localStorage.setItem('pending_verification', JSON.stringify({
            token: response.data.token,
            user: userData,
            emailOrPhone: isEmailInput ? email : phone
          }))
          
          // Send OTP - use correct endpoint based on input type
          const otpEndpoint = isEmailInput ? '/email/verify-otp/send' : '/phone/verify-otp/send'
          await api.post(otpEndpoint, {
            ...(isEmailInput ? { email } : { phone })
          })
          
          // Switch to OTP verification mode
          setForgotPasswordStep('otp')
          setIsForgotPassword(true)
          return
        }
        
        console.log('Registration successful:', response.data)
        onClose()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(error.response?.data?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-white/10 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-lg bg-background p-4 border transform transition-all duration-300 ease-in-out animate-in zoom-in-95">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Login / Register Tab */}
        <div className="mb-3 flex border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isLogin
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        {/* Forgot Password Form */}
        {isForgotPassword && (
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {forgotPasswordStep === 'email'
                  ? "Enter your email or phone number to receive an OTP"
                  : "Enter the 6-digit code sent to your email/phone"}
              </p>
            </div>

            {/* Email / Phone switcher for forgot password */}
            {forgotPasswordStep === 'email' && (
              <div className="flex rounded-md border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setInputMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
                    inputMethod === 'email'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setInputMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
                    inputMethod === 'phone'
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Phone
                </button>
              </div>
            )}

            {forgotPasswordStep === 'email' ? (
              <form className="space-y-3">
                <FieldGroup>
                  {/* Email field */}
                  {inputMethod === 'email' && (
                    <Field>
                      <FieldLabel htmlFor="forgotEmail">Email Address</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                        </span>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="m@example.com"
                          required
                          className="bg-background pl-9"
                        />
                      </div>
                    </Field>
                  )}

                  {/* Phone field */}
                  {inputMethod === 'phone' && (
                    <Field>
                      <FieldLabel htmlFor="forgotPhone">Phone Number</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Smartphone className="h-4 w-4" />
                        </span>
                        <Input
                          id="forgotPhone"
                          type="tel"
                          placeholder="012345678"
                          required
                          className="bg-background pl-9"
                        />
                      </div>
                    </Field>
                  )}
                  
                  <div className="flex gap-2 pt-1">
                    <Button 
                      type="button" 
                      className="flex-1 h-9" 
                      onClick={async () => {
                        const inputElement = document.getElementById(inputMethod === 'email' ? 'forgotEmail' : 'forgotPhone') as HTMLInputElement
                        const emailOrPhone = inputElement?.value.trim()
                        
                        if (!emailOrPhone) {
                          setError(`Please enter your ${inputMethod}`)
                          return
                        }

                        try {
                          // Use correct forgot password endpoint based on input type
                          const forgotEndpoint = inputMethod === 'email' ? '/forgot-password-otp' : '/phone/forgot-password/send'
                          
                          await api.post(forgotEndpoint, {
                            ...(inputMethod === 'email' ? { email: emailOrPhone } : { phone: emailOrPhone })
                          })
                          
                          console.log('Forgot password OTP sent successfully')
                          setForgotPasswordStep('otp')
                        } catch (error: any) {
                          console.error('Forgot password error:', error)
                          setError(error.response?.data?.message || 'Failed to send OTP')
                        }
                      }}
                    >
                      Send OTP
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setIsForgotPassword(false)}>
                      Cancel
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            ) : (
              <form className="space-y-3">
                <FieldGroup>
                  <div className="space-y-2">
                    <FieldLabel className="block text-center">
                      <span className="inline-flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        Enter 6-digit OTP
                      </span>
                    </FieldLabel>
                    <div className="flex gap-2 justify-center">
                      {otpValues.map((value, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\D/g, '')
                            const next = [...otpValues]
                            next[index] = newValue
                            setOtpValues(next)
                            if (newValue && index < 5) {
                              document.getElementById(`otp-${index + 1}`)?.focus()
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
                              document.getElementById(`otp-${index - 1}`)?.focus()
                            }
                          }}
                          className="w-11 h-11 text-center rounded-md text-lg font-bold bg-background border-2 border-muted focus:border-primary focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button 
                      type="button" 
                      className="flex-1 h-9" 
                      onClick={async () => {
                        try {
                          const otp = otpValues.join('')
                          const pendingData = JSON.parse(localStorage.getItem('pending_verification') || '{}')
                          
                          // Determine if the stored emailOrPhone is email or phone
                          const isEmailInput = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pendingData.emailOrPhone)
                          
                          // For forgot password, use the forgot password verification endpoint
                          const verifyEndpoint = isEmailInput ? '/email/verify-otp' : '/phone/verify-otp'
                          
                          const response = await api.post(verifyEndpoint, {
                            ...(isEmailInput ? { email: pendingData.emailOrPhone } : { phone: pendingData.emailOrPhone }),
                            otp
                          })
                          
                          console.log('Forgot password OTP verification successful:', response.data)
                          // Clear pending data and close dialog
                          localStorage.removeItem('pending_verification')
                          onClose()
                        } catch (error: any) {
                          console.error('Forgot password OTP verification failed:', error)
                          setError(error.response?.data?.message || 'Invalid OTP')
                        }
                      }}
                    >
                      Verify OTP
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setForgotPasswordStep('email')}>
                      Back
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            )}
          </div>
        )}

        {/* Main Login/Register Form */}
        {!isForgotPassword && (
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

            {/* Email / Phone switcher */}
            <div className="flex rounded-md border overflow-hidden">
              <button
                type="button"
                onClick={() => setInputMethod('email')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
                  inputMethod === 'email'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setInputMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors ${
                  inputMethod === 'phone'
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Phone
              </button>
            </div>

            <FieldGroup className="gap-2">
              {/* Full Name — Register only */}
              {!isLogin && (
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </span>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-background pl-9"
                    />
                  </div>
                </Field>
              )}

              {/* Email field */}
              {inputMethod === 'email' && (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background pl-9"
                    />
                  </div>
                </Field>
              )}

              {/* Phone field */}
              {inputMethod === 'phone' && (
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Smartphone className="h-4 w-4" />
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                      className="bg-background pl-9"
                    />
                  </div>
                </Field>
              )}

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
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                      : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm underline-offset-4 hover:underline text-primary font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </Field>

              {/* Confirm Password — Register only */}
              {!isLogin && (
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
                      className="bg-background pl-9 pr-10"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword
                        ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                        : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </Field>
              )}

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
        )}
      </div>
    </div>
  )
}