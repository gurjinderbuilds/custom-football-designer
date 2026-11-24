import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Grid3X3,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

export default function FootballControls({
  isAutoRotating,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onRotateUp,
  onRotateDown,
  onResetCamera,
  isWireframe,
  onToggleWireframe
}) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1 sm:gap-1.5 rounded-2xl bg-zinc-950/85 px-2 sm:px-2.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md border border-zinc-800/80 text-zinc-300 max-w-[96%] select-none">
      {/* Auto-rotate toggle */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-95 ${isAutoRotating
          ? 'bg-white text-zinc-950 shadow-xs ring-1 ring-white/50'
          : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
          }`}
        title="Toggle 360° Auto-Rotation"
        aria-label="Toggle 360° Auto-Rotation"
      >
        <RotateCw className={`h-3.5 w-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">{isAutoRotating ? 'Rotating' : 'Auto Rotate'}</span>
        <span className="xs:hidden">{isAutoRotating ? 'Spin' : 'Rotate'}</span>
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-0.5 shrink-0" />

      {/* Directional Orbit Steps (Hidden on narrow mobile, available on sm screens) */}
      <div className="hidden sm:flex items-center gap-0.5 bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={onRotateLeft}
          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          title="Orbit Camera Left"
          aria-label="Orbit Left"
        >
          <ArrowLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateRight}
          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          title="Orbit Camera Right"
          aria-label="Orbit Right"
        >
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateUp}
          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          title="Orbit Camera Up"
          aria-label="Orbit Up"
        >
          <ArrowUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateDown}
          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          title="Orbit Camera Down"
          aria-label="Orbit Down"
        >
          <ArrowDown className="h-3 w-3" />
        </button>
      </div>

      <div className="hidden sm:block h-4 w-px bg-zinc-800 mx-0.5 shrink-0" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5 bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={onZoomIn}
          className="rounded-lg p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-90"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="rounded-lg p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-90"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-zinc-800 mx-0.5 shrink-0" />

      {/* Wireframe toggle */}
      <button
        type="button"
        onClick={onToggleWireframe}
        className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer active:scale-95 ${isWireframe
          ? 'bg-zinc-700 text-white ring-1 ring-zinc-500'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        title="Toggle Mesh Geometry Wireframe"
        aria-label="Toggle Wireframe"
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Wireframe</span>
      </button>

      {/* Reset camera */}
      <button
        type="button"
        onClick={onResetCamera}
        className="rounded-xl p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer active:scale-90"
        title="Reset Camera & Center Ball"
        aria-label="Reset Camera"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
