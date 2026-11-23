import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

// Helper to normalize panel UVs to [0, 1] preserving aspect ratio
function normalizePanelUVs(geometry) {
  if (!geometry.attributes.uv) return
  const uv = geometry.attributes.uv
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i)
    const v = uv.getY(i)
    if (u < minU) minU = u
    if (u > maxU) maxU = u
    if (v < minV) minV = v
    if (v > maxV) maxV = v
  }
  const rangeU = maxU - minU
  const rangeV = maxV - minV
  const maxRange = Math.max(rangeU, rangeV) || 1
  const offsetU = (maxRange - rangeU) / 2
  const offsetV = (maxRange - rangeV) / 2

  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i)
    const v = uv.getY(i)
    const nu = (u - minU + offsetU) / maxRange
    const nv = (v - minV + offsetV) / maxRange
    uv.setXY(i, nu, nv)
  }
  uv.needsUpdate = true
}

const FootballCanvas = forwardRef(function FootballCanvas(
  {
    isAutoRotating = true,
    isWireframe = false,
    modelUrl = '/models/circle-soccer-concave.glb'
  },
  ref
) {
  const {
    selectedPanels,
    uploadedImage,
    imageFit,
    colorSettings
  } = useCustomization()

  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const panelsMapRef = useRef(new Map())
  const seamsMeshRef = useRef(null)
  const activeTextureRef = useRef(null)

  // Default fully zoomed out position: z = 7.5
  const initialCamPosRef = useRef(new THREE.Vector3(0, 0.3, 7.5))
  const isAutoRotatingRef = useRef(isAutoRotating)
  isAutoRotatingRef.current = isAutoRotating

  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [error, setError] = useState(null)

  // Expose imperative methods to parent via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (!cameraRef.current || !controlsRef.current) return
      const target = controlsRef.current.target
      cameraRef.current.position.lerp(target, 0.15)
      controlsRef.current.update()
    },
    zoomOut: () => {
      if (!cameraRef.current || !controlsRef.current) return
      const target = controlsRef.current.target
      const dir = new THREE.Vector3().subVectors(cameraRef.current.position, target).normalize()
      cameraRef.current.position.addScaledVector(dir, 0.4)
      controlsRef.current.update()
    },
    rotateLeft: () => {
      if (!controlsRef.current) return
      controlsRef.current.autoRotate = false
      const offset = 0.25
      const cam = cameraRef.current
      const target = controlsRef.current.target
      const x = cam.position.x - target.x
      const z = cam.position.z - target.z
      cam.position.x = target.x + x * Math.cos(offset) - z * Math.sin(offset)
      cam.position.z = target.z + x * Math.sin(offset) + z * Math.cos(offset)
      controlsRef.current.update()
    },
    rotateRight: () => {
      if (!controlsRef.current) return
      controlsRef.current.autoRotate = false
      const offset = -0.25
      const cam = cameraRef.current
      const target = controlsRef.current.target
      const x = cam.position.x - target.x
      const z = cam.position.z - target.z
      cam.position.x = target.x + x * Math.cos(offset) - z * Math.sin(offset)
      cam.position.z = target.z + x * Math.sin(offset) + z * Math.cos(offset)
      controlsRef.current.update()
    },
    rotateUp: () => {
      if (!controlsRef.current) return
      controlsRef.current.autoRotate = false
      cameraRef.current.position.y += 0.35
      controlsRef.current.update()
    },
    rotateDown: () => {
      if (!controlsRef.current) return
      controlsRef.current.autoRotate = false
      cameraRef.current.position.y = Math.max(-1.5, cameraRef.current.position.y - 0.35)
      controlsRef.current.update()
    },
    resetCamera: () => {
      if (!cameraRef.current || !controlsRef.current) return
      cameraRef.current.position.copy(initialCamPosRef.current)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    },
    captureScreenshot: () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      return rendererRef.current.domElement.toDataURL('image/png')
    }
  }))

  // Apply colors & textures to all 32 panel meshes
  const applyPanelMaterials = useCallback(() => {
    const panelsMap = panelsMapRef.current
    if (panelsMap.size === 0) return

    const tex = activeTextureRef.current

    panelsMap.forEach((mesh, panelId) => {
      const mat = mesh.material
      if (!mat) return

      const isSelected = selectedPanels.includes(panelId)
      const isHex = panelId.includes('hexagon')

      if (isSelected) {
        if (tex) {
          mat.color.set('#ffffff')
          mat.map = tex
        } else {
          mat.color.set('#6366f1')
          mat.map = null
        }
        mat.roughness = 0.28
        mat.metalness = 0.05
      } else {
        mat.map = null
        mat.color.set(isHex ? colorSettings.hexagonColor : (colorSettings.pentagonColor || colorSettings.circleColor))
        mat.roughness = 0.35
        mat.metalness = 0.05
      }
      mat.needsUpdate = true
    })

    // Update seams color
    if (seamsMeshRef.current && seamsMeshRef.current.material) {
      seamsMeshRef.current.material.color.set(colorSettings.seamsColor)
      seamsMeshRef.current.material.needsUpdate = true
    }
  }, [selectedPanels, colorSettings])

  // Update OrbitControls autoRotate prop
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating
    }
  }, [isAutoRotating])

  // Update wireframe mode
  useEffect(() => {
    panelsMapRef.current.forEach((mesh) => {
      if (mesh.material) {
        mesh.material.wireframe = isWireframe
      }
    })
  }, [isWireframe])

  // Load / Update active Texture from uploadedImage
  useEffect(() => {
    if (!uploadedImage || !uploadedImage.url) {
      if (activeTextureRef.current) {
        activeTextureRef.current.dispose()
        activeTextureRef.current = null
      }
      applyPanelMaterials()
      return
    }

    const loader = new THREE.TextureLoader()
    loader.load(
      uploadedImage.url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.generateMipmaps = true

        if (activeTextureRef.current) {
          activeTextureRef.current.dispose()
        }
        activeTextureRef.current = tex
        applyPanelMaterials()
      },
      undefined,
      (err) => console.error('Error loading texture:', err)
    )
  }, [uploadedImage, imageFit, applyPanelMaterials])

  // Trigger material update whenever dependencies change
  useEffect(() => {
    applyPanelMaterials()
  }, [applyPanelMaterials])

  // Scene Setup
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera - Initialized to fully zoomed out distance (z = 7.5)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0.3, 7.5)
    cameraRef.current = camera
    initialCamPosRef.current.copy(camera.position)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = isAutoRotatingRef.current
    controls.autoRotateSpeed = 1.4
    controls.minDistance = 3.2
    controls.maxDistance = 7.8
    controls.enablePan = false
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
    keyLight.position.set(4, 5, 4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.bias = -0.0001
    const d = 3.0
    keyLight.shadow.camera.left = -d
    keyLight.shadow.camera.right = d
    keyLight.shadow.camera.top = d
    keyLight.shadow.camera.bottom = -d
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xe0f2fe, 1.2)
    rimLight.position.set(-4, 3, -4)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xfff7ed, 0.5)
    fillLight.position.set(-3, 1, 3)
    scene.add(fillLight)

    // Soft ground contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6)
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 })
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat)
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -2.13
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    // Load Model
    const loader = new GLTFLoader()
    setLoading(true)
    setError(null)

    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene

        // Center model geometry
        const bbox = new THREE.Box3().setFromObject(root)
        const center = new THREE.Vector3()
        bbox.getCenter(center)
        root.position.sub(center)

        const radius = bbox.getSize(new THREE.Vector3()).length() / 2
        shadowPlane.position.y = -radius - 0.03

        // Populate panelsMap
        const map = new Map()
        root.traverse((child) => {
          if (child.isMesh && child.name.startsWith('panel_')) {
            child.castShadow = true
            child.receiveShadow = true
            // Normalize UV coordinates for clean, non-distorted texture mapping
            normalizePanelUVs(child.geometry)
            // Ensure unique cloned material per panel
            child.material = child.material.clone()
            map.set(child.name, child)
          } else if (child.name === '__seams') {
            seamsMeshRef.current = child
            if (child.material) {
              child.material = child.material.clone()
            }
          }
        })

        panelsMapRef.current = map
        scene.add(root)
        setLoading(false)

        // Initial application of colors and textures
        applyPanelMaterials()
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100))
        }
      },
      (err) => {
        console.error('Error loading circle soccer model:', err)
        setError('Failed to load circle-soccer-concave.glb model.')
        setLoading(false)
      }
    )

    // Animation Loop
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // Cleanup
    return () => {
      ro.disconnect()
      cancelAnimationFrame(animId)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [modelUrl, applyPanelMaterials])

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200">
      {/* 3D Canvas */}
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm">
          <Loader2 className="h-9 w-9 animate-spin text-indigo-600 mb-2" />
          <p className="text-sm font-bold text-slate-800">Loading 3D Football...</p>
          <p className="text-xs text-slate-500">Preparing panels & materials ({loadProgress}%)</p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-rose-50/90 p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-rose-500 mb-2" />
          <h3 className="text-sm font-bold text-rose-900">Failed to Load Model</h3>
          <p className="mt-1 max-w-sm text-xs text-rose-700">{error}</p>
        </div>
      )}

      {/* Camera interaction hint */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2 rounded-xl bg-white/85 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-xs backdrop-blur-md border border-slate-200/80">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>360° Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  )
})

export default FootballCanvas
