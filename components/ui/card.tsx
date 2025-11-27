import type { HTMLAttributes } from 'react';
import { cn } from './utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
};

export default function Card({ title, subtitle, className, children, ...props }: Props) {
  return (
    <div className={cn('card', className)} {...props}>
      {title ? <div className="card-title">{title}</div> : null}
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </div>
  );
}
