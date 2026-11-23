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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/90 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md border border-slate-200/80">
      {/* Auto-rotate */}
      <button
        onClick={onToggleAutoRotate}
        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
          isAutoRotating
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        title="Toggle 360° Auto-Rotation"
      >
        <RotateCw className={`h-3.5 w-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span>{isAutoRotating ? 'Rotating' : 'Auto Rotate'}</span>
      </button>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* Orbit Steps */}
      <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-xl border border-slate-200/60">
        <button
          onClick={onRotateLeft}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Rotate Left"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRotateRight}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Rotate Right"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRotateUp}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Rotate Up"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRotateDown}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Rotate Down"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-xl border border-slate-200/60">
        <button
          onClick={onZoomIn}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onZoomOut}
          className="rounded-lg p-1.5 text-slate-700 hover:bg-white hover:shadow-xs transition cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-200 mx-0.5" />

      {/* Wireframe toggle */}
      <button
        onClick={onToggleWireframe}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition cursor-pointer ${
          isWireframe
            ? 'bg-amber-500 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
        title="Toggle Mesh Wireframe"
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        <span>Wireframe</span>
      </button>

      {/* Reset view */}
      <button
        onClick={onResetCamera}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        title="Reset Camera View"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
