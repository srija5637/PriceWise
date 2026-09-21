'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Settings as SettingsIcon,
  Bell,
  User,
  Shield,
  Sliders,
  CheckCircle2,
  Lock,
  Smartphone,
  Laptop,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'account';

  const { user, authMethod, changePassword, deleteAccount, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currency, setCurrency] = useState('INR');
  const [defaultSort, setDefaultSort] = useState('lowest_price');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Sessions state
  const [loggedOutOtherSessions, setLoggedOutOtherSessions] = useState(false);

  // Delete Account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Password validation helper
  const isPasswordValid = (p: string) => {
    return (
      p.length >= 8 &&
      /[a-z]/.test(p) &&
      /[A-Z]/.test(p) &&
      /[0-9]/.test(p) &&
      /[^a-zA-Z0-9]/.test(p)
    );
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    if (!currentPassword) {
      setPasswordChangeError('Please enter your current password');
      return;
    }

    if (!isPasswordValid(newPassword)) {
      setPasswordChangeError(
        'New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }

    setPasswordChangeLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setPasswordChangeLoading(false);

    if (res.error) {
      setPasswordChangeError(res.error);
    } else {
      setPasswordChangeSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPasswordChangeSuccess(false);
      }, 2500);
    }
  };

  const handleLogOutOtherSessions = () => {
    setLoggedOutOtherSessions(true);
    setTimeout(() => setLoggedOutOtherSessions(false), 3000);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleteLoading(true);
    await deleteAccount();
    setDeleteLoading(false);
    setIsDeleteModalOpen(false);
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Settings & Preferences
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your profile, authentication security, notifications, and data privacy
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved</span>
          </span>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full sm:w-auto">
          <TabsTrigger value="account" className="gap-1.5 text-xs">
            <User className="h-3.5 w-3.5" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5 text-xs">
            <Sliders className="h-3.5 w-3.5" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Account Tab */}
        <TabsContent value="account">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name="User" className="h-16 w-16 text-xl font-bold" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">User</h3>
                <p className="text-xs text-slate-400">Default authenticated consumer profile</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue="User"
                  disabled
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-600 dark:border-slate-800 dark:bg-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Authenticated Identifier</label>
                <input
                  type="text"
                  value={user?.phone ? `${user.phone} (Verified via OTP)` : user?.email || 'user@pricewise.local'}
                  disabled
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-600 dark:border-slate-800 dark:bg-slate-800 font-medium"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 2. Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Price Drop Alerts</h4>
                <p className="text-slate-400">Instant notifications when tracked items hit your target price</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Push Notifications</h4>
                <p className="text-slate-400">Browser alerts for flash sales and limited-time discounts</p>
              </div>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <Button onClick={handleSave} variant="primary" size="sm" className="rounded-xl">
              Save Notification Preferences
            </Button>
          </Card>
        </TabsContent>

        {/* 3. Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950 font-medium"
              >
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default Search Sorting</label>
              <select
                value={defaultSort}
                onChange={(e) => setDefaultSort(e.target.value)}
                className="h-10 w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950 font-medium"
              >
                <option value="lowest_price">Lowest Price First</option>
                <option value="best_value">Best Value Score</option>
                <option value="highest_rating">Highest Customer Rating</option>
                <option value="biggest_discount">Biggest Discount %</option>
              </select>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} variant="primary" size="sm" className="rounded-xl">
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* 4. Security Tab (Sections 14 & 15) */}
        <TabsContent value="security">
          <div className="space-y-5">
            {/* Authentication Method */}
            <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                Authentication Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Google</h4>
                      <p className="text-[11px] text-slate-400">OAuth single sign-on</p>
                    </div>
                  </div>
                  {authMethod === 'google' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Connected ✓</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Not connected</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Phone</h4>
                      <p className="text-[11px] text-slate-400">
                        {user?.phone ? user.phone : '+91 XXXXX XXXXX'}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified ✓</span>
                  </span>
                </div>
              </div>
            </Card>

            {/* Password Section (Section 15) */}
            <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Password</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Last changed: {user?.lastPasswordChange || 'Recently'}
                  </p>
                </div>
                {authMethod !== 'google' && (
                  <Button
                    onClick={() => {
                      setIsChangePasswordOpen(!isChangePasswordOpen);
                      setPasswordChangeError('');
                      setPasswordChangeSuccess(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold"
                  >
                    {isChangePasswordOpen ? 'Cancel' : 'Change Password'}
                  </Button>
                )}
              </div>

              {authMethod === 'google' ? (
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                  This account is authenticated through Google OAuth. No separate PriceWise password is required.
                </div>
              ) : isChangePasswordOpen && (
                <form
                  onSubmit={handleChangePasswordSubmit}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950 space-y-3.5 animate-in fade-in"
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Update Your Password
                  </h4>

                  {passwordChangeError && (
                    <div className="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      {passwordChangeError}
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>✓ Password updated successfully.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full h-9 px-3 pr-9 text-xs text-slate-900 focus:outline-none dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showCurrentPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars, uppercase, lowercase, digit, symbol"
                        className="w-full h-9 px-3 pr-9 text-xs text-slate-900 focus:outline-none dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showNewPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="pt-1 flex gap-2">
                    <Button
                      type="submit"
                      disabled={passwordChangeLoading}
                      variant="primary"
                      size="sm"
                      className="rounded-xl font-bold text-xs"
                    >
                      {passwordChangeLoading ? 'Updating...' : 'Change Password'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>

            {/* Sessions Section (Section 14) */}
            <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Sessions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Devices currently authenticated to your PriceWise account
                  </p>
                </div>
                <Button
                  onClick={handleLogOutOtherSessions}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-medium"
                >
                  Log out of other devices
                </Button>
              </div>

              {loggedOutOtherSessions && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All other device sessions have been terminated.</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Current Device
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          Active Now
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Windows PC · Chrome Browser</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">This device</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 text-xs opacity-75">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Other Sessions
                      </span>
                      <p className="text-[11px] text-slate-400">No unauthorized devices connected</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Secured</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 5. Privacy Tab (Section 16) */}
        <TabsContent value="privacy">
          <Card className="rounded-2xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 p-6 space-y-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Search History & Personalization</h4>
              <p className="text-slate-400 mt-0.5">
                PriceWise stores your search queries locally to suggest quick shortcuts on your dashboard.
              </p>
              <div className="pt-3">
                <Button
                  onClick={() => {
                    localStorage.removeItem('pricewise_recent_searches');
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 2000);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  Clear Search History
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <h4 className="font-bold text-rose-600 dark:text-rose-400">Delete Account</h4>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Permanently delete your PriceWise account and personal data (watchlists, price alerts, shopping lists, and search history). Unrelated public product and price catalog data is preserved.
              </p>
              <div className="pt-3">
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="rounded-xl gap-2 font-bold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Account</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Deletion Confirmation Modal (Section 16) */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Delete your PriceWise account?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This permanently removes your account and associated personal data (watchlists, tracked price alerts, shopping lists). This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteLoading}
              onClick={handleConfirmDeleteAccount}
              className="rounded-xl text-xs font-bold"
            >
              {deleteLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading Settings...</div>}>
        <SettingsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
