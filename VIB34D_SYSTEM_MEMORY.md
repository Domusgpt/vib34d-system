# VIB34D SYSTEM MEMORY - ARCHITECTURAL REFERENCE

**CRITICAL**: This memory file MUST be referenced before any coding work. It contains the complete system architecture and requirements.

## SYSTEM OVERVIEW

The VIB34D Polytonal Visualizer System is a **JSON-driven, modular design** with sophisticated relational interaction physics. The entire system is built around **tesseract 8-cell hypercube navigation** with **floating adaptive cards** that contain **WebGL visualizers**.

## CORE ARCHITECTURE

### Configuration Layer (JSON Files - The Declarative Blueprint)
1. **layout-content.json** - UI structure and content
2. **visuals.json** - Aesthetic and geometric properties  
3. **behavior.json** - Dynamic interactions and transitions
4. **state-map.json** - Application states/"tesseract faces"

### Application Layer (JavaScript Modules)
1. **SystemController** - Main orchestrator, manages all other modules
2. **JsonConfigSystem** - Loads, validates, provides config access
3. **HomeMaster** - Single source of truth for app state (uses parameter web)
4. **InteractionCoordinator** - Handles relational interaction physics
5. **VisualizerPool** - Manages WebGL contexts and rendering
6. **GeometryRegistry** - Maps geometry names to GLSL shaders

### Rendering Layer
1. **WebGL Canvases** - One per AdaptiveCard for visualizers
2. **DOM Elements** - CSS-driven layout and UI components
3. **agentAPI** - External control interface

## 5-PHASE IMPLEMENTATION ROADMAP

### Phase 1: Foundational Core & Configuration
- **Task 1.1**: Implement JsonConfigSystem ✅ (COMPLETED)
- **Task 1.2**: Implement SystemController (main orchestrator)
- **Task 1.3**: Static Layout Engine (DOM generation from layout-content.json)
- **Task 1.4**: Basic Theming (CSS variables from visuals.json)

### Phase 2: Visualizer Rendering & Geometry
- **Task 2.1**: Implement GeometryRegistry
- **Task 2.2**: Implement VisualizerPool
- **Task 2.3**: Create Initial GLSL Shaders (hypercube.glsl)
- **Task 2.4**: Connect Controller to Pool

### Phase 3: State Management & Navigation
- **Task 3.1**: Implement HomeMaster
- **Task 3.2**: Integrate state-map.json
- **Task 3.3**: Implement Basic Navigation (keyboard input)
- **Task 3.4**: Implement State Transitions

### Phase 4: Relational Interaction Physics
- **Task 4.1**: Parse interactionBlueprints
- **Task 4.2**: Implement Relational Targeting (subject/parent/ecosystem/global)
- **Task 4.3**: Implement Animation Engine
- **Task 4.4**: Full Interaction Integration

### Phase 5: Agent API & Finalization
- **Task 5.1**: Implement agentAPI
- **Task 5.2**: Config Hot-Reloading
- **Task 5.3**: Performance & Bug Squashing
- **Task 5.4**: Final Documentation

## CRITICAL SYSTEM COMPONENTS

### 8 Core Geometries (WebGL Visualizers)
1. **Hypercube** - 4D lattice projection (u_dimension, u_gridDensity, u_lineThickness)
2. **Tetrahedron** - Edge-based geometric rendering
3. **Sphere** - Spherical harmonics
4. **Torus** - Toroidal flow patterns
5. **Klein Bottle** - Non-orientable surface topology
6. **Fractal** - Recursive self-similarity
7. **Wave Function** - Quantum probability distribution
8. **Crystal Lattice** - Ordered molecular structures

### Master Parameter Index (Shader Uniforms)
- **u_time** (0 to ∞) - Master clock for animations
- **u_dimension** (3.0-5.0) - Controls "4D-ness" of geometry
- **u_morphFactor** (0.0-1.5) - Blends between geometric states
- **u_rotationSpeed** (0.0-3.0) - 4D rotational animation speed
- **u_gridDensity** (1.0-25.0) - Lattice/pattern density
- **u_lineThickness** (0.002-0.1) - Line thickness in visualizer
- **u_patternIntensity** (0.0-3.0) - Brightness/contrast of patterns
- **u_colorShift** (-1.0-1.0) - Hue rotation
- **u_glitchIntensity** (0.0-0.15) - RGB separation/glitch effect

### Relational Targeting System
- **subject** - Element that triggered interaction
- **parent** - Direct container of subject
- **siblings** - Same-level elements in parent
- **children** - Elements contained within subject
- **ecosystem** - All other major components (other cards)
- **global** - Entire system including background

### Animation Properties
- **to** - Target value (absolute, relative: *=0.8, +=10, match(parent))
- **curve** - Easing function (linear, easeIn, easeOut, parabolic)
- **duration** - Animation time in ms
- **delay** - Start delay in ms
- **direction** - For rotational animations

## EXISTING IMPLEMENTATIONS TO REFERENCE

### JsonConfigSystem.js ✅ (COMPLETED)
- Configuration loading and validation
- Cross-reference validation
- Hot-reload capability
- Event bus for config updates

### VIB3HomeMaster.js (From STYLEPACK-CORE)
- Parameter web interconnectedness
- Mathematical relationship definitions
- Element registry and connections
- Performance monitoring
- Parameter interpolation

## CRITICAL SUCCESS METRICS

### Phase 1 Success
Application loads and displays basic card/component layout from layout-content.json without errors. No interactivity or WebGL yet.

### Phase 2 Success  
Each card contains running WebGL visualizer displaying default geometry, animating based on u_time.

### Phase 3 Success
User can navigate between states using keyboard, content/visuals update accordingly.

### Phase 4 Success
All interactions in behavior.json work - hovering button causes coordinated animations across subject/parent/ecosystem.

### Phase 5 Success
System fully functional, controllable via agentAPI, performs smoothly.

## agentAPI EXTERNAL CONTROL
- **agentAPI.getState()** - Returns complete current state
- **agentAPI.navigateTo(stateId)** - Triggers state transition
- **agentAPI.updateConfig(file, newConfig)** - Hot-reloads config
- **agentAPI.setMasterParameter(param, value)** - Sets master parameter
- **agentAPI.exportSystemState()** - Exports all configs/state

## SYSTEM EVENTS (Internal Messaging)
- **configLoaded** - JsonConfigSystem → SystemController
- **stateWillChange** - SystemController → VisualizerPool, UI
- **stateDidChange** - SystemController → VisualizerPool, UI  
- **parameterUpdated** - InteractionCoordinator → HomeMaster
- **renderFrame** - SystemController → VisualizerPool

## CURRENT STATUS
- ✅ JsonConfigSystem implemented with full validation
- ✅ Four JSON config files created with proper schemas
- 🔄 **NEXT**: Implement SystemController (Phase 1.2)

**ALWAYS REFERENCE THIS MEMORY FILE** before making any architectural decisions or implementations.