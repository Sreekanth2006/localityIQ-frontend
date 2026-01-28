'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-primary-600 border border-neutral-200 hover:bg-neutral-50 focus:ring-neutral-500 shadow-sm',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-600',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500',
    success: 'bg-success text-white hover:bg-opacity-90 focus:ring-success',
    warning: 'bg-warning text-white hover:bg-opacity-90 focus:ring-warning',
    danger: 'bg-danger text-white hover:bg-opacity-90 focus:ring-danger'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
