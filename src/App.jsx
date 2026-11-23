import { useRef, useState } from 'react'
import { CustomizationProvider, useCustomization } from './context/CustomizationContext'
import Header from './components/layout/Header'
import Editor2D from './components/editor2d/Editor2D'
import ImageUploader from './components/upload/ImageUploader'
import ColorCustomizer from './components/colors/ColorCustomizer'
import FootballCanvas from './components/editor3d/FootballCanvas'
import FootballControls from './components/editor3d/FootballControls'
import Render3DModal from './components/modal/Render3DModal'
import { Maximize2 } from 'lucide-react'

function CustomizerContent() {
  const {
    is3DModalOpen,
    setIs3DModalOpen,
    selectedPanels
  } = useCustomization()

  const canvasRef = useRef(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isWireframe, setIsWireframe] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Minimal Header */}
      <Header />

      {/* Vertical Flow Main Content */}
      <main className="mx-auto flex-1 w-full max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-5">
          {/* 1. Selection Mode & 2. 2D Panel Selection */}
          <Editor2D />

          {/* 3. Image Selection / Upload */}
          <ImageUploader />

          {/* 4. Color Options for Other Meshes */}
          <ColorCustomizer />

          {/* 5. Direct 3D Preview with Large View Option */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">5. 3D Football Preview</h2>
                <p className="text-xs text-slate-500">
                  Interactive 3D preview with images and colors rendered directly on the 32 meshes.
                </p>
              </div>

              {/* Large View Option */}
              <button
                onClick={() => setIs3DModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
                title="Expand to Fullscreen 3D View"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Large View</span>
              </button>
            </div>

            {/* Direct 3D Viewer Canvas */}
            <div className="relative h-[440px] sm:h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <FootballCanvas
                ref={canvasRef}
                isAutoRotating={isAutoRotating}
                isWireframe={isWireframe}
                modelUrl="/models/circle-soccer-concave.glb"
              />

              {/* Floating Orbit & Zoom Controls */}
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

            {/* Status footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>32 Individual Meshes • Instant Live Sync</span>
              </span>
              <span className="font-semibold text-slate-700">
                {selectedPanels.length} image mesh{selectedPanels.length === 1 ? '' : 'es'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Large View 3D Modal */}
      <Render3DModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <CustomizationProvider>
      <CustomizerContent />
    </CustomizationProvider>
  )
}
