import { useRef, useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">3. Upload Image</h2>
          <p className="text-xs text-slate-500">
            {isSingle
              ? 'Upload your logo or graphic to display on the selected panel.'
              : 'Upload your logo or graphic to display on the selected panels.'}
          </p>
        </div>

        {selectedPanels.length > 0 && (
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
            {isSingle
              ? `Target: ${activePanelTitle}`
              : `${selectedPanels.length} Target Panels`}
          </span>
        )}
      </div>

      {/* Upload Drop Zone */}
      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/60'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
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

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 mb-2.5">
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-xs font-semibold text-slate-800">
            Click to upload or drag & drop image
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG, WEBP, or SVG
          </p>
        </div>
      ) : (
        /* Uploaded Image Preview & Controls */
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={uploadedImage.url}
              alt={uploadedImage.name}
              className="h-12 w-12 rounded-lg object-contain bg-slate-900 border border-slate-200 shadow-2xs"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[320px]">
                {uploadedImage.name}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                {selectedPanels.length > 0
                  ? isSingle
                    ? `Active on ${activePanelTitle}`
                    : `Applied to ${selectedPanels.length} panels`
                  : 'Select panel in step 2 to display this image'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fit mode */}
            <div className="flex items-center rounded-lg bg-white p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setImageFit('cover')}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  imageFit === 'cover'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cover
              </button>
              <button
                onClick={() => setImageFit('contain')}
                className={`rounded px-2.5 py-1 font-semibold transition ${
                  imageFit === 'contain'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contain
              </button>
            </div>

            {/* Change button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Change
            </button>
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

            {/* Remove */}
            <button
              onClick={() => setUploadedImage(null)}
              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700 border border-rose-200">
          {errorMsg}
        </div>
      )}
    </div>
  )
}
