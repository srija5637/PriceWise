'use client';

import React from 'react';
import { Users, ShieldCheck, Smartphone, CheckCircle2, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export default function AdminUsersPage() {
  const users = [
    {
      id: 'usr_default_consumer',
      displayName: 'User',
      identifier: '+91 98765 43210',
      authMethod: 'Phone + OTP',
      verified: true,
      role: 'Consumer',
      joinedAt: '2026-09-18',
    },
    {
      id: 'usr_google_83921',
      displayName: 'User',
      identifier: 'user.buyer@gmail.com',
      authMethod: 'Google OAuth',
      verified: true,
      role: 'Consumer',
      joinedAt: '2026-09-19',
    },
    {
      id: 'usr_phone_99214',
      displayName: 'User',
      identifier: '+91 91234 56789',
      authMethod: 'Phone + OTP',
      verified: true,
      role: 'Consumer',
      joinedAt: '2026-09-20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          User Directory & Authentication Security
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Verified consumer profiles and Supabase RLS privacy isolation (Section 74)
        </p>
      </div>

      <Card className="rounded-3xl border-slate-200/80 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-950/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Display Profile</th>
                <th className="p-4">Identifier</th>
                <th className="p-4">Auth Method</th>
                <th className="p-4">Verification</th>
                <th className="p-4">RLS Privacy</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.displayName} className="h-7 w-7 text-xs font-bold" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {u.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                    {u.identifier}
                  </td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                    {u.authMethod}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified ✓</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <Lock className="h-3 w-3" />
                      <span>auth.uid() Isolated</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {u.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
