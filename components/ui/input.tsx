import type { InputHTMLAttributes } from 'react';
import { cn } from './utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
};

export default function Input({ className, fullWidth = true, ...props }: Props) {
  return (
    <input
      className={cn('input', fullWidth ? 'input-block' : 'input-inline', className)}
      {...props}
    />
  );
}
