import { useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
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
      setErrorMsg('Image size exceeds 15MB. Please choose a smaller image.')
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
    <section className="flex flex-col gap-3.5 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">3. Upload Image</h2>
          <p className="text-xs text-zinc-500">
            {isSingle
              ? 'Upload logo or artwork to display on the selected panel.'
              : 'Upload logo or artwork to display on the selected panels.'}
          </p>
        </div>

        {selectedPanels.length > 0 ? (
          <Badge variant="outline" className="border-zinc-300 font-mono text-zinc-800 text-[11px]">
            {isSingle ? `Target: ${activePanelTitle}` : `${selectedPanels.length} Target Meshes`}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-zinc-500 text-[11px]">
            No meshes selected
          </Badge>
        )}
      </div>

      {/* Upload Drop Zone (when no image uploaded) */}
      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-6 sm:py-8 px-4 text-center cursor-pointer transition active:scale-[0.99] ${
            isDragging
              ? 'border-zinc-900 bg-zinc-100/80'
              : 'border-zinc-300 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 mb-2 shadow-2xs">
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold text-zinc-800">
            Tap to upload or drag & drop image
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            PNG, JPG, WEBP, or SVG (up to 15MB)
          </p>
        </div>
      ) : (
        /* Uploaded Image Card & Controls (Fully responsive on mobile) */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={uploadedImage.url}
              alt={uploadedImage.name}
              className="h-12 w-12 shrink-0 rounded-md object-contain bg-zinc-950 border border-zinc-300/80 shadow-2xs"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-900 truncate">
                {uploadedImage.name}
              </p>
              <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">
                {selectedPanels.length > 0
                  ? isSingle
                    ? `Active on ${activePanelTitle}`
                    : `Applied to ${selectedPanels.length} selected meshes`
                  : 'Select panel in step 2 to display this image'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/60">
            {/* Fit mode segmented toggle */}
            <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
              <Button
                type="button"
                size="sm"
                variant={imageFit === 'cover' ? 'default' : 'ghost'}
                onClick={() => setImageFit('cover')}
                className="h-7 px-2.5 text-[11px]"
              >
                Cover
              </Button>
              <Button
                type="button"
                size="sm"
                variant={imageFit === 'contain' ? 'default' : 'ghost'}
                onClick={() => setImageFit('contain')}
                className="h-7 px-2.5 text-[11px]"
              >
                Contain
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Change button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 px-2.5 text-[11px]"
              >
                Change
              </Button>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setUploadedImage(null)}
                className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                title="Remove image"
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
        <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
          {errorMsg}
        </div>
      )}
    </section>
  )
}
