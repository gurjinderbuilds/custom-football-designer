import { RotateCcw } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function Header() {
  const { resetCustomization } = useCustomization()

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-2xs shrink-0">
            <span className="text-base sm:text-lg">⚽</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight">
                Match Ball Studio
              </h1>
              <Badge variant="outline" className="border-zinc-300 font-mono text-[10px] text-zinc-600 px-1.5 py-0">
                32 Meshes
              </Badge>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 hidden xs:block">
              Bespoke football graphic & color customizer
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetCustomization}
            className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs gap-1.5 text-zinc-600 hover:text-zinc-900 cursor-pointer active:scale-95"
            title="Reset ball to default specifications"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
