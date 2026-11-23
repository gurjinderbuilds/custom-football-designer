import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-zinc-900 text-zinc-50 shadow-xs',
        secondary: 'border-transparent bg-zinc-100 text-zinc-900',
        destructive: 'border-transparent bg-red-500 text-white shadow-xs',
        outline: 'text-zinc-700 border-zinc-200 bg-white',
        accent: 'border-indigo-200/80 bg-indigo-50 text-indigo-700'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
