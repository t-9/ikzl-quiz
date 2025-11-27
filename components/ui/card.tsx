import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function Card({ title, subtitle, action, className, children, ...props }: Props) {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <section className={cn('card', className)} {...props}>
      {hasHeader ? (
        <div className="card-header">
          <div>
            {title ? <div className="card-title">{title}</div> : null}
            {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="card-action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
