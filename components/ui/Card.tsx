import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className = '', ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`bg-white border border-border rounded-xl shadow-card ${
        hover ? 'transition-shadow hover:shadow-card-hover' : ''
      } ${className}`}
    />
  )
}
