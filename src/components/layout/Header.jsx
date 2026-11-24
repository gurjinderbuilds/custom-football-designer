import { RotateCcw } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'
import { Button } from '../ui/button'

export default function Header() {
  const { resetCustomization } = useCustomization()

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Custom Vector American Football Studio Logo */}
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-950 via-zinc-900 to-zinc-950 text-white shadow-sm ring-1 ring-zinc-700/50 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-200"
              aria-hidden="true"
            >
              {/* Pointed oval ball outline */}
              <path
                d="M4 12 C4 6, 12 4, 20 12 C20 18, 12 20, 4 12 Z"
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
              />
              {/* Center laces */}
              <line x1="8" y1="12" x2="16" y2="12" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="10" y1="9.5" x2="10" y2="14.5" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="14" y1="9.5" x2="14" y2="14.5" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight whitespace-nowrap">
              <span className="hidden xs:inline">American </span>Football Studio
            </span>
            <span className="shrink-0 whitespace-nowrap inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-600 border border-zinc-200">
              4 Panels
            </span>
          </div>
        </div>

        {/* Right Action: Clean Reset button without redundant target badges */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetCustomization}
            className="h-7.5 sm:h-8 px-2.5 sm:px-3 text-xs gap-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 border-zinc-200/90 cursor-pointer active:scale-95 transition-all"
            title="Reset football to pristine factory defaults"
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-90" />
            <span className="text-xs font-medium">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
