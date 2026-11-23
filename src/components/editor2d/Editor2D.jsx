import { useState } from 'react'
import {
  Check,
  Grid,
  Map as MapIcon
} from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

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
    <section className="flex flex-col gap-3.5 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-5 shadow-2xs">
      {/* 1. Selection Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">1. Selection Mode</h2>
          <p className="text-xs text-zinc-500">
            {isSingle
              ? 'Target a single panel for logo placement.'
              : 'Target multiple panels simultaneously across the ball surface.'}
          </p>
        </div>

        {/* Mode Toggle with shadcn Button styling (Full width on mobile) */}
        <div className="grid grid-cols-2 sm:inline-flex rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 w-full sm:w-auto shrink-0">
          <Button
            type="button"
            size="sm"
            variant={isSingle ? 'default' : 'ghost'}
            onClick={() => setSelectionMode('single')}
            className={`h-8 sm:h-7 px-3 text-xs font-semibold ${
              isSingle
                ? 'bg-white text-zinc-900 shadow-2xs hover:bg-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Single Mesh
          </Button>
          <Button
            type="button"
            size="sm"
            variant={!isSingle ? 'default' : 'ghost'}
            onClick={() => setSelectionMode('multiple')}
            className={`h-8 sm:h-7 px-3 text-xs font-semibold ${
              !isSingle
                ? 'bg-white text-zinc-900 shadow-2xs hover:bg-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Multiple Meshes
          </Button>
        </div>
      </div>

      {/* 2. 2D Panel Selection Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">2. 2D Surface Selection</h3>
          <p className="text-xs text-zinc-500">
            Click panels on the unfolded map or switch to grid view for easy tapping.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex self-start sm:self-auto rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 shrink-0">
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            onClick={() => setViewMode('map')}
            className={`h-7 px-2.5 text-xs gap-1.5 ${
              viewMode === 'map'
                ? 'bg-white text-zinc-900 shadow-2xs hover:bg-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
            title="Interactive 2D Flat Map"
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Map View</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className={`h-7 px-2.5 text-xs gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-zinc-900 shadow-2xs hover:bg-white'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
            title="Panel Roster Grid"
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Grid View</span>
          </Button>
        </div>
      </div>

      {/* Bulk action toolbar (Only shown in Multiple Meshes mode or when active) */}
      {!isSingle ? (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 mr-1 hidden xs:inline">Quick Select:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllHexagons}
            className="h-7 px-2.5 text-[11px] bg-zinc-50/50"
          >
            Hexagons (20)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllPentagons}
            className="h-7 px-2.5 text-[11px] bg-zinc-50/50"
          >
            Pentagons (12)
          </Button>
          {selectedPanels.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-7 px-2 text-[11px] text-zinc-500 hover:text-zinc-900 ml-auto sm:ml-0"
            >
              Clear
            </Button>
          )}
        </div>
      ) : (
        selectedPanels.length > 0 && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs text-zinc-500">
              Target mesh: <strong className="font-mono text-zinc-800">{PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title}</strong>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="h-6 px-2 text-[11px] text-zinc-600 hover:text-zinc-900"
            >
              Deselect
            </Button>
          </div>
        )
      )}

      {/* Selected indicator status bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/80">
        <span className="flex items-center gap-1.5 min-w-0">
          {isSingle ? (
            selectedPanels.length > 0 ? (
              <span className="truncate">
                Active: <strong className="font-mono text-zinc-900">{PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title || selectedPanels[0]}</strong>
              </span>
            ) : (
              <span className="text-zinc-400">Tap any panel below to select</span>
            )
          ) : (
            <span>
              Selected: <strong className="font-mono text-zinc-900">{selectedPanels.length}</strong> of 32 panels
            </span>
          )}
        </span>

        {selectedPanels.length > 0 ? (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-semibold shrink-0">
            {uploadedImage ? 'Graphic rendered' : 'Awaiting image'}
          </Badge>
        ) : (
          <span className="text-[11px] text-zinc-400 font-medium shrink-0">Ready</span>
        )}
      </div>

      {/* View Mode 1: 2D Flat Football SVG Map (Proportional Aspect Ratio) */}
      {viewMode === 'map' && (
        <div className="relative select-none overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 p-1 sm:p-2 shadow-inner">
          <svg
            viewBox="0 0 900 480"
            className="w-full h-auto aspect-[900/480] min-h-[220px] max-h-[460px] block"
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
                fillColor = uploadedImage ? `url(#pattern-${panel.id})` : '#3b82f6'
              }

              return (
                <g
                  key={panel.id}
                  onClick={() => togglePanel(panel.id)}
                  onMouseEnter={() => setHoveredPanel(panel.id)}
                  onMouseLeave={() => setHoveredPanel(null)}
                  className="cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    transformOrigin: `${panel.flatX}px ${panel.flatY}px`,
                    transform: isHovered ? 'scale(1.08)' : isSelected ? 'scale(1.04)' : 'scale(1)'
                  }}
                >
                  {isHex ? (
                    <polygon
                      points={getHexagonPoints(panel.flatX, panel.flatY, 32)}
                      fill={fillColor}
                      stroke={isSelected ? '#38bdf8' : isHovered ? '#94a3b8' : colorSettings.seamsColor}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.2 : 1.2}
                    />
                  ) : (
                    <polygon
                      points={getPentagonPoints(panel.flatX, panel.flatY, 28)}
                      fill={fillColor}
                      stroke={isSelected ? '#38bdf8' : isHovered ? '#94a3b8' : colorSettings.seamsColor}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.2 : 1.2}
                    />
                  )}

                  <text
                    x={panel.flatX}
                    y={panel.flatY + (isSelected && uploadedImage ? -6 : 4)}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : isHex ? '#0f172a' : '#f8fafc'}
                    fontSize="11"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                      pointerEvents: 'none'
                    }}
                  >
                    {panel.label}
                  </text>

                  {isSelected && (
                    <g transform={`translate(${panel.flatX - 6}, ${panel.flatY + 5})`}>
                      <circle cx="6" cy="6" r="6" fill="#0284c7" />
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

          {/* Hover / Tap metadata readout bar */}
          <div className="mt-1.5 flex items-center justify-between rounded-md bg-zinc-900/90 px-2.5 py-1 text-[11px] text-zinc-300 border border-zinc-800">
            <span className="truncate mr-2">
              {hoveredPanel ? (
                <span className="font-medium text-white">
                  {PANELS_DATA.find((p) => p.id === hoveredPanel)?.title} ({PANELS_DATA.find((p) => p.id === hoveredPanel)?.type})
                  {' • '}
                  <span className="text-sky-400">
                    {selectedPanels.includes(hoveredPanel)
                      ? 'Tap to deselect'
                      : isSingle
                      ? 'Tap to select this mesh'
                      : 'Tap to add'}
                  </span>
                </span>
              ) : (
                <span className="text-zinc-400">
                  {isSingle
                    ? 'Tap any panel on map to target'
                    : 'Tap panels to toggle selection'}
                </span>
              )}
            </span>
            <span className="font-mono text-[10px] text-zinc-500 shrink-0">
              32 Panels
            </span>
          </div>
        </div>
      )}

      {/* View Mode 2: Roster Grid (Touch-friendly cards) */}
      {viewMode === 'grid' && (
        <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-0.5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-700">
                Hexagons (20 panels)
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">H01 – H20</span>
            </div>
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {hexagons.map((p) => {
                const isSelected = selectedPanels.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePanel(p.id)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer min-h-[58px] active:scale-95 ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60'
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold mb-1 shadow-2xs"
                      style={{
                        backgroundColor: isSelected ? '#0f172a' : colorSettings.hexagonColor,
                        color: isSelected ? '#ffffff' : colorSettings.hexagonColor === '#ffffff' ? '#0f172a' : '#ffffff',
                        border: '1px solid #d4d4d8'
                      }}
                    >
                      {p.label}
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-700">{p.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 text-white">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-700">
                Pentagons (12 panels)
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">P01 – P12</span>
            </div>
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
              {pentagons.map((p) => {
                const isSelected = selectedPanels.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePanel(p.id)}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer min-h-[58px] active:scale-95 ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60'
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold mb-1 shadow-2xs"
                      style={{
                        backgroundColor: isSelected ? '#0f172a' : (colorSettings.pentagonColor || colorSettings.circleColor),
                        color: '#ffffff',
                        border: '1px solid #d4d4d8'
                      }}
                    >
                      {p.label}
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-700">{p.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-900 text-white">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
