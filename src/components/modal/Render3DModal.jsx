import { useRef, useState } from 'react'
import {
  X,
  Download,
  Layers
} from 'lucide-react'
import FootballCanvas from '../editor3d/FootballCanvas'
import FootballControls from '../editor3d/FootballControls'
import { useCustomization } from '../../context/CustomizationContext'

export default function Render3DModal({ isOpen, onClose }) {
  const {
    selectedPanels,
    uploadedImage,
    colorSettings,
    selectionMode,
    PANELS_DATA
  } = useCustomization()

  const canvasRef = useRef(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isWireframe, setIsWireframe] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  if (!isOpen) return null

  const isSingle = selectionMode === 'single'
  const activePanelTitle = selectedPanels.length > 0
    ? PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title || selectedPanels[0]
    : null

  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.captureScreenshot()
    if (!dataUrl) return

    const link = document.createElement('a')
    link.download = `custom-football-${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col h-full max-h-[92vh] w-full max-w-6xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <span className="text-xl">⚽</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Your Customized 3D Football</h2>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  32 Meshes Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive 3D preview with PBR studio lighting, rotate 360°, and zoom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Snapshot Download Button */}
            <button
              onClick={handleDownloadSnapshot}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Snapshot'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close 3D View"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Body */}
        <div className="relative flex-1 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
          <FootballCanvas
            ref={canvasRef}
            isAutoRotating={isAutoRotating}
            isWireframe={isWireframe}
            modelUrl="/models/circle-soccer-concave.glb"
          />

          {/* Floating Orbit Controls */}
          <FootballControls
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={() => setIsAutoRotating((prev) => !prev)}
            onZoomIn={() => canvasRef.current?.zoomIn()}
            onZoomOut={() => canvasRef.current?.zoomOut()}
            onRotateLeft={() => canvasRef.current?.rotateLeft()}
            onRotateRight={() => canvasRef.current?.rotateRight()}
            onRotateUp={() => canvasRef.current?.rotateUp()}
            onRotateDown={() => canvasRef.current?.rotateDown()}
            onResetCamera={() => {
              canvasRef.current?.resetCamera()
              setIsAutoRotating(true)
            }}
            isWireframe={isWireframe}
            onToggleWireframe={() => setIsWireframe((prev) => !prev)}
          />
        </div>

        {/* Modal Bottom Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-semibold text-white">
                {isSingle
                  ? activePanelTitle ? `1 panel (${activePanelTitle})` : '0 panels'
                  : `${selectedPanels.length} panels`}
              </span>
              <span className="text-slate-400">showing image</span>
            </div>

            {uploadedImage && (
              <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <img
                  src={uploadedImage.url}
                  alt={uploadedImage.name}
                  className="h-4 w-4 rounded object-cover"
                />
                <span className="font-medium text-white truncate max-w-[140px]">
                  {uploadedImage.name}
                </span>
              </div>
            )}
          </div>

          {/* Active Colors Swatches */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Mesh Colors:</span>
            <div className="flex items-center gap-1.5" title="Hexagons Color">
              <span
                className="h-3.5 w-3.5 rounded-full border border-slate-600"
                style={{ backgroundColor: colorSettings.hexagonColor }}
              />
              <span className="text-[11px] text-slate-400">Hexagons</span>
            </div>
            <div className="flex items-center gap-1.5" title="Pentagons Color">
              <span
                className="h-3.5 w-3.5 rounded-full border border-slate-600"
                style={{ backgroundColor: colorSettings.pentagonColor || colorSettings.circleColor }}
              />
              <span className="text-[11px] text-slate-400">Pentagons</span>
            </div>
            <div className="flex items-center gap-1.5" title="Seams Color">
              <span
                className="h-3.5 w-3.5 rounded-full border border-slate-600"
                style={{ backgroundColor: colorSettings.seamsColor }}
              />
              <span className="text-[11px] text-slate-400">Seams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
