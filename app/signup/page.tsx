'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=signup');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
    </div>
  );
}
