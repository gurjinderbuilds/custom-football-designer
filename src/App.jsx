import { useRef, useState } from 'react'
import { CustomizationProvider, useCustomization } from './context/CustomizationContext'
import Header from './components/layout/Header'
import Editor2D from './components/editor2d/Editor2D'
import ImageUploader from './components/upload/ImageUploader'
import ColorCustomizer from './components/colors/ColorCustomizer'
import FootballCanvas from './components/editor3d/FootballCanvas'
import FootballControls from './components/editor3d/FootballControls'
import Render3DModal from './components/modal/Render3DModal'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
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
    <div className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Studio Header */}
      <Header />

      {/* Vertical Flow Main Content */}
      <main className="mx-auto flex-1 w-full max-w-4xl px-3 sm:px-4 py-3 sm:py-6">
        <div className="flex flex-col gap-3.5 sm:gap-5">
          {/* 1. Selection Mode & 2. 2D Surface Selection */}
          <Editor2D />

          {/* 3. Image Selection / Upload */}
          <ImageUploader />

          {/* 4. Colors for Leather, Laces & Seams */}
          <ColorCustomizer />

          {/* 5. Direct 3D American Football Preview */}
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">5. 3D Football Preview</h2>
                <p className="text-xs text-zinc-500 hidden xs:block">
                  Interactive real-time 3D rendered American football. Rotate 360° to inspect alignment.
                </p>
              </div>

              {/* Large View Option */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIs3DModalOpen(true)}
                className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs gap-1.5 text-zinc-700 hover:text-zinc-900 shrink-0 cursor-pointer active:scale-95"
                title="Expand to Fullscreen 3D View"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Large View</span>
              </Button>
            </div>

            {/* Direct 3D Viewer Canvas */}
            <div className="relative h-[300px] xs:h-[360px] sm:h-[460px] md:h-[500px] w-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
              <FootballCanvas
                ref={canvasRef}
                isAutoRotating={isAutoRotating}
                isWireframe={isWireframe}
                modelUrl="/models/American-football.obj"
                mtlUrl="/models/American-football.mtl"
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

            {/* Status footer with tabular numerals */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium text-[11px]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>4 Panels Active • Live Material Sync</span>
              </span>
              <Badge variant="outline" className="border-zinc-300 font-mono text-zinc-700 text-[10px]">
                {selectedPanels.length} graphic panel{selectedPanels.length === 1 ? '' : 's'}
              </Badge>
            </div>
          </section>
        </div>
      </main>

      {/* 3D Rendered Result Modal Dialog */}
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
