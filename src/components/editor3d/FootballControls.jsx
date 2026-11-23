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
    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1 rounded-xl bg-zinc-950/90 px-2 py-1.5 shadow-xl backdrop-blur-md border border-zinc-800 text-zinc-300 max-w-[94%]">
      {/* Auto-rotate */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 cursor-pointer ${
          isAutoRotating
            ? 'bg-zinc-100 text-zinc-950 shadow-2xs'
            : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
        title="Toggle 360° Auto-Rotation"
      >
        <RotateCw className={`h-3 w-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">{isAutoRotating ? 'Rotating' : 'Auto Rotate'}</span>
        <span className="xs:hidden">{isAutoRotating ? 'Stop' : 'Rotate'}</span>
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-0.5 shrink-0" />

      {/* Orbit Steps - Hidden on small mobile to prevent wrapping, available on sm screens */}
      <div className="hidden sm:flex items-center gap-0.5 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={onRotateLeft}
          className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          title="Rotate Left"
        >
          <ArrowLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateRight}
          className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          title="Rotate Right"
        >
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateUp}
          className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          title="Rotate Up"
        >
          <ArrowUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onRotateDown}
          className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          title="Rotate Down"
        >
          <ArrowDown className="h-3 w-3" />
        </button>
      </div>

      <div className="hidden sm:block h-4 w-px bg-zinc-800 mx-0.5 shrink-0" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 shrink-0">
        <button
          type="button"
          onClick={onZoomIn}
          className="rounded p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer active:scale-95"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="rounded p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer active:scale-95"
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
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition shrink-0 cursor-pointer ${
          isWireframe
            ? 'bg-zinc-700 text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
        title="Toggle Mesh Wireframe"
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Wireframe</span>
      </button>

      {/* Reset camera */}
      <button
        type="button"
        onClick={onResetCamera}
        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0 cursor-pointer active:scale-95"
        title="Reset Camera View"
        aria-label="Reset Camera View"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
