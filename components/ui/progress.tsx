import * as React from 'react';
import { cn } from '@/lib/utils';

export function Progress({
  value = 0,
  max = 100,
  className,
  indicatorClassName,
}: {
  value?: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        'relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        className
      )}
    >
      <div
        className={cn('h-full w-full flex-1 bg-blue-600 transition-all duration-300', indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
