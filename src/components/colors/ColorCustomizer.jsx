import { useCustomization } from '../../context/CustomizationContext'

const COLOR_SWATCHES = [
  '#ffffff', // White
  '#f1f5f9', // Slate Light
  '#0f172a', // Deep Slate
  '#000000', // Jet Black
  '#eab308', // Gold
  '#f97316', // Orange
  '#ef4444', // Red
  '#10b981', // Emerald Green
  '#06b6d4', // Cyan
  '#3b82f6', // Royal Blue
  '#8b5cf6', // Violet
  '#64748b'  // Muted Slate
]

export default function ColorCustomizer() {
  const { colorSettings, updateColor } = useCustomization()
  const currentPentagonColor = colorSettings.pentagonColor || colorSettings.circleColor || '#1e293b'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-slate-900">4. Colors for Other Meshes</h2>
        <p className="text-xs text-slate-500">
          Pick colors for meshes not displaying an image.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hexagon Panels Color */}
        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Hexagon Panels (20 meshes)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-slate-600">
                {colorSettings.hexagonColor}
              </span>
              <label
                className="h-6 w-6 rounded-md border border-slate-300 shadow-2xs cursor-pointer block overflow-hidden"
                style={{ backgroundColor: colorSettings.hexagonColor }}
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

          <div className="flex flex-wrap gap-1.5 mt-1">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={`hex-${hex}`}
                onClick={() => updateColor('hexagonColor', hex)}
                className={`h-5 w-5 rounded-md border transition cursor-pointer ${
                  colorSettings.hexagonColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-indigo-600 scale-110 border-white'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Pentagon Panels Color */}
        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Pentagon Panels (12 meshes)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-slate-600">
                {currentPentagonColor}
              </span>
              <label
                className="h-6 w-6 rounded-md border border-slate-300 shadow-2xs cursor-pointer block overflow-hidden"
                style={{ backgroundColor: currentPentagonColor }}
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

          <div className="flex flex-wrap gap-1.5 mt-1">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={`pent-${hex}`}
                onClick={() => updateColor('pentagonColor', hex)}
                className={`h-5 w-5 rounded-md border transition cursor-pointer ${
                  currentPentagonColor.toLowerCase() === hex.toLowerCase()
                    ? 'ring-2 ring-indigo-600 scale-110 border-white'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Seam Stitching Line Color */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
        <div>
          <span className="text-xs font-bold text-slate-800">Seam Stitching Lines</span>
          <p className="text-[11px] text-slate-500">Color of grooves between panels</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-600">
            {colorSettings.seamsColor}
          </span>
          <label
            className="h-6 w-6 rounded-md border border-slate-300 shadow-2xs cursor-pointer block overflow-hidden"
            style={{ backgroundColor: colorSettings.seamsColor }}
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
    </div>
  )
}
