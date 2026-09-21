'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';

type AuthViewMode = 'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-password';

// Password Strength Evaluation
interface PasswordStrength {
  score: number;
  label: 'Weak' | 'Medium' | 'Strong';
  color: string;
  barColor: string;
  width: string;
  missingRules: string[];
}

function evaluatePasswordStrength(password: string): PasswordStrength {
  const missing: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else missing.push('At least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else missing.push('One lowercase letter');

  if (/[A-Z]/.test(password)) score++;
  else missing.push('One uppercase letter');

  if (/[0-9]/.test(password)) score++;
  else missing.push('One number');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else missing.push('One special character (!@#$%^&*)');

  if (score <= 2) {
    return {
      score,
      label: 'Weak',
      color: 'text-rose-600 dark:text-rose-400',
      barColor: 'bg-rose-500',
      width: 'w-1/3',
      missingRules: missing,
    };
  } else if (score <= 4) {
    return {
      score,
      label: 'Medium',
      color: 'text-amber-600 dark:text-amber-400',
      barColor: 'bg-amber-500',
      width: 'w-2/3',
      missingRules: missing,
    };
  } else {
    return {
      score,
      label: 'Strong',
      color: 'text-emerald-600 dark:text-emerald-400',
      barColor: 'bg-emerald-500',
      width: 'w-full',
      missingRules: [],
    };
  }
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/';

  const {
    signInWithGoogle,
    signInWithPhonePassword,
    signUpWithPhone,
    sendOtp,
    verifyOtp,
    resetPassword,
  } = useAuth();

  // Form states
  const initialModeParam = searchParams.get('mode');
  const [mode, setMode] = useState<AuthViewMode>(
    initialModeParam === 'signup' ? 'signup' : 'login'
  );
  const [otpPurpose, setOtpPurpose] = useState<'signup' | 'recovery'>('signup');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 6-digit OTP individual box state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer state for resend
  const [resendCountdown, setResendCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isGoogleAccountRecovery, setIsGoogleAccountRecovery] = useState(false);

  const passwordStrength = evaluatePasswordStrength(password);

  // Countdown timer effect for OTP screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (mode === 'otp' && resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [mode, resendCountdown]);

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMessage(res.error);
      setLoading(false);
    } else {
      setSuccessMessage('Logged in with Google! Redirecting...');
      setTimeout(() => {
        router.push(redirectTarget);
      }, 700);
    }
  };

  // Handle Phone + Password Login
  const handlePhonePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);
    const res = await signInWithPhonePassword(phoneNumber, password);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push(redirectTarget);
      }, 600);
    }
  };

  // Handle Sign-Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }

    if (passwordStrength.score < 3) {
      setErrorMessage('Please choose a stronger password matching the policy');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await signUpWithPhone(phoneNumber, password);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setOtpPurpose('signup');
      setMode('otp');
      setResendCountdown(45);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMessage('Verification code sent to your phone');
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleAccountRecovery(false);

    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setErrorMessage('Please enter your 10-digit registered phone number');
      return;
    }

    setLoading(true);
    const res = await sendOtp(phoneNumber, 'recovery');
    setLoading(false);

    if (res.isGoogleAccount) {
      setIsGoogleAccountRecovery(true);
      return;
    }

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setOtpPurpose('recovery');
      setMode('otp');
      setResendCountdown(45);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMessage('Verification code sent to your registered phone');
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    // Auto-advance to next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pastedData[i] || '';
    }
    setOtpDigits(updated);
    const targetFocus = Math.min(pastedData.length, 5);
    otpInputRefs.current[targetFocus]?.focus();
  };

  // Handle OTP Verification Submit
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullToken = otpDigits.join('');
    if (fullToken.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    const res = await verifyOtp(phoneNumber, fullToken, otpPurpose);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      if (otpPurpose === 'signup') {
        setSuccessMessage('✓ Account created successfully! Redirecting to Dashboard...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      } else {
        // Recovery -> go to reset password
        setMode('reset-password');
        setPassword('');
        setConfirmPassword('');
        setSuccessMessage('Identity verified! Create your new password.');
      }
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setErrorMessage('');
    const res = await sendOtp(phoneNumber, otpPurpose);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setResendCountdown(45);
      setCanResend(false);
      setSuccessMessage('A new verification code has been sent');
    }
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (passwordStrength.score < 3) {
      setErrorMessage('New password does not meet the security policy');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await resetPassword(password);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('✓ Password changed successfully! You can now log in with your new password.');
    }
  };

  // Format phone for display (e.g. +91 98765 XXXXX)
  const formatPhoneMask = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 5) return `+91 ${digits}`;
    return `+91 ${digits.slice(0, 5)} XXXXX`;
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-8">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 mb-3">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
              <span>PriceWise</span>
            </h1>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              Shop Smarter. Save More.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-rose-50 p-3.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/50 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/50 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. LOGIN MODE                                                             */}
          {/* ========================================================================= */}
          {mode === 'login' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Welcome to PriceWise</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Compare prices. Track products. Find better deals.
                </p>
              </div>

              {/* Option 1: Continue with Google */}
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                variant="outline"
                className="w-full h-11 rounded-2xl border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 flex items-center justify-center gap-3 font-semibold text-xs transition"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900">
                  OR
                </span>
              </div>

              {/* Option 2: Phone Number + Password */}
              <form onSubmit={handlePhonePasswordLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative flex rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <span className="flex items-center px-3.5 border-r border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      maxLength={14}
                      className="w-full h-11 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot-password');
                        setErrorMessage('');
                        setSuccessMessage('');
                        setIsGoogleAccountRecovery(false);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 px-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25 mt-2"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="pt-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-bold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. SIGN-UP MODE                                                           */}
          {/* ========================================================================= */}
          {mode === 'signup' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create your PriceWise account</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sign up once. Track and compare everywhere.
                </p>
              </div>

              {/* Continue with Google */}
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                variant="outline"
                className="w-full h-11 rounded-2xl border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 flex items-center justify-center gap-3 font-semibold text-xs"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900">
                  OR
                </span>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative flex rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <span className="flex items-center px-3.5 border-r border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full h-10 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars with upper, lower, digit, symbol"
                      className="w-full h-10 px-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Password strength</span>
                        <span className={`font-bold ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.barColor} ${passwordStrength.width} transition-all duration-300`}
                        />
                      </div>
                      {passwordStrength.missingRules.length > 0 && (
                        <p className="text-[10px] text-slate-400">
                          Missing: {passwordStrength.missingRules.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full h-10 px-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25 mt-2"
                >
                  {loading ? 'Sending OTP...' : 'Continue & Verify OTP'}
                </Button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-bold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. PHONE OTP VERIFICATION MODE                                            */}
          {/* ========================================================================= */}
          {mode === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {otpPurpose === 'recovery' ? 'Verify your identity' : 'Verify your phone number'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We&apos;ve sent a 6-digit verification code to
                </p>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {formatPhoneMask(phoneNumber)}
                </p>
              </div>

              {/* 6 Individual OTP Box Inputs */}
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="h-12 w-11 sm:h-14 sm:w-13 text-center text-lg font-bold rounded-2xl border-2 border-slate-200 bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 transition"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading || otpDigits.join('').length < 6}
                  variant="primary"
                  className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </form>

              {/* Resend & Change Phone Number */}
              <div className="pt-2 text-center space-y-2 text-xs">
                <p className="text-slate-500 dark:text-slate-400">
                  Didn&apos;t receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className={`font-bold ${
                      canResend
                        ? 'text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canResend ? 'Resend OTP' : `Resend in ${resendCountdown}s`}
                  </button>
                </p>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(otpPurpose === 'recovery' ? 'forgot-password' : 'signup');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Change phone number
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. FORGOT PASSWORD MODE                                                   */}
          {/* ========================================================================= */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Forgot your password?</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter your registered phone number to reset your password.
                </p>
              </div>

              {/* Google Account Recovery Notice */}
              {isGoogleAccountRecovery ? (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30 text-center space-y-3 animate-in fade-in">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-slate-900">
                    <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    This account uses Google sign-in.
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Please continue with Google to access your PriceWise account. You do not need a separate password.
                  </p>
                  <Button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20"
                  >
                    Continue with Google
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Phone Number
                    </label>
                    <div className="relative flex rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                      <span className="flex items-center px-3.5 border-r border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full h-11 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                    setIsGoogleAccountRecovery(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. RESET PASSWORD MODE                                                    */}
          {/* ========================================================================= */}
          {mode === 'reset-password' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create New Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set a strong password for your PriceWise account.
                </p>
              </div>

              {successMessage.includes('Password changed') ? (
                <div className="space-y-4 text-center py-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      ✓ Password changed successfully.
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      You can now log in with your new password.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setPassword('');
                      setConfirmPassword('');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    variant="primary"
                    className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25"
                  >
                    Continue to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full h-10 px-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Password strength:</span>
                          <span className={`font-bold ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.barColor} ${passwordStrength.width} transition-all duration-300`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full h-10 px-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full h-11 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25 mt-2"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Footer Terms */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
            <Link href="/help" className="hover:underline">Privacy Policy</Link>
            <span className="mx-1.5">•</span>
            <Link href="/help" className="hover:underline">Terms of Service</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
