import type { ButtonHTMLAttributes } from 'react';
import { cn } from './utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={cn('btn', variant === 'secondary' && 'btn-secondary', className)}
      {...props}
    />
  );
}
