import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'bg-white text-ink border border-border hover:border-brand-300 hover:text-brand-600',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-subtle',
  danger:
    'bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
