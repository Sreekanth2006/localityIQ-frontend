'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-xl transition-all duration-200'
  
  const variants = {
    default: 'bg-white border border-primary-200 shadow-soft',
    elevated: 'bg-white border border-primary-200 shadow-medium',
    glass: 'bg-white/90 backdrop-blur-md border border-primary-200/50 shadow-soft',
    primary: 'bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 shadow-soft'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-medium hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
