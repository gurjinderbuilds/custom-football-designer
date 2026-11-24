export const PANELS_DATA = [
  {
    id: 'panel_1',
    index: 0,
    label: 'P01',
    title: 'Panel 01 (Top / Laces)',
    subtitle: 'Top quadrant adjacent to primary laces',
    role: 'top',
    flatX: 135,
    flatY: 130,
    width: 200,
    height: 120,
    hasLaces: true
  },
  {
    id: 'panel_2',
    index: 1,
    label: 'P02',
    title: 'Panel 02 (Right Side)',
    subtitle: 'Right lateral football panel',
    role: 'right',
    flatX: 355,
    flatY: 130,
    width: 200,
    height: 120,
    hasLaces: false
  },
  {
    id: 'panel_3',
    index: 2,
    label: 'P03',
    title: 'Panel 03 (Bottom / Base)',
    subtitle: 'Underbelly panel directly opposite laces',
    role: 'bottom',
    flatX: 575,
    flatY: 130,
    width: 200,
    height: 120,
    hasLaces: false
  },
  {
    id: 'panel_4',
    index: 3,
    label: 'P04',
    title: 'Panel 04 (Left Side)',
    subtitle: 'Left lateral football panel',
    role: 'left',
    flatX: 795,
    flatY: 130,
    width: 200,
    height: 120,
    hasLaces: false
  }
];

// Helper to compute SVG path for an American football panel (pointed oval / almond leaf)
export function getFootballPanelPath(cx, cy, width, height) {
  const x0 = cx - width / 2;
  const x1 = cx + width / 2;
  const y0 = cy;
  const y1 = cy;
  const cpXOffset = width * 0.28;
  const cpYTop = cy - height * 0.65;
  const cpYBottom = cy + height * 0.65;

  return `M ${x0.toFixed(1)},${y0.toFixed(1)} ` +
    `C ${(cx - cpXOffset).toFixed(1)},${cpYTop.toFixed(1)} ${(cx + cpXOffset).toFixed(1)},${cpYTop.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ` +
    `C ${(cx + cpXOffset).toFixed(1)},${cpYBottom.toFixed(1)} ${(cx - cpXOffset).toFixed(1)},${cpYBottom.toFixed(1)} ${x0.toFixed(1)},${y0.toFixed(1)} Z`;
}
