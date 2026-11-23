# Project: Custom Football Designer – React + Three.js

Act as a senior React.js developer and Three.js specialist. Build a production-quality interactive football customization application using the existing downloaded 3D football GLB model.

## 1. Technology Stack

Use only the following technologies:

- React.js with Vite
- JavaScript (ES6+)
- Tailwind CSS
- Three.js
- React Three Fiber (only if it simplifies React integration)
- Drei (for camera controls if using React Three Fiber)
- React Hooks for state management
- HTML Canvas API for image processing
- Lucide React for icons

Do not introduce a backend, database, authentication, or payment integration at this stage.

## 2. Project Objective

Build an interactive website where customers can customize a classic black-and-white football by selecting individual panels and applying their own uploaded images.

A standard football contains:

- 12 pentagonal panels (five-sided).
- 20 hexagonal panels (six-sided).
- 32 panels in total.

The application should provide two synchronized views:

1. A 2D football panel selection editor.
2. A realistic, interactive 3D football preview.

Customers should be able to select one or multiple panels, upload an image, apply it to selected panels, and inspect the final customized football by rotating it through 360 degrees.

## 3. Existing 3D Model – Important

I have already downloaded an Inn erscene soccer ball GLB model.

Place the model inside:

`public/models/soccer-ball.glb`

IMPORTANT:

- Do not create a football model from scratch.
- Do not generate a new sphere or truncated icosahedron.
- Load the existing GLB model using Three.js GLTFLoader.
- Inspect the GLB structure before implementing customization.
- Identify its meshes, materials, UV coordinates, geometry and hierarchy.
- Determine whether the model contains 32 individually accessible panel meshes or whether the panels are part of a combined mesh.
- Inspect whether its existing UV mapping supports individual panel textures.

If the model has separate panel meshes, preserve and reuse them.

If it contains a combined mesh, investigate whether its existing geometry and UV coordinates allow individual panel texture mapping.

Do not assume that the model contains 32 separate meshes.

If individual panel mapping is not directly possible, explain the technical limitation and implement an appropriate mapping strategy without replacing the original model.

## 4. Application Layout

Create a modern, minimal, professional e-commerce customization interface.

Suggested layout:

### Header

- Brand logo: Custom Football Studio.
- Navigation: Home, Customize, My Design.
- Reset customization button.

### Main Editor

Use a two-column layout on desktop.

Left section:
- 2D football panel selection editor.
- Panel selection controls.
- Image upload and customization controls.

Right section:
- Interactive 3D football preview.
- Zoom controls.
- Rotation controls.
- Reset camera.
- Auto-rotate toggle.

For mobile, stack the sections vertically.

## 5. Phase 1 – 2D Panel Editor

I have an existing flat football panel template showing the 32-panel structure.

Recreate this template using SVG rather than displaying it as a static image.

Each panel must have a unique identifier.

Example:

- P01–P12: Pentagonal panels.
- H01–H20: Hexagonal panels.

Important: These are logical IDs. The actual panel shapes and positions must follow the uploaded manufacturing template.

Requirements:

1. Draw all 32 polygon shapes.
2. Give every polygon a unique ID.
3. Make each panel individually clickable.
4. Support single-panel selection.
5. Support multiple-panel selection.
6. Clicking an already selected panel should deselect it.
7. Highlight selected panels using a visible border.
8. Show selected panel count.
9. Add Select All.
10. Add Clear Selection.
11. Add Select Hexagons.
12. Add Select Pentagons.

The SVG should be responsive and preserve its aspect ratio.

Do not approximate the uploaded template if its exact coordinates are available.

## 6. Phase 2 – Image Upload

Implement an image uploader.

Supported formats:

- PNG
- JPG / JPEG
- WEBP

Requirements:

1. Allow drag-and-drop upload.
2. Allow browsing local files.
3. Show uploaded image preview.
4. Validate image type and file size.
5. Generate an image texture using the Canvas API or Three.js TextureLoader.
6. Allow image positioning.
7. Allow zooming and cropping.
8. Allow resetting the uploaded image.
9. Show which panels will receive the image.

Initially, support one uploaded image applied independently to all selected panels.

For example, if the customer selects H01, H02 and H03, the same image should appear on all three panels.

Keep the implementation extensible so that different images can be assigned to different panels in the future.

## 7. Phase 3 – 3D Football Preview

Load the existing GLB model using GLTFLoader.

Requirements:

- Display the actual uploaded GLB football.
- Preserve its original geometry.
- Preserve its original materials wherever possible.
- Add appropriate studio lighting.
- Add realistic shadows.
- Use a neutral background.
- Position the football in the center.
- Automatically calculate the camera framing based on model dimensions.

Implement interactive controls:

- Rotate horizontally.
- Rotate vertically.
- Zoom in.
- Zoom out.
- Reset camera.
- Auto-rotate toggle.

Use OrbitControls or Drei OrbitControls.

Prevent users from zooming too far or rotating the camera into undesirable positions.

The football must be inspectable from all angles.

## 8. Phase 4 – Applying Images to Individual 3D Panels

This is the most important functionality.

The selected 2D panel IDs must correspond to the appropriate panels on the 3D football.

Create a dedicated mapping system:

`panelMapping.js`

Example conceptual mapping:

