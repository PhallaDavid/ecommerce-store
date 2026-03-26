import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
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
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isForgotPassword, setIsForgotPassword] = React.useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = React.useState<'email' | 'otp'>('email')
  const [otpValues, setOtpValues] = React.useState(['', '', '', '', '', ''])

  if (!isOpen) return null

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

        {/* Tab Headers */}
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

            {forgotPasswordStep === 'email' ? (
              <form className="space-y-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="forgotEmailOrPhone">Email or Phone</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Smartphone className="h-4 w-4" />
                      </span>
                      <Input
                        id="forgotEmailOrPhone"
                        type="text"
                        placeholder="m@example.com or 012345678"
                        required
                        className="bg-background pl-9"
                      />
                    </div>
                  </Field>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      className="flex-1 h-9"
                      onClick={() => setForgotPasswordStep('otp')}
                    >
                      Send OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-9"
                      onClick={() => setIsForgotPassword(false)}
                    >
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
                          type="text"
                          maxLength={1}
                          value={value}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\D/g, '')
                            const newOtpValues = [...otpValues]
                            newOtpValues[index] = newValue
                            setOtpValues(newOtpValues)
                            if (newValue && index < 5) {
                              const nextInput = document.getElementById(`otp-${index + 1}`)
                              if (nextInput) nextInput.focus()
                            }
                          }}
                          onKeyPress={(e) => {
                            if (
                              e.key === 'Backspace' &&
                              !otpValues[parseInt(e.currentTarget.id.split('-')[1])] &&
                              parseInt(e.currentTarget.id.split('-')[1]) > 0
                            ) {
                              const prevInput = document.getElementById(
                                `otp-${parseInt(e.currentTarget.id.split('-')[1]) - 1}`
                              )
                              if (prevInput) prevInput.focus()
                            }
                          }}
                          id={`otp-${index}`}
                          className="w-11 h-11 text-center rounded-md text-lg font-bold bg-background border-2 border-muted focus:border-primary focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      className="flex-1 h-9"
                      onClick={() => {
                        console.log('Verifying OTP:', otpValues.join(''))
                      }}
                    >
                      Verify OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-9"
                      onClick={() => setForgotPasswordStep('email')}
                    >
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
          <form className="flex flex-col gap-3">
            <div className="text-center">
              <h2 className="text-xl font-bold">
                {isLogin ? "Login to your account" : "Create your account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin
                  ? "Enter your email below to login to your account"
                  : "Enter your email and password to create your account"}
              </p>
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
                      required
                      className="bg-background pl-9"
                    />
                  </div>
                </Field>
              )}

              {/* Email or Phone */}
              <Field>
                <FieldLabel htmlFor="emailOrPhone">Email or Phone</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="m@example.com or 012345678"
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  {!isLogin && (
                    <span className="text-xs text-muted-foreground">(min 6 characters)</span>
                  )}
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm underline-offset-4 hover:underline text-primary font-medium"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
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
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </Field>
              )}

              {/* Submit */}
              <Field>
                <Button type="submit" className="w-full h-9 mt-1">
                  {isLogin ? "Login" : "Create Account"}
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