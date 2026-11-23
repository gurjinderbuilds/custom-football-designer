import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xs active:scale-[0.98]',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200/80',
        outline: 'border border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900 text-zinc-700 shadow-2xs',
        ghost: 'hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600',
        link: 'text-zinc-900 underline-offset-4 hover:underline',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-[11px]',
        lg: 'h-10 rounded-lg px-5 text-sm',
        icon: 'h-8 w-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
