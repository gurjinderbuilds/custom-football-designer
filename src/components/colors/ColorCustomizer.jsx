import { useCustomization } from '../../context/CustomizationContext'

const COLOR_SWATCHES = [
  '#ffffff', // Pristine White
  '#f4f4f5', // Zinc Silver
  '#27272a', // Charcoal
  '#09090b', // Jet Black
  '#eab308', // Athletic Gold
  '#f97316', // Blaze Orange
  '#ef4444', // Crimson Red
  '#10b981', // Emerald Green
  '#0284c7', // Sky Cyan
  '#2563eb', // Royal Blue
  '#7c3aed', // Stadium Violet
  '#71717a'  // Cool Slate
]

export default function ColorCustomizer() {
  const { colorSettings, updateColor } = useCustomization()
  const currentPentagonColor = colorSettings.pentagonColor || colorSettings.circleColor || '#1e293b'

  return (
    <section className="flex flex-col gap-3.5 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-5 shadow-2xs">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">4. Material Colors</h2>
        <p className="text-xs text-zinc-500">
          Specify surface pigment for unprinted mesh panels and seam stitching lines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Hexagon Panels Color */}
        <div className="flex flex-col gap-2 rounded-lg bg-zinc-50/80 p-3 sm:p-3.5 border border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-800">
                Hexagon Panels
              </span>
              <span className="text-[11px] text-zinc-400 block sm:inline sm:ml-1.5 font-mono">
                (20 meshes)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-600">
                {colorSettings.hexagonColor}
              </span>
              <label
                className="h-8 w-8 sm:h-7 sm:w-7 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-background hover:ring-2 hover:ring-zinc-400 active:scale-95 transition-transform"
                style={{ backgroundColor: colorSettings.hexagonColor }}
                title="Open native color picker"
              >
                <input
                  type="color"
                  value={colorSettings.hexagonColor}
                  onChange={(e) => updateColor('hexagonColor', e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={`hex-${hex}`}
                type="button"
                onClick={() => updateColor('hexagonColor', hex)}
                className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border transition-all cursor-pointer active:scale-90 ${
                  colorSettings.hexagonColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-zinc-900 ring-offset-1 scale-105 border-white shadow-2xs'
                    : 'border-zinc-300 hover:scale-105 hover:border-zinc-400'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
                aria-label={`Color ${hex}`}
              />
            ))}
          </div>
        </div>

        {/* Pentagon Panels Color */}
        <div className="flex flex-col gap-2 rounded-lg bg-zinc-50/80 p-3 sm:p-3.5 border border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-800">
                Pentagon Panels
              </span>
              <span className="text-[11px] text-zinc-400 block sm:inline sm:ml-1.5 font-mono">
                (12 meshes)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-600">
                {currentPentagonColor}
              </span>
              <label
                className="h-8 w-8 sm:h-7 sm:w-7 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-background hover:ring-2 hover:ring-zinc-400 active:scale-95 transition-transform"
                style={{ backgroundColor: currentPentagonColor }}
                title="Open native color picker"
              >
                <input
                  type="color"
                  value={currentPentagonColor}
                  onChange={(e) => updateColor('pentagonColor', e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={`pent-${hex}`}
                type="button"
                onClick={() => updateColor('pentagonColor', hex)}
                className={`h-8 w-8 sm:h-7 sm:w-7 rounded-lg border transition-all cursor-pointer active:scale-90 ${
                  currentPentagonColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-zinc-900 ring-offset-1 scale-105 border-white shadow-2xs'
                    : 'border-zinc-300 hover:scale-105 hover:border-zinc-400'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
                aria-label={`Color ${hex}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Seam Stitching Line Color */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-50/80 p-3 sm:p-3.5 border border-zinc-200">
        <div>
          <span className="text-xs font-semibold text-zinc-800">Seam Stitching Lines</span>
          <p className="text-[11px] text-zinc-500">Color of physical seams between ball panels</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-zinc-600">
            {colorSettings.seamsColor}
          </span>
          <label
            className="h-8 w-8 sm:h-7 sm:w-7 rounded-lg border border-zinc-300 shadow-2xs cursor-pointer block overflow-hidden ring-offset-background hover:ring-2 hover:ring-zinc-400 active:scale-95 transition-transform"
            style={{ backgroundColor: colorSettings.seamsColor }}
            title="Open seam color picker"
          >
            <input
              type="color"
              value={colorSettings.seamsColor}
              onChange={(e) => updateColor('seamsColor', e.target.value)}
              className="opacity-0 w-full h-full cursor-pointer"
            />
          </label>
        </div>
      </div>
    </section>
  )
}
