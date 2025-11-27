import type { ButtonHTMLAttributes } from 'react';
import { cn } from './utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

const sizeClassName: Record<ButtonSize, string> = {
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn('btn', variantClassName[variant], sizeClassName[size], fullWidth && 'btn-block', className)}
      {...props}
    />
  );
}