```js
const panelMapping = {
  P01: {
    meshName: "Pentagon_01",
    type: "pentagon",
  },
  H01: {
    meshName: "Hexagon_01",
    type: "hexagon",
  },
};
```

These mesh names are examples only.

Inspect the actual GLB model and create the mapping based on its real structure.

Requirements:

1. Selecting a 2D panel should identify its corresponding 3D panel.
2. Uploading an image should apply its texture to selected panels.
3. Unselected panels should preserve their original appearance.
4. Deselecting a panel should restore its original material.
5. Multiple selected panels should display the same uploaded image.
6. Changes should immediately appear in the 3D preview.
7. Changing the uploaded image should update all applicable panels.

If the GLB model has a combined mesh, investigate face groups, geometry attributes and UV mapping before selecting an alternative approach.

Do not apply the image to the entire football when only individual panels are selected.

Pay particular attention to UV orientation, image stretching and panel boundaries.

## 9. Phase 5 – Shared State Management

Create a centralized customization state.

Example:

```js
const customizationState = {
  selectedPanels: [],

  uploadedImage: null,

  panelDesigns: {},

  settings: {
    autoRotate: true,
    zoom: 1,
  },
};
```

Use React Context or Zustand if needed.

Both the SVG editor and 3D viewer must consume the same state.

Avoid duplicating panel selection logic.

Keep state updates predictable and reusable.

## 10. Suggested Folder Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── EditorLayout.jsx
│   │
│   ├── editor2d/
│   │   ├── FootballTemplate.jsx
│   │   ├── FootballPanel.jsx
│   │   └── PanelControls.jsx
│   │
│   ├── upload/
│   │   ├── ImageUploader.jsx
│   │   └── ImageControls.jsx
│   │
│   └── editor3d/
│       ├── FootballCanvas.jsx
│       ├── FootballModel.jsx
│       ├── FootballControls.jsx
│       └── Lighting.jsx
│
├── context/
│   └── CustomizationContext.jsx
│
├── hooks/
│   ├── useImageUpload.js
│   └── usePanelSelection.js
│
├── utils/
│   ├── textureUtils.js
│   └── panelMapping.js
│
├── data/
│   └── footballPanels.js
│
├── assets/
│
├── App.jsx
└── main.jsx

public/
├── models/
│   └── soccer-ball.glb
└── images/
```

## 11. UI/UX Requirements

Design should feel like a professional product customization website.

Use:

- Clean white or light-gray background.
- Minimal borders.
- Rounded cards.
- Consistent spacing.
- Clear typography.
- Responsive layout.
- Loading indicator while the GLB loads.
- Error handling if model loading fails.
- Helpful messages when no panel is selected.
- Clear image upload instructions.

The 3D football should be the main visual attraction.

Avoid excessive animations and unnecessary UI elements.

## 12. Performance Requirements

- Do not reload the GLB model on every React state update.
- Avoid unnecessarily recreating materials and textures.
- Dispose of replaced textures and materials correctly.
- Revoke object URLs when they are no longer required.
- Optimize uploaded image dimensions before creating textures.
- Avoid unnecessary component re-renders.
- Keep Three.js rendering efficient.
- Ensure the interface remains responsive during customization.

## 13. Development Instructions

Follow a milestone-based development approach.

Do not implement the entire application in one step.

### Milestone 1: Project setup
- Initialize Vite React project.
- Install and configure Tailwind CSS.
- Install Three.js dependencies.
- Create the initial application layout.

### Milestone 2: GLB inspection
- Load the existing football GLB.
- Inspect its scene hierarchy.
- Identify meshes and materials.
- Determine whether individual panel texture mapping is possible.
- Display the football with camera controls.

### Milestone 3: 2D editor
- Recreate the 32-panel template.
- Assign panel IDs.
- Implement single and multiple selection.

### Milestone 4: Image upload
- Implement image upload.
- Show previews.
- Implement basic cropping and positioning.

### Milestone 5: 3D customization
- Establish panel mapping.
- Apply textures to individual panels.
- Synchronize 2D and 3D states.

### Milestone 6: Final polish
- Improve UI.
- Optimize performance.
- Test all panel selections.
- Test multiple image sizes.
- Test desktop and mobile.

## 14. Critical Development Rules

1. Never assume the GLB contains separate panel meshes.
2. Inspect the existing GLB before deciding the texture-mapping implementation.
3. Do not create a replacement football model.
4. Do not use a flat football image as a substitute for the actual 3D model.
5. Do not apply textures to the entire football when individual panels are selected.
6. Keep the 2D and 3D panel IDs synchronized.
7. Use reusable React components.
8. Use clean and maintainable JavaScript.
9. Explain the implementation before making significant architectural decisions.
10. Do not skip milestones.

## First Task

Start ONLY with Milestone 1 and Milestone 2.

First inspect the existing project directory and the downloaded GLB model.

Then:

1. Set up Vite + React + Tailwind CSS.
2. Install Three.js and required dependencies.
3. Load `public/models/soccer-ball.glb`.
4. Render the actual football in a Three.js scene.
5. Implement rotation and zoom controls.
6. Inspect and report the GLB hierarchy, mesh names, materials and UV mapping.

Do not start image upload or panel customization until the football loads correctly and its structure has been inspected.

After completing these milestones, explain the findings and wait for my approval before continuing.