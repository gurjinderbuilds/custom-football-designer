import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useCustomization } from '../../context/CustomizationContext'

const FootballCanvas = forwardRef(function FootballCanvas(
  {
    isAutoRotating = true,
    isWireframe = false,
    modelUrl = '/models/American-football.obj',
    mtlUrl = '/models/American-football.mtl'
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
  const lacesMeshRef = useRef(null)
  const activeTextureRef = useRef(null)
  const colorSettingsRef = useRef(colorSettings)
  colorSettingsRef.current = colorSettings

  // Camera distance adjusted for American football aspect ratio
  const initialCamPosRef = useRef(new THREE.Vector3(0, 0.35, 5.2))
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

  // Apply colors & textures to all 4 panel meshes and laces
  const applyPanelMaterials = useCallback(() => {
    const panelsMap = panelsMapRef.current
    if (panelsMap.size === 0) return

    const tex = activeTextureRef.current
    const leatherColor = colorSettings.leatherColor || '#854d0e'
    const lacesColor = colorSettings.lacesColor || '#ffffff'

    panelsMap.forEach((mesh, panelId) => {
      const mat = mesh.material
      if (!mat) return

      const isSelected = selectedPanels.includes(panelId)

      if (isSelected) {
        if (tex) {
          mat.color.set('#ffffff')
          mat.map = tex
        } else {
          mat.color.set('#3b82f6')
          mat.map = null
        }
        mat.roughness = 0.28
        mat.metalness = 0.05
      } else {
        mat.map = null
        mat.color.set(leatherColor)
        mat.roughness = 0.38
        mat.metalness = 0.05
      }
      mat.needsUpdate = true
    })

    // Update laces material
    if (lacesMeshRef.current && lacesMeshRef.current.material) {
      lacesMeshRef.current.material.color.set(lacesColor)
      lacesMeshRef.current.material.roughness = 0.25
      lacesMeshRef.current.material.needsUpdate = true
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
    if (lacesMeshRef.current && lacesMeshRef.current.material) {
      lacesMeshRef.current.material.wireframe = isWireframe
    }
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

  // Scene Setup & Model Loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera - Initialized to comfortably frame the horizontal American football
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 0.35, 5.2)
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
    renderer.toneMappingExposure = 1.15

    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = isAutoRotatingRef.current
    controls.autoRotateSpeed = 1.4
    controls.minDistance = 2.2
    controls.maxDistance = 8.5
    controls.enablePan = false
    controlsRef.current = controls

    // Lighting setup optimized for American football leather & laces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0)
    keyLight.position.set(4, 5, 4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.bias = -0.0001
    const d = 2.5
    keyLight.shadow.camera.left = -d
    keyLight.shadow.camera.right = d
    keyLight.shadow.camera.top = d
    keyLight.shadow.camera.bottom = -d
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xe0f2fe, 1.4)
    rimLight.position.set(-4, 3, -4)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xffedd5, 0.6)
    fillLight.position.set(-3, 1, 3)
    scene.add(fillLight)

    // Soft ground contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6)
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 })
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat)
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -1.15
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    setLoading(true)
    setError(null)

    // Helper to process loaded OBJ mesh into 4 customizable panels + laces
    const processFootballObject = (obj) => {
      let sourceMesh = null
      obj.traverse((child) => {
        if (child.isMesh && !sourceMesh) {
          sourceMesh = child
        }
      })

      if (!sourceMesh || !sourceMesh.geometry) {
        setError('No mesh found in American football model.')
        setLoading(false)
        return
      }

      const geom = sourceMesh.geometry
      const pos = geom.attributes.position
      const norm = geom.attributes.normal

      // Calculate bounding box and scale factor so ball length is ~3.5 units
      geom.computeBoundingBox()
      const bbox = geom.boundingBox
      const center = bbox.getCenter(new THREE.Vector3())
      const size = bbox.getSize(new THREE.Vector3())

      const targetLength = 3.5
      const scaleFactor = targetLength / (size.x || 1)

      shadowPlane.position.y = -(size.y * scaleFactor) / 2 - 0.05

      // Partition triangles into 4 panels + laces
      const parts = {
        laces: { positions: [], normals: [], uvs: [] },
        panel_1: { positions: [], normals: [], uvs: [] },
        panel_2: { positions: [], normals: [], uvs: [] },
        panel_3: { positions: [], normals: [], uvs: [] },
        panel_4: { positions: [], normals: [], uvs: [] }
      }

      const xMin = (-size.x / 2) * scaleFactor
      const xMax = (size.x / 2) * scaleFactor
      const xRange = xMax - xMin || 1

      for (let i = 0; i < pos.count; i += 3) {
        const p0 = new THREE.Vector3(
          (pos.getX(i) - center.x) * scaleFactor,
          (pos.getY(i) - center.y) * scaleFactor,
          (pos.getZ(i) - center.z) * scaleFactor
        )
        const p1 = new THREE.Vector3(
          (pos.getX(i + 1) - center.x) * scaleFactor,
          (pos.getY(i + 1) - center.y) * scaleFactor,
          (pos.getZ(i + 1) - center.z) * scaleFactor
        )
        const p2 = new THREE.Vector3(
          (pos.getX(i + 2) - center.x) * scaleFactor,
          (pos.getY(i + 2) - center.y) * scaleFactor,
          (pos.getZ(i + 2) - center.z) * scaleFactor
        )

        const n0 = norm ? new THREE.Vector3(norm.getX(i), norm.getY(i), norm.getZ(i)) : new THREE.Vector3(0, 1, 0)
        const n1 = norm ? new THREE.Vector3(norm.getX(i + 1), norm.getY(i + 1), norm.getZ(i + 1)) : new THREE.Vector3(0, 1, 0)
        const n2 = norm ? new THREE.Vector3(norm.getX(i + 2), norm.getY(i + 2), norm.getZ(i + 2)) : new THREE.Vector3(0, 1, 0)

        const triCenter = new THREE.Vector3().add(p0).add(p1).add(p2).divideScalar(3)
        let deg = (Math.atan2(triCenter.z, triCenter.y) * 180 / Math.PI + 360) % 360
        let signedDeg = deg > 180 ? deg - 360 : deg

        let partKey
        // Laces detection along top seam at 0° (+Y)
        if (Math.abs(signedDeg) < 7.0 && Math.abs(triCenter.x) < 0.075 * scaleFactor) {
          partKey = 'laces'
        } else if (deg >= 0 && deg < 90) {
          partKey = 'panel_1'
        } else if (deg >= 90 && deg < 180) {
          partKey = 'panel_2'
        } else if (deg >= 180 && deg < 270) {
          partKey = 'panel_3'
        } else {
          partKey = 'panel_4'
        }

        const verts = [p0, p1, p2]
        const norms = [n0, n1, n2]

        for (let k = 0; k < 3; k++) {
          const p = verts[k]
          const n = norms[k]
          let vDeg = (Math.atan2(p.z, p.y) * 180 / Math.PI + 360) % 360

          let u = (p.x - xMin) / xRange
          let v

          if (partKey === 'panel_1') {
            v = (vDeg - 0) / 90
          } else if (partKey === 'panel_2') {
            v = (vDeg - 90) / 90
          } else if (partKey === 'panel_3') {
            v = (vDeg - 180) / 90
          } else if (partKey === 'panel_4') {
            v = (vDeg - 270) / 90
          } else {
            v = (vDeg + 15) / 30
          }

          u = Math.max(0, Math.min(1, u))
          v = Math.max(0, Math.min(1, v))

          parts[partKey].positions.push(p.x, p.y, p.z)
          parts[partKey].normals.push(n.x, n.y, n.z)
          parts[partKey].uvs.push(u, v)
        }
      }

      const footballGroup = new THREE.Group()
      footballGroup.name = 'AmericanFootball'
      const panelsMap = new Map()

      // Create individual meshes for the 4 panels
      const panelIds = ['panel_1', 'panel_2', 'panel_3', 'panel_4']
      for (const pId of panelIds) {
        const data = parts[pId]
        if (data.positions.length === 0) continue

        const pGeom = new THREE.BufferGeometry()
        pGeom.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3))
        pGeom.setAttribute('normal', new THREE.Float32BufferAttribute(data.normals, 3))
        pGeom.setAttribute('uv', new THREE.Float32BufferAttribute(data.uvs, 2))
        pGeom.computeVertexNormals()

        const mat = new THREE.MeshStandardMaterial({
          color: colorSettingsRef.current?.leatherColor || '#854d0e',
          roughness: 0.38,
          metalness: 0.05
        })

        const mesh = new THREE.Mesh(pGeom, mat)
        mesh.name = pId
        mesh.castShadow = true
        mesh.receiveShadow = true

        panelsMap.set(pId, mesh)
        footballGroup.add(mesh)
      }

      // Create separate laces mesh
      if (parts.laces.positions.length > 0) {
        const lGeom = new THREE.BufferGeometry()
        lGeom.setAttribute('position', new THREE.Float32BufferAttribute(parts.laces.positions, 3))
        lGeom.setAttribute('normal', new THREE.Float32BufferAttribute(parts.laces.normals, 3))
        lGeom.setAttribute('uv', new THREE.Float32BufferAttribute(parts.laces.uvs, 2))
        lGeom.computeVertexNormals()

        const lMat = new THREE.MeshStandardMaterial({
          color: colorSettingsRef.current?.lacesColor || '#ffffff',
          roughness: 0.25,
          metalness: 0.02
        })

        const lacesMesh = new THREE.Mesh(lGeom, lMat)
        lacesMesh.name = '__laces'
        lacesMesh.castShadow = true
        lacesMesh.receiveShadow = true

        lacesMeshRef.current = lacesMesh
        footballGroup.add(lacesMesh)
      }

      panelsMapRef.current = panelsMap
      scene.add(footballGroup)
      setLoading(false)

      applyPanelMaterials()
    }

    // Load with MTLLoader + OBJLoader
    const mtlLoader = new MTLLoader()
    mtlLoader.load(
      mtlUrl,
      (materials) => {
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.load(
          modelUrl,
          (obj) => {
            processFootballObject(obj)
          },
          (xhr) => {
            if (xhr.total > 0) {
              setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100))
            }
          },
          (err) => {
            console.error('Error loading American football OBJ:', err)
            setError('Failed to load American football 3D model.')
            setLoading(false)
          }
        )
      },
      undefined,
      (err) => {
        console.warn('MTL load fallback to direct OBJ load:', err)
        const objLoader = new OBJLoader()
        objLoader.load(
          modelUrl,
          (obj) => {
            processFootballObject(obj)
          },
          (xhr) => {
            if (xhr.total > 0) {
              setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100))
            }
          },
          (err2) => {
            console.error('Error loading OBJ:', err2)
            setError('Failed to load American football 3D model.')
            setLoading(false)
          }
        )
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
  }, [modelUrl, mtlUrl, applyPanelMaterials])

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-lg bg-radial from-zinc-900 to-zinc-950">
      {/* 3D Canvas */}
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xs text-white">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mb-2" />
          <p className="text-xs font-semibold text-zinc-200">Loading American Football...</p>
          <p className="text-[11px] text-zinc-500">Preparing 4 panels & stitches ({loadProgress}%)</p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-950/90 p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="text-xs font-bold text-red-200">Failed to Load Model</h3>
          <p className="mt-1 max-w-xs text-[11px] text-red-300">{error}</p>
        </div>
      )}

      {/* Camera interaction hint */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-xl bg-zinc-950/85 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-zinc-300 backdrop-blur-md border border-zinc-800 shadow-sm">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>360° Drag • Pinch / Scroll Zoom</span>
      </div>
    </div>
  )
})

export default FootballCanvas
