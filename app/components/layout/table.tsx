import type {TdHTMLAttributes, ThHTMLAttributes} from 'react';
import React from 'react';
import {tw} from '~/utils/tw';

export function Table({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={tw('w-full table-auto border-collapse', className)}>
      {children}
    </table>
  );
}

interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

export function Th({children, className, ...props}: ThProps) {
  return (
    <th
      className={tw(
        'p-4 text-left font-normal text-gray-600 md:border-b md:px-6',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Tr({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <tr className={tw('hover:bg-gray-50', className)}>{children}</tr>;
}

interface TdProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

export function Td({children, className, ...props}: TdProps) {
  return (
    <td
      className={tw('whitespace-nowrap border-b p-4 md:px-6', className)}
      {...props}
    >
      {children}
    </td>
  );
}
