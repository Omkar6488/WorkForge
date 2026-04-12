import { cn } from '@/lib/cn'
import {
  forwardRef,
  type ForwardedRef,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-500/40 dark:bg-brand-500 dark:hover:bg-brand-400',
  secondary:
    'bg-surface-0 text-slate-800 shadow-sm ring-1 ring-slate-200/80 hover:bg-surface-2 dark:bg-surface-2 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-surface-3',
  ghost:
    'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/5',
  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500/40',
} as const

type Variant = keyof typeof variants

export type ButtonProps = {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  to?: LinkProps['to']
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      to,
      disabled,
      children,
      onClick,
    },
    ref,
  ) {
    const sizes = {
      sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-xl gap-2',
      lg: 'h-11 px-5 text-[15px] rounded-xl gap-2',
    }
    const classes = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 dark:focus-visible:ring-offset-surface-0',
      'disabled:pointer-events-none disabled:opacity-45 active:scale-[0.99]',
      variants[variant],
      sizes[size],
      className,
    )

    if (to) {
      return (
        <Link
          to={to}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          aria-disabled={disabled || undefined}
          className={cn(classes, disabled && 'pointer-events-none opacity-45')}
        >
          {children}
        </Link>
      )
    }

    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        className={classes}
      >
        {children}
      </button>
    )
  },
)
