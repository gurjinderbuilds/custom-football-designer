import { useRef, useState } from 'react'
import { Download, Check, X } from 'lucide-react'
import FootballCanvas from '../editor3d/FootballCanvas'
import FootballControls from '../editor3d/FootballControls'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function Render3DModal({ isOpen, onClose }) {
  const canvasRef = useRef(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [isWireframe, setIsWireframe] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        hideClose={true}
        className="max-w-6xl w-[96vw] h-[92dvh] p-0 gap-0 border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col rounded-xl sm:rounded-2xl"
      >
        {/* Header Bar */}
        <DialogHeader className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-md flex flex-row items-center justify-between space-y-0 shrink-0">
          {/* Left Title Area */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
            <span className="text-lg sm:text-xl shrink-0">⚽</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <DialogTitle className="text-xs sm:text-sm font-semibold text-white truncate">
                  3D Match Ball Studio
                </DialogTitle>
                <Badge variant="outline" className="border-zinc-700 bg-zinc-800/60 text-zinc-300 text-[10px] hidden xs:inline-flex">
                  32 Meshes
                </Badge>
              </div>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5 hidden sm:block truncate">
                Full-fidelity 360° interactive preview with studio lighting and physics normal map.
              </DialogDescription>
            </div>
          </div>

          {/* Right Action Cluster: Save Button + Close Button perfectly aligned */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownloadSnapshot}
              className="h-8 px-2.5 sm:px-3 text-xs gap-1.5 bg-white text-zinc-900 hover:bg-zinc-100 cursor-pointer active:scale-95 shadow-2xs font-semibold"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[11px]">Saved</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Save</span>
                </>
              )}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
                title="Close 3D View"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* 3D Canvas Body */}
        <div className="relative flex-1 w-full bg-radial from-zinc-900 to-zinc-950 overflow-hidden">
          <FootballCanvas
            ref={canvasRef}
            isAutoRotating={isAutoRotating}
            isWireframe={isWireframe}
            modelUrl="/models/circle-soccer-concave.glb"
          />

          {/* Floating Controls */}
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
      </DialogContent>
    </Dialog>
  )
}
