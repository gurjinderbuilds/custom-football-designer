import { useState } from 'react'
import {
  Check,
  Grid,
  Map as MapIcon
} from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

// Helper to compute vertices of regular hexagon (6 sides)
function getHexagonPoints(cx, cy, r) {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return points.join(' ')
}

// Helper to compute vertices of regular pentagon (5 sides)
function getPentagonPoints(cx, cy, r) {
  const points = []
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return points.join(' ')
}

export default function Editor2D() {
  const {
    PANELS_DATA,
    selectionMode,
    setSelectionMode,
    selectedPanels,
    togglePanel,
    selectAllHexagons,
    selectAllPentagons,
    clearSelection,
    uploadedImage,
    colorSettings
  } = useCustomization()

  const [viewMode, setViewMode] = useState('map')
  const [hoveredPanel, setHoveredPanel] = useState(null)

  const hexagons = PANELS_DATA.filter((p) => p.type === 'hexagon')
  const pentagons = PANELS_DATA.filter((p) => p.type === 'pentagon')

  const isSingle = selectionMode === 'single'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* 1. Selection Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">1. Selection Mode</h2>
          <p className="text-xs text-slate-500">
            {isSingle
              ? 'Single Mesh Mode: click any panel to select it (replaces previous selection).'
              : 'Multiple Meshes Mode: select multiple panels to show the image across several panels.'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            onClick={() => setSelectionMode('single')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isSingle
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Single Mesh
          </button>
          <button
            onClick={() => setSelectionMode('multiple')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
              !isSingle
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multiple Meshes
          </button>
        </div>
      </div>

      {/* 2. 2D Panel Editor Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">2. 2D Panel Selection</h3>
          <p className="text-xs text-slate-500">
            {isSingle
              ? 'Select the single panel that will display the image.'
              : 'Select the panels that will display the image.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="2D Flat Map"
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Panels List"
            >
              <Grid className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Bulk Selectors (Only shown in Multiple Meshes mode) */}
          {!isSingle ? (
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={selectAllHexagons}
                className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Hexagons (20)
              </button>
              <button
                onClick={selectAllPentagons}
                className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Pentagons (12)
              </button>
              <button
                onClick={clearSelection}
                className="rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          ) : (
            selectedPanels.length > 0 && (
              <button
                onClick={clearSelection}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                Deselect
              </button>
            )
          )}
        </div>
      </div>

      {/* Selected indicator */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
        <span>
          {isSingle ? (
            selectedPanels.length > 0 ? (
              <span>
                Selected Panel: <strong className="text-slate-900 font-semibold">{PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title || selectedPanels[0]}</strong>
              </span>
            ) : (
              <span>No panel selected (click a panel below)</span>
            )
          ) : (
            <span>
              <strong className="text-slate-900 font-semibold">{selectedPanels.length}</strong> of 32 panels selected
            </span>
          )}
        </span>
        {selectedPanels.length === 0 ? (
          <span className="text-slate-400">Click a panel to select</span>
        ) : (
          <span className="text-indigo-600 font-medium">
            {uploadedImage ? 'Image active on selected panel' : 'Upload image below to display'}
          </span>
        )}
      </div>

      {/* View Mode 1: 2D Flat Football SVG Map */}
      {viewMode === 'map' && (
        <div className="relative select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-2 shadow-inner">
          <svg
            viewBox="0 0 900 480"
            className="h-[340px] sm:h-[400px] w-full"
            style={{ touchAction: 'manipulation' }}
          >
            <defs>
              {uploadedImage &&
                PANELS_DATA.map((p) => {
                  const size = p.type === 'hexagon' ? 70 : 64
                  return (
                    <pattern
                      key={`pat-${p.id}`}
                      id={`pattern-${p.id}`}
                      patternUnits="userSpaceOnUse"
                      x={p.flatX - size / 2}
                      y={p.flatY - size / 2}
                      width={size}
                      height={size}
                    >
                      <image
                        href={uploadedImage.url}
                        x="0"
                        y="0"
                        width={size}
                        height={size}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </pattern>
                  )
                })}
            </defs>

            {/* Render 32 Panels */}
            {PANELS_DATA.map((panel) => {
              const isSelected = selectedPanels.includes(panel.id)
              const isHovered = hoveredPanel === panel.id
              const isHex = panel.type === 'hexagon'

              let fillColor = isHex ? colorSettings.hexagonColor : (colorSettings.pentagonColor || colorSettings.circleColor)
              if (isSelected) {
                fillColor = uploadedImage ? `url(#pattern-${panel.id})` : '#4f46e5'
              }

              return (
                <g
                  key={panel.id}
                  onClick={() => togglePanel(panel.id)}
                  onMouseEnter={() => setHoveredPanel(panel.id)}
                  onMouseLeave={() => setHoveredPanel(null)}
                  className="cursor-pointer transition-transform duration-150"
                  style={{
                    transformOrigin: `${panel.flatX}px ${panel.flatY}px`,
                    transform: isHovered ? 'scale(1.1)' : isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {isHex ? (
                    <polygon
                      points={getHexagonPoints(panel.flatX, panel.flatY, 32)}
                      fill={fillColor}
                      stroke={isSelected ? '#6366f1' : isHovered ? '#38bdf8' : colorSettings.seamsColor}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                    />
                  ) : (
                    <polygon
                      points={getPentagonPoints(panel.flatX, panel.flatY, 28)}
                      fill={fillColor}
                      stroke={isSelected ? '#6366f1' : isHovered ? '#38bdf8' : colorSettings.seamsColor}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                    />
                  )}

                  <text
                    x={panel.flatX}
                    y={panel.flatY + (isSelected && uploadedImage ? -6 : 4)}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : isHex ? '#0f172a' : '#f8fafc'}
                    fontSize="11"
                    fontWeight="800"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      pointerEvents: 'none'
                    }}
                  >
                    {panel.label}
                  </text>

                  {isSelected && (
                    <g transform={`translate(${panel.flatX - 6}, ${panel.flatY + 5})`}>
                      <circle cx="6" cy="6" r="6" fill="#4f46e5" />
                      <path
                        d="M3.5 6 L5 7.5 L8.5 4.5"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-slate-950/75 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-xs">
            <span>
              {hoveredPanel ? (
                <span className="font-semibold text-white">
                  {PANELS_DATA.find((p) => p.id === hoveredPanel)?.title} ({PANELS_DATA.find((p) => p.id === hoveredPanel)?.type})
                  {' • '}
                  <span className="text-indigo-400">
                    {selectedPanels.includes(hoveredPanel)
                      ? 'Click to deselect'
                      : isSingle
                      ? 'Click to select this panel'
                      : 'Click to add to selection'}
                  </span>
                </span>
              ) : (
                isSingle
                  ? 'Single Mesh Mode: click a panel to select'
                  : 'Multiple Meshes Mode: click panels to toggle'
              )}
            </span>
          </div>
        </div>
      )}

      {/* View Mode 2: Categorized List */}
      {viewMode === 'grid' && (
        <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Hexagon Panels (20)
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {hexagons.map((p) => {
                const isSelected = selectedPanels.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePanel(p.id)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-bold mb-1"
                      style={{
                        backgroundColor: isSelected ? '#6366f1' : colorSettings.hexagonColor,
                        color: isSelected ? '#ffffff' : colorSettings.hexagonColor === '#ffffff' ? '#0f172a' : '#ffffff',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      {p.label}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">{p.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-2 w-2" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pentagon Panels (12)
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {pentagons.map((p) => {
                const isSelected = selectedPanels.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePanel(p.id)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-bold mb-1"
                      style={{
                        backgroundColor: isSelected ? '#6366f1' : (colorSettings.pentagonColor || colorSettings.circleColor),
                        color: '#ffffff',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      {p.label}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">{p.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-2 w-2" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
