import { RotateCcw } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

export default function Header() {
  const { resetCustomization } = useCustomization()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Custom Football Studio
            </h1>
            <p className="text-[11px] text-slate-500">32-Mesh Interactive Designer</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetCustomization}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            title="Reset All Customizations"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  )
}
