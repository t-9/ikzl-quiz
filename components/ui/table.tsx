import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from './utils';

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('table', className)} {...props} />;
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={className} {...props} />;
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TH({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={className} {...props} />;
}

export function TD({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={className} {...props} />;
}
