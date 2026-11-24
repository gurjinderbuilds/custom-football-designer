import { useRef, useState } from 'react'
import { Upload, Trash2, AlertCircle } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function ImageUploader() {
  const {
    uploadedImage,
    setUploadedImage,
    imageFit,
    setImageFit,
    selectedPanels,
    selectionMode,
    PANELS_DATA
  } = useCustomization()

  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isSingle = selectionMode === 'single'
  const activePanelTitle = selectedPanels.length > 0
    ? PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title || selectedPanels[0]
    : null

  const handleFileProcess = (file) => {
    setErrorMsg('')
    if (!file) return

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid image (PNG, JPG, WEBP, or SVG).')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB limit. Please choose a smaller image.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setUploadedImage({
      id: 'custom-' + Date.now(),
      name: file.name,
      url: objectUrl,
      file
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">3. Upload Artwork / Logo</h2>
          <p className="text-xs text-zinc-500">
            {isSingle
              ? 'Upload team logo or custom graphics to print on the selected football panel.'
              : 'Upload team logo or custom graphics to print across selected panels.'}
          </p>
        </div>

        {selectedPanels.length > 0 ? (
          <Badge variant="outline" className="border-zinc-300 font-mono text-zinc-800 text-[11px] px-2 py-0.5 shadow-2xs">
            {isSingle ? `Target: ${activePanelTitle}` : `${selectedPanels.length} Target Panels`}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-zinc-500 text-[11px]">
            No panels selected
          </Badge>
        )}
      </div>

      {/* Upload Drop Zone (when no image uploaded) */}
      {!uploadedImage ? (
        <div className="flex flex-col gap-3">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed py-7 sm:py-8 px-4 text-center cursor-pointer transition-all active:scale-[0.99] ${isDragging
              ? 'border-zinc-900 bg-zinc-100/90 ring-2 ring-zinc-900/10'
              : 'border-zinc-300 bg-zinc-50/60 hover:border-zinc-400 hover:bg-zinc-50'
              }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-zinc-200/90 text-zinc-700 mb-2.5 shadow-xs">
              <Upload className="h-5 w-5" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-zinc-800">
              Tap to browse file or drag & drop artwork
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Supports PNG, JPG, WEBP, or SVG • Up to 15MB
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-zinc-200/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                Auto UV Unwrap
              </span>
              <span className="inline-flex items-center rounded-md bg-zinc-200/60 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                PBR Sync
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-zinc-800">
            Tap to upload or drag & drop logo
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            PNG, JPG, WEBP, or SVG (up to 15MB)
          </p>
        </div>
      ) : (
        /* Uploaded Image Card & Controls */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-300 shadow-xs flex items-center justify-center p-1">
              <img
                src={uploadedImage.url}
                alt={uploadedImage.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                  {uploadedImage.name}
                </p>
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[9px] px-1 py-0">
                  Active
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">
                {selectedPanels.length > 0
                  ? isSingle
                    ? `Active on ${activePanelTitle}`
                    : `Applied to ${selectedPanels.length} selected panels`
                  : 'Select a panel in step 2 to display this logo'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-200/70">
            {/* Fit mode segmented toggle */}
            <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setImageFit('cover')}
                className={`h-7 px-2.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${imageFit === 'cover'
                  ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
                  }`}
              >
                Cover
              </button>
              <button
                type="button"
                onClick={() => setImageFit('contain')}
                className={`h-7 px-2.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${imageFit === 'contain'
                  ? 'bg-zinc-900 text-white shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
                  }`}
              >
                Contain
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Change button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 px-2.5 text-[11px] font-medium border-zinc-300 active:scale-95"
              >
                Replace
              </Button>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setUploadedImage(null)}
                className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-colors"
                title="Remove image"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0])
          }
        }}
      />

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </section>
  )
}
