import { useState } from 'react'
import {
  Check,
  LayoutGrid,
  Map as MapIcon,
  Sparkles,
  X
} from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'
import { getFootballPanelPath } from '../../data/panelsData'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function Editor2D() {
  const {
    PANELS_DATA,
    selectionMode,
    setSelectionMode,
    selectedPanels,
    togglePanel,
    selectAllPanels,
    selectTopBottomPanels,
    selectSidePanels,
    clearSelection,
    uploadedImage,
    colorSettings
  } = useCustomization()

  const [viewMode, setViewMode] = useState('map')
  const [hoveredPanel, setHoveredPanel] = useState(null)

  const isSingle = selectionMode === 'single'
  const leatherColor = colorSettings.leatherColor || '#854d0e'
  const lacesColor = colorSettings.lacesColor || '#ffffff'
  const seamsColor = colorSettings.seamsColor || '#3b1d07'

  return (
    <section className="flex flex-col gap-3.5 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-5 shadow-2xs">
      {/* 1. Selection Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">1. Selection Mode</h2>
          <p className="text-xs text-zinc-500">
            {isSingle
              ? 'Target a single football panel for logo / graphic placement.'
              : 'Target multiple football panels simultaneously.'}
          </p>
        </div>

        {/* Mode Toggle with segmented control styling */}
        <div className="grid grid-cols-2 sm:inline-flex rounded-xl border border-zinc-200 bg-zinc-100/90 p-1 w-full sm:w-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setSelectionMode('single')}
            className={`flex items-center justify-center gap-1.5 h-7.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSingle
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Single Panel
          </button>
          <button
            type="button"
            onClick={() => setSelectionMode('multiple')}
            className={`flex items-center justify-center gap-1.5 h-7.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isSingle
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            Multiple Panels
          </button>
        </div>
      </div>

      {/* 2. 2D Panel Selection Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">2. 2D Surface Selection</h3>
          <p className="text-xs text-zinc-500">
            Click any of the 4 unfolded football panels to assign print artwork.
          </p>
        </div>

        {/* View Toggle: Map View vs Grid View */}
        <div className="inline-flex self-start sm:self-auto rounded-xl border border-zinc-200 bg-zinc-100/90 p-1 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
            title="Interactive 2D Flat Map"
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
            title="Panel Roster Grid"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Quick Select toolbar (Only shown in Multiple Panels mode) */}
      {!isSingle && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-zinc-400 mr-1 hidden xs:inline">Quick Select:</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllPanels}
            className="h-7 px-2.5 text-[11px] bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 active:scale-95 transition-all"
          >
            All 4 Panels
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectTopBottomPanels}
            className="h-7 px-2.5 text-[11px] bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 active:scale-95 transition-all"
          >
            Top & Bottom (P01, P03)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectSidePanels}
            className="h-7 px-2.5 text-[11px] bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 active:scale-95 transition-all"
          >
            Lateral Sides (P02, P04)
          </Button>
          {selectedPanels.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-7 px-2 text-[11px] text-zinc-500 hover:text-zinc-900 ml-auto sm:ml-0 active:scale-95"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Selection
            </Button>
          )}
        </div>
      )}

      {/* Unified Target & Selection Status Bar (No redundant duplicate bars) */}
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-600 bg-zinc-50/90 px-3 py-2 rounded-xl border border-zinc-200/80 min-h-[38px]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`flex h-2 w-2 rounded-full shrink-0 ${
              selectedPanels.length > 0 ? 'bg-sky-500' : 'bg-zinc-300'
            }`}
          />
          <span className="truncate text-xs">
            {isSingle ? (
              selectedPanels.length > 0 ? (
                <>
                  Target: <strong className="font-mono text-zinc-900">{PANELS_DATA.find((p) => p.id === selectedPanels[0])?.title || selectedPanels[0]}</strong>
                </>
              ) : (
                <span className="text-zinc-500">Tap any panel to select for customization</span>
              )
            ) : (
              <span>
                Selected: <strong className="font-mono text-zinc-900">{selectedPanels.length}</strong> of 4 panels
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedPanels.length > 0 && (
            <>
              {uploadedImage ? (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50/90 text-emerald-800 text-[10px] font-semibold shrink-0 gap-1 hidden xs:inline-flex"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Graphic Rendered</span>
                </Badge>
              ) : (
                <span className="text-[10px] text-zinc-400 font-medium hidden xs:inline">Awaiting image</span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="h-6.5 px-2 text-[11px] text-zinc-600 hover:text-zinc-900 bg-white shadow-2xs cursor-pointer active:scale-95"
                title="Deselect active panel"
              >
                Deselect
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View Mode 1: 2D Flat Football SVG Map (Tighter ViewBox for full mobile responsiveness) */}
      {viewMode === 'map' && (
        <div className="relative select-none overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 p-1.5 sm:p-2.5 shadow-inner">
          <svg
            viewBox="20 45 890 170"
            className="w-full h-auto aspect-[890/170] block"
            style={{ touchAction: 'manipulation' }}
          >
            <defs>
              {/* Subtle mesh glow filter for active panels */}
              <filter id="meshGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Render dynamic image patterns for customized panels */}
              {uploadedImage &&
                PANELS_DATA.map((p) => {
                  const patW = p.width
                  const patH = p.height
                  return (
                    <pattern
                      key={`pat-${p.id}`}
                      id={`pattern-${p.id}`}
                      patternUnits="userSpaceOnUse"
                      x={p.flatX - patW / 2}
                      y={p.flatY - patH / 2}
                      width={patW}
                      height={patH}
                    >
                      <image
                        href={uploadedImage.url}
                        x="0"
                        y="0"
                        width={patW}
                        height={patH}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </pattern>
                  )
                })}
            </defs>

            {/* Render 4 Almond Panels */}
            {PANELS_DATA.map((panel) => {
              const isSelected = selectedPanels.includes(panel.id)
              const isHovered = hoveredPanel === panel.id

              let fillColor = leatherColor
              if (isSelected) {
                fillColor = uploadedImage ? `url(#pattern-${panel.id})` : '#2563eb'
              }

              const panelPath = getFootballPanelPath(
                panel.flatX,
                panel.flatY,
                panel.width,
                panel.height
              )

              return (
                <g
                  key={panel.id}
                  onClick={() => togglePanel(panel.id)}
                  onMouseEnter={() => setHoveredPanel(panel.id)}
                  onMouseLeave={() => setHoveredPanel(null)}
                  className="cursor-pointer transition-transform duration-150 active:scale-95"
                  style={{
                    transformOrigin: `${panel.flatX}px ${panel.flatY}px`,
                    transform: isHovered ? 'scale(1.04)' : isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  {/* Base Panel Path */}
                  <path
                    d={panelPath}
                    fill={fillColor}
                    stroke={isSelected ? '#38bdf8' : isHovered ? '#cbd5e1' : seamsColor}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                    filter={isSelected ? 'url(#meshGlow)' : undefined}
                  />

                  {/* Top Panel Laces Indicator (Stylized stitches along center/top) */}
                  {panel.hasLaces && (
                    <g opacity={isSelected && uploadedImage ? 0.35 : 0.9} pointerEvents="none">
                      {/* Central lace backbone line */}
                      <line
                        x1={panel.flatX - 35}
                        y1={panel.flatY - 18}
                        x2={panel.flatX + 35}
                        y2={panel.flatY - 18}
                        stroke={lacesColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Cross stitches */}
                      {[-28, -14, 0, 14, 28].map((offset) => (
                        <line
                          key={offset}
                          x1={panel.flatX + offset}
                          y1={panel.flatY - 26}
                          x2={panel.flatX + offset}
                          y2={panel.flatY - 10}
                          stroke={lacesColor}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      ))}
                    </g>
                  )}

                  {/* Panel Identifier Text */}
                  <text
                    x={panel.flatX}
                    y={panel.flatY + (isSelected && uploadedImage ? -8 : panel.hasLaces ? 14 : 4)}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#f8fafc'}
                    fontSize="13"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    style={{
                      textShadow: '0 1px 4px rgba(0,0,0,0.95)',
                      pointerEvents: 'none'
                    }}
                  >
                    {panel.label}
                  </text>

                  {/* Subtitle tag */}
                  <text
                    x={panel.flatX}
                    y={panel.flatY + (isSelected && uploadedImage ? 10 : panel.hasLaces ? 28 : 20)}
                    textAnchor="middle"
                    fill={isSelected ? '#bae6fd' : '#cbd5e1'}
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="500"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.95)',
                      pointerEvents: 'none'
                    }}
                  >
                    {panel.title.replace(/Panel \d+ /, '')}
                  </text>

                  {/* Selected check badge */}
                  {isSelected && (
                    <g transform={`translate(${panel.flatX - 8}, ${panel.flatY + (uploadedImage ? 18 : 34)})`}>
                      <circle cx="8" cy="8" r="8" fill="#0284c7" />
                      <path
                        d="M4.5 8 L7 10.5 L11.5 6"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.8"
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
                <span className="font-medium text-white truncate">
                  {PANELS_DATA.find((p) => p.id === hoveredPanel)?.title}
                  {' • '}
                  <span className="text-sky-400">
                    {selectedPanels.includes(hoveredPanel)
                      ? 'Tap to deselect'
                      : isSingle
                      ? 'Tap to target'
                      : 'Tap to add'}
                  </span>
                </span>
              ) : (
                <span className="text-zinc-400 text-[11px]">
                  {isSingle
                    ? 'Tap any panel to target'
                    : 'Tap panels to toggle selection'}
                </span>
              )}
            </span>
            <span className="font-mono text-[10px] text-zinc-400 shrink-0">
              4 Ball Panels
            </span>
          </div>
        </div>
      )}

      {/* View Mode 2: Roster Grid (Touch-friendly tactile cards) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {PANELS_DATA.map((p) => {
            const isSelected = selectedPanels.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePanel(p.id)}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition cursor-pointer min-h-[95px] active:scale-95 ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900 shadow-xs'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60'
                }`}
              >
                <div
                  className="h-9 w-14 rounded-lg flex items-center justify-center text-xs font-mono font-bold mb-1.5 shadow-2xs relative overflow-hidden"
                  style={{
                    backgroundColor: isSelected ? '#0f172a' : leatherColor,
                    color: '#ffffff',
                    border: '1px solid #d4d4d8'
                  }}
                >
                  {p.label}
                  {p.hasLaces && (
                    <span className="absolute top-0.5 inset-x-2 h-0.5 bg-white/80 rounded-full" />
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-900">{p.title}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">{p.subtitle}</span>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
