import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
}

export function Avatar({ className, name = 'User', src, ...props }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div
      className={cn(
        'relative flex h-9 w-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-semibold text-white text-xs shadow-sm ring-2 ring-white/20',
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
