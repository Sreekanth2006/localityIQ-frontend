'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-primary-100 text-primary-700',
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-accent-100 text-accent-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    outline: 'border border-primary-200 text-primary-700'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
