import { createContext, useContext, useState, useCallback } from 'react'
import { PANELS_DATA } from '../data/panelsData'

const CustomizationContext = createContext(null)

export function CustomizationProvider({ children }) {
  // Step 1: Selection Mode ('single' or 'multiple')
  const [selectionMode, setSelectionModeState] = useState('single')

  // Step 2: Selected Panels (strictly no default selection)
  const [selectedPanels, setSelectedPanels] = useState([])

  // Step 3: Uploaded Image (strictly no default selection)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageFit, setImageFit] = useState('cover')

  // Step 4: Color Settings for other meshes & seams
  const [colorSettings, setColorSettings] = useState({
    hexagonColor: '#ffffff',
    pentagonColor: '#1e293b',
    circleColor: '#1e293b', // alias
    seamsColor: '#0f172a'
  })

  // Step 5: 3D Rendered Result Modal
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)

  // Mode changer: if switching to 'single', enforce strictly at most 1 panel
  const setSelectionMode = useCallback((mode) => {
    setSelectionModeState(mode)
    if (mode === 'single') {
      setSelectedPanels((prev) => (prev.length > 0 ? [prev[0]] : []))
    }
  }, [])

  // Panel toggle
  const togglePanel = useCallback((panelId) => {
    setSelectedPanels((prev) => {
      if (selectionMode === 'single') {
        // In single mode: clicking selected panel deselects it; clicking another replaces it
        return prev.includes(panelId) ? [] : [panelId]
      } else {
        // In multiple mode: toggle inclusion
        if (prev.includes(panelId)) {
          return prev.filter((id) => id !== panelId)
        } else {
          return [...prev, panelId]
        }
      }
    })
  }, [selectionMode])

  // Bulk selectors (only for multiple mode)
  const selectAllHexagons = useCallback(() => {
    const hexIds = PANELS_DATA.filter((p) => p.type === 'hexagon').map((p) => p.id)
    setSelectedPanels(hexIds)
  }, [])

  const selectAllPentagons = useCallback(() => {
    const pentIds = PANELS_DATA.filter((p) => p.type === 'pentagon').map((p) => p.id)
    setSelectedPanels(pentIds)
  }, [])

  const selectAllPanels = useCallback(() => {
    setSelectedPanels(PANELS_DATA.map((p) => p.id))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedPanels([])
  }, [])

  // Update color
  const updateColor = useCallback((key, value) => {
    setColorSettings((prev) => {
      const updated = { ...prev, [key]: value }
      if (key === 'pentagonColor') updated.circleColor = value
      if (key === 'circleColor') updated.pentagonColor = value
      return updated
    })
  }, [])

  // Reset all
  const resetCustomization = useCallback(() => {
    setSelectionModeState('single')
    setSelectedPanels([])
    setUploadedImage(null)
    setImageFit('cover')
    setColorSettings({
      hexagonColor: '#ffffff',
      pentagonColor: '#1e293b',
      circleColor: '#1e293b',
      seamsColor: '#0f172a'
    })
    setIs3DModalOpen(false)
  }, [])

  const value = {
    PANELS_DATA,
    selectionMode,
    setSelectionMode,
    selectedPanels,
    setSelectedPanels,
    togglePanel,
    selectAllHexagons,
    selectAllPentagons,
    selectAllCircles: selectAllPentagons,
    selectAllPanels,
    clearSelection,
    uploadedImage,
    setUploadedImage,
    imageFit,
    setImageFit,
    colorSettings,
    updateColor,
    is3DModalOpen,
    setIs3DModalOpen,
    resetCustomization
  }

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider')
  }
  return context
}
