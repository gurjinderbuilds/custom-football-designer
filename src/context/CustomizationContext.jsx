import { createContext, useContext, useState, useCallback } from 'react'
import { PANELS_DATA } from '../data/panelsData'

const CustomizationContext = createContext(null)

const DEFAULT_COLORS = {
  leatherColor: '#854d0e',
  lacesColor: '#ffffff',
  seamsColor: '#3b1d07'
}

export function CustomizationProvider({ children }) {
  // Step 1: Selection Mode ('single' or 'multiple')
  const [selectionMode, setSelectionModeState] = useState('single')

  // Step 2: Selected Panels (strictly no default selection)
  const [selectedPanels, setSelectedPanels] = useState([])

  // Step 3: Uploaded Image
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageFit, setImageFit] = useState('cover')

  // Step 4: Color Settings for leather, laces, and seams
  const [colorSettings, setColorSettings] = useState(DEFAULT_COLORS)

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

  // Bulk selectors
  const selectAllPanels = useCallback(() => {
    setSelectedPanels(PANELS_DATA.map((p) => p.id))
  }, [])

  const selectLacePanels = useCallback(() => {
    setSelectedPanels(['panel_1', 'panel_4'])
  }, [])

  const selectSidePanels = useCallback(() => {
    setSelectedPanels(['panel_2', 'panel_4'])
  }, [])

  const selectTopBottomPanels = useCallback(() => {
    setSelectedPanels(['panel_1', 'panel_3'])
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedPanels([])
  }, [])

  // Update color
  const updateColor = useCallback((key, value) => {
    setColorSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Reset all
  const resetCustomization = useCallback(() => {
    setSelectionModeState('single')
    setSelectedPanels([])
    setUploadedImage(null)
    setImageFit('cover')
    setColorSettings(DEFAULT_COLORS)
    setIs3DModalOpen(false)
  }, [])

  const value = {
    PANELS_DATA,
    selectionMode,
    setSelectionMode,
    selectedPanels,
    setSelectedPanels,
    togglePanel,
    selectAllPanels,
    selectLacePanels,
    selectSidePanels,
    selectTopBottomPanels,
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
