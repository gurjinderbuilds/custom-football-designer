import { Check } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

const LEATHER_SWATCHES = [
  { hex: '#854d0e', name: 'Classic Horween Brown' },
  { hex: '#78350f', name: 'Deep Pecan' },
  { hex: '#b45309', name: 'Tawny Amber' },
  { hex: '#18181b', name: 'Midnight Charcoal' },
  { hex: '#09090b', name: 'Jet Black' },
  { hex: '#ffffff', name: 'Pristine White' },
  { hex: '#991b1b', name: 'Crimson Red' },
  { hex: '#1e3a8a', name: 'Collegiate Navy' },
  { hex: '#d97706', name: 'Athletic Gold' },
  { hex: '#047857', name: 'Gridiron Green' }
]

const LACES_SWATCHES = [
  { hex: '#ffffff', name: 'Optic White' },
  { hex: '#fed7aa', name: 'Rawhide Cream' },
  { hex: '#fde047', name: 'Varsity Gold' },
  { hex: '#3f3f46', name: 'Stealth Charcoal' },
  { hex: '#09090b', name: 'Jet Black' },
  { hex: '#ef4444', name: 'Fire Red' }
]

const COLORWAY_PRESETS = [
  {
    name: 'Horween Classic',
    leather: '#854d0e',
    laces: '#ffffff',
    seam: '#3b1d07'
  },
  {
    name: 'Midnight Stealth',
    leather: '#18181b',
    laces: '#3f3f46',
    seam: '#09090b'
  },
  {
    name: 'Snow White',
    leather: '#ffffff',
    laces: '#1e3a8a',
    seam: '#94a3b8'
  },
  {
    name: 'Golden Trophy',
    leather: '#d97706',
    laces: '#ffffff',
    seam: '#78350f'
  },
  {
    name: 'Collegiate Crimson',
    leather: '#991b1b',
    laces: '#ffffff',
    seam: '#450a0a'
  }
]

export default function ColorCustomizer() {
  const { colorSettings, updateColor } = useCustomization()
  const leatherColor = colorSettings.leatherColor || '#854d0e'
  const lacesColor = colorSettings.lacesColor || '#ffffff'
  const seamsColor = colorSettings.seamsColor || '#3b1d07'

  const applyPreset = (preset) => {
    updateColor('leatherColor', preset.leather)
    updateColor('lacesColor', preset.laces)
    updateColor('seamsColor', preset.seam)
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-mono font-bold text-white shadow-2xs shrink-0 mt-0.5">
            04
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-tight">
                Leather Grain & Stitching Pigments
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">
              Customize genuine leather base tones, cord laces, and recessed seams across all 4 panels.
            </p>
          </div>
        </div>

        {/* Quick Colorway Presets */}
        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
          <span className="text-[10px] font-mono text-zinc-400 mr-0.5 hidden md:inline">Presets:</span>
          {COLORWAY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[10px] font-semibold text-zinc-700 cursor-pointer active:scale-95 transition-all shadow-2xs"
              title={`Apply ${preset.name} theme`}
            >
              <span className="flex -space-x-1">
                <span className="h-2.5 w-2.5 rounded-full border border-white" style={{ backgroundColor: preset.leather }} />
                <span className="h-2.5 w-2.5 rounded-full border border-white" style={{ backgroundColor: preset.laces }} />
              </span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Leather Panels Color */}
        <div className="flex flex-col gap-2.5 rounded-xl bg-zinc-50/80 p-3 sm:p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-800">
                Ball Leather Pigment
              </span>
              <span className="text-[11px] text-zinc-400 font-mono ml-1.5">
                (4 panels)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                {leatherColor}
              </span>
              <label
                className="relative h-8 w-8 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-1 hover:ring-2 hover:ring-zinc-900 active:scale-95 transition-transform"
                style={{ backgroundColor: leatherColor }}
                title="Open system color picker"
              >
                <input
                  type="color"
                  value={leatherColor}
                  onChange={(e) => updateColor('leatherColor', e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
            {LEATHER_SWATCHES.map((swatch) => {
              const isSelected = leatherColor.toLowerCase() === swatch.hex.toLowerCase()
              const isDark = swatch.hex === '#09090b' || swatch.hex === '#18181b' || swatch.hex === '#78350f' || swatch.hex === '#991b1b' || swatch.hex === '#1e3a8a'
              return (
                <button
                  key={`leather-${swatch.hex}`}
                  type="button"
                  onClick={() => updateColor('leatherColor', swatch.hex)}
                  className={`relative h-8 w-8 sm:h-7.5 sm:w-7.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                    isSelected
                      ? 'ring-2 ring-zinc-900 ring-offset-2 scale-105 border-white shadow-xs'
                      : 'border-zinc-300/90 hover:scale-105 hover:border-zinc-400'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={`${swatch.name} (${swatch.hex})`}
                  aria-label={`Color ${swatch.name}`}
                >
                  {isSelected && (
                    <Check className={`h-3 w-3 stroke-[3] ${isDark ? 'text-white' : 'text-zinc-900'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* White Laces & Stitches Color */}
        <div className="flex flex-col gap-2.5 rounded-xl bg-zinc-50/80 p-3 sm:p-4 border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-800">
                Football Laces
              </span>
              <span className="text-[11px] text-zinc-400 font-mono ml-1.5">
                (Top seam)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                {lacesColor}
              </span>
              <label
                className="relative h-8 w-8 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-1 hover:ring-2 hover:ring-zinc-900 active:scale-95 transition-transform"
                style={{ backgroundColor: lacesColor }}
                title="Open lace color picker"
              >
                <input
                  type="color"
                  value={lacesColor}
                  onChange={(e) => updateColor('lacesColor', e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
            {LACES_SWATCHES.map((swatch) => {
              const isSelected = lacesColor.toLowerCase() === swatch.hex.toLowerCase()
              const isDark = swatch.hex === '#09090b' || swatch.hex === '#3f3f46'
              return (
                <button
                  key={`laces-${swatch.hex}`}
                  type="button"
                  onClick={() => updateColor('lacesColor', swatch.hex)}
                  className={`relative h-8 w-8 sm:h-7.5 sm:w-7.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                    isSelected
                      ? 'ring-2 ring-zinc-900 ring-offset-2 scale-105 border-white shadow-xs'
                      : 'border-zinc-300/90 hover:scale-105 hover:border-zinc-400'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={`${swatch.name} (${swatch.hex})`}
                  aria-label={`Color ${swatch.name}`}
                >
                  {isSelected && (
                    <Check className={`h-3 w-3 stroke-[3] ${isDark ? 'text-white' : 'text-zinc-900'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recessed Seam Grooves Color */}
      <div className="flex items-center justify-between rounded-xl bg-zinc-50/80 p-3 sm:p-3.5 border border-zinc-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-zinc-800">Seam Stitching Lines</span>
          <p className="text-[11px] text-zinc-500">Color of recessed physical cord seams dividing the 4 ball panels</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-zinc-700 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
            {seamsColor}
          </span>
          <label
            className="relative h-8 w-8 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-1 hover:ring-2 hover:ring-zinc-900 active:scale-95 transition-transform"
            style={{ backgroundColor: seamsColor }}
            title="Open seam color picker"
          >
            <input
              type="color"
              value={seamsColor}
              onChange={(e) => updateColor('seamsColor', e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
            />
          </label>
        </div>
      </div>
    </section>
  )
}
