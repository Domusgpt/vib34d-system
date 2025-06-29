/**
 * VisualizerPool.js - WebGL Context Management System
 * 
 * Manages the lifecycle of WebGL contexts for the VIB34D system.
 * Creates and manages visualizer instances for each AdaptiveCard,
 * handles WebGL rendering, and coordinates with GeometryRegistry.
 * 
 * Part of Phase 2: Visualizer Rendering & Geometry
 */

class VisualizerPool {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Core dependencies
        this.geometryRegistry = null;
        this.homeMaster = null; // Phase 4: Real-time parameter source
        
        // Active visualizer instances
        this.visualizers = new Map();
        
        // WebGL state
        this.webglSupported = false;
        this.webgl2Supported = false;
        
        // Performance metrics
        this.metrics = {
            activeVisualizers: 0,
            totalFrames: 0,
            averageFPS: 60,
            lastFrameTime: performance.now(),
            webglErrors: 0
        };
        
        // Render loop state
        this.isRendering = false;
        this.renderLoopId = null;
        
        console.log('🎮 VisualizerPool initialized');
    }

    /**
     * Initialize the visualizer pool with geometry registry and HomeMaster
     */
    async initialize(geometryRegistry, homeMaster = null) {
        if (this.isInitialized) {
            console.warn('⚠️ VisualizerPool already initialized');
            return;
        }

        try {
            console.log('🎮 Initializing VisualizerPool...');
            
            this.geometryRegistry = geometryRegistry;
            this.homeMaster = homeMaster; // Phase 4: Store HomeMaster reference
            
            // Phase 4: Set up real-time parameter synchronization
            if (this.homeMaster) {
                this.setupParameterSynchronization();
            }
            
            // Check WebGL support
            this.checkWebGLSupport();
            
            if (!this.webglSupported) {
                throw new Error('WebGL not supported in this browser');
            }
            
            // Find all canvas elements for adaptive cards
            await this.initializeCanvasElements();
            
            this.isInitialized = true;
            
            console.log(`✅ VisualizerPool initialized with ${this.visualizers.size} visualizers`);
            console.log(`🎮 WebGL Support: ${this.webglSupported ? 'Yes' : 'No'}, WebGL2: ${this.webgl2Supported ? 'Yes' : 'No'}`);
            
            return this;
            
        } catch (error) {
            console.error('❌ Failed to initialize VisualizerPool:', error);
            throw error;
        }
    }
    
    /**
     * Set up real-time parameter synchronization with HomeMaster (Phase 4)
     */
    setupParameterSynchronization() {
        console.log('🔗 Setting up parameter synchronization with HomeMaster...');
        
        // Listen for parameter updates from HomeMaster
        this.homeMaster.addEventListener('parameterUpdated', (event) => {
            const { parameter, value } = event.detail;
            console.log(`🎮 Parameter updated: ${parameter} = ${value}`);
            
            // Parameters will be automatically used in next render frame
            // No need to update each visualizer individually - 
            // updateUniforms will get fresh values from HomeMaster
        });
        
        console.log('✅ Parameter synchronization established');
    }
    
    /**
     * Check WebGL support in the browser
     */
    checkWebGLSupport() {
        // Create test canvas
        const testCanvas = document.createElement('canvas');
        
        try {
            // Test WebGL 1.0
            const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
            this.webglSupported = !!gl;
            
            // Test WebGL 2.0
            const gl2 = testCanvas.getContext('webgl2');
            this.webgl2Supported = !!gl2;
            
            if (gl) {
                // Log WebGL info
                const renderer = gl.getParameter(gl.RENDERER);
                const vendor = gl.getParameter(gl.VENDOR);
                console.log(`🎮 WebGL Renderer: ${renderer}`);
                console.log(`🎮 WebGL Vendor: ${vendor}`);
            }
            
        } catch (error) {
            console.warn('⚠️ WebGL support check failed:', error);
            this.webglSupported = false;
            this.webgl2Supported = false;
        }
        
        // Cleanup test canvas
        testCanvas.remove();
    }
    
    /**
     * Initialize canvas elements for all adaptive cards
     */
    async initializeCanvasElements() {
        const canvasElements = document.querySelectorAll('.card-visualizer');
        
        console.log(`🎮 Found ${canvasElements.length} canvas elements to initialize`);
        
        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];
            await this.createVisualizer(canvas);
        }
    }
    
    /**
     * Create a visualizer instance for a canvas element
     */
    async createVisualizer(canvas) {
        try {
            const canvasId = canvas.id || `visualizer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            canvas.id = canvasId;
            
            // Get geometry type from data attribute
            const geometryType = canvas.dataset.geometry || 'hypercube';
            
            // Get geometry definition
            let geometry = this.geometryRegistry.getGeometry(geometryType);
            if (!geometry || !geometry.isLoaded) {
                console.warn(`⚠️ Geometry '${geometryType}' not ready, using hypercube`);
                geometry = this.geometryRegistry.getGeometry('hypercube');
            }
            
            // Final validation - ensure we have a working geometry
            if (!geometry || !geometry.isLoaded || !geometry.vertexShader || !geometry.fragmentShader) {
                console.error(`❌ No valid geometry available for ${canvasId}:`, {
                    requestedType: geometryType,
                    fallbackGeometry: geometry ? geometry.name : 'none',
                    isLoaded: geometry ? geometry.isLoaded : false,
                    hasShaders: geometry ? (!!geometry.vertexShader && !!geometry.fragmentShader) : false
                });
                throw new Error(`No valid geometry available for canvas ${canvasId}`);
            }
            
            // Create WebGL context
            const gl = this.createWebGLContext(canvas);
            if (!gl) {
                throw new Error(`Failed to create WebGL context for ${canvasId}`);
            }
            
            // Create visualizer instance
            const visualizer = {
                id: canvasId,
                canvas: canvas,
                gl: gl,
                geometry: geometry,
                geometryType: geometryType,
                
                // Shader programs
                program: null,
                
                // Uniform locations
                uniforms: {},
                
                // Attribute locations
                attributes: {},
                
                // Buffers
                buffers: {},
                
                // Animation parameters
                parameters: this.geometryRegistry.getDefaultParameters(geometryType),
                
                // State
                isReady: false,
                lastRenderTime: 0,
                frameCount: 0,
                
                // Error handling
                hasErrors: false,
                lastError: null
            };
            
            // Compile shaders and create program
            await this.setupVisualizerProgram(visualizer);
            
            // Setup geometry buffers
            this.setupGeometryBuffers(visualizer);
            
            // Setup canvas and viewport
            this.setupCanvasViewport(visualizer);
            
            // Store visualizer
            this.visualizers.set(canvasId, visualizer);
            this.metrics.activeVisualizers++;
            
            console.log(`🎮 Created visualizer: ${canvasId} (${geometryType})`);
            
            return visualizer;
            
        } catch (error) {
            console.error(`❌ Failed to create visualizer for canvas:`, error);
            this.metrics.webglErrors++;
            return null;
        }
    }
    
    /**
     * Create WebGL context for canvas
     */
    createWebGLContext(canvas) {
        const contextOptions = {
            alpha: true,
            antialias: true,
            depth: true,
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: 'default'
        };
        
        // Try WebGL 2.0 first, then fall back to WebGL 1.0
        let gl = null;
        
        if (this.webgl2Supported) {
            gl = canvas.getContext('webgl2', contextOptions);
        }
        
        if (!gl && this.webglSupported) {
            gl = canvas.getContext('webgl', contextOptions) || 
                 canvas.getContext('experimental-webgl', contextOptions);
        }
        
        if (gl) {
            // Enable extensions if available
            gl.getExtension('OES_standard_derivatives');
            gl.getExtension('EXT_shader_texture_lod');
            
            // Setup WebGL state
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
            // Set clear color (transparent)
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
        }
        
        return gl;
    }
    
    /**
     * Setup shader program for visualizer
     */
    async setupVisualizerProgram(visualizer) {
        const { gl, geometry } = visualizer;
        
        try {
            // Validate shader sources exist
            if (!geometry.vertexShader || !geometry.fragmentShader) {
                console.error(`❌ Missing shader sources for geometry ${geometry.name}:`, {
                    hasVertexShader: !!geometry.vertexShader,
                    hasFragmentShader: !!geometry.fragmentShader,
                    geometry: geometry
                });
                throw new Error(`Missing shader sources for geometry ${geometry.name}`);
            }
            
            // Compile vertex shader
            const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, geometry.vertexShader);
            if (!vertexShader) {
                throw new Error('Failed to compile vertex shader');
            }
            
            // Compile fragment shader
            const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, geometry.fragmentShader);
            if (!fragmentShader) {
                throw new Error('Failed to compile fragment shader');
            }
            
            // Create and link program
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            
            // Check linking success
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const error = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                throw new Error(`Shader program linking failed: ${error}`);
            }
            
            visualizer.program = program;
            
            // Get uniform locations
            this.setupUniformLocations(visualizer);
            
            // Get attribute locations
            this.setupAttributeLocations(visualizer);
            
            visualizer.isReady = true;
            
            console.log(`🎮 Shader program ready for ${visualizer.id}`);
            
        } catch (error) {
            console.error(`❌ Failed to setup shader program for ${visualizer.id}:`, error);
            visualizer.hasErrors = true;
            visualizer.lastError = error.message;
            throw error;
        }
    }
    
    /**
     * Compile a shader
     */
    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            console.error(`Shader compilation failed (${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}):`, error);
            return null;
        }
        
        return shader;
    }
    
    /**
     * Setup uniform locations for visualizer
     */
    setupUniformLocations(visualizer) {
        const { gl, program } = visualizer;
        
        // Standard uniforms for all geometries
        const uniformNames = [
            'u_modelViewMatrix',
            'u_projectionMatrix',
            'u_time',
            'u_dimension',
            'u_morphFactor',
            'u_rotationSpeed',
            'u_gridDensity',
            'u_lineThickness',
            'u_patternIntensity',
            'u_colorShift',
            'u_primaryColor',
            'u_secondaryColor'
        ];
        
        uniformNames.forEach(name => {
            const location = gl.getUniformLocation(program, name);
            if (location !== null) {
                visualizer.uniforms[name] = location;
            }
        });
        
        console.log(`🎮 Found ${Object.keys(visualizer.uniforms).length} uniforms for ${visualizer.id}`);
    }
    
    /**
     * Setup attribute locations for visualizer
     */
    setupAttributeLocations(visualizer) {
        const { gl, program } = visualizer;
        
        // Standard attributes
        const attributeNames = ['a_position', 'a_w']; // a_w for 4D coordinates
        
        attributeNames.forEach(name => {
            const location = gl.getAttribLocation(program, name);
            if (location !== -1) {
                visualizer.attributes[name] = location;
            }
        });
        
        console.log(`🎮 Found ${Object.keys(visualizer.attributes).length} attributes for ${visualizer.id}`);
    }
    
    /**
     * Setup geometry buffers for visualizer
     */
    setupGeometryBuffers(visualizer) {
        const { gl, geometry } = visualizer;
        
        if (!geometry.vertices) {
            console.warn(`⚠️ No vertex data for geometry ${geometry.name}`);
            return;
        }
        
        // Position buffer
        if (geometry.vertices.positions) {
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices.positions, gl.STATIC_DRAW);
            visualizer.buffers.position = positionBuffer;
        }
        
        // W coordinate buffer (for 4D geometries)
        if (geometry.vertices.wCoords) {
            const wBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, wBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices.wCoords, gl.STATIC_DRAW);
            visualizer.buffers.w = wBuffer;
        }
        
        // Index buffer
        if (geometry.indices) {
            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
            visualizer.buffers.index = indexBuffer;
        }
        
        console.log(`🎮 Geometry buffers setup for ${visualizer.id}`);
    }
    
    /**
     * Setup canvas viewport
     */
    setupCanvasViewport(visualizer) {
        const { canvas, gl } = visualizer;
        
        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        
        // Set viewport
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        console.log(`🎮 Canvas viewport: ${canvas.width}x${canvas.height} for ${visualizer.id}`);
    }
    
    /**
     * Start the render loop
     */
    startRenderLoop() {
        if (this.isRendering) {
            console.warn('⚠️ Render loop already running');
            return;
        }
        
        console.log('🎮 Starting VisualizerPool render loop...');
        this.isRendering = true;
        this.renderLoop();
    }
    
    /**
     * Stop the render loop
     */
    stopRenderLoop() {
        if (this.renderLoopId) {
            cancelAnimationFrame(this.renderLoopId);
            this.renderLoopId = null;
        }
        this.isRendering = false;
        console.log('🎮 VisualizerPool render loop stopped');
    }
    
    /**
     * Main render loop
     */
    renderLoop(timestamp = performance.now()) {
        if (!this.isRendering) return;
        
        // Update metrics
        const deltaTime = timestamp - this.metrics.lastFrameTime;
        this.metrics.lastFrameTime = timestamp;
        this.metrics.totalFrames++;
        
        // Calculate FPS every 60 frames
        if (this.metrics.totalFrames % 60 === 0) {
            this.metrics.averageFPS = 1000 / deltaTime;
        }
        
        // Render all visualizers
        this.renderAll(timestamp, deltaTime);
        
        // Continue loop
        this.renderLoopId = requestAnimationFrame(this.renderLoop.bind(this));
    }
    
    /**
     * Render all active visualizers
     */
    renderAll(timestamp, deltaTime) {
        this.visualizers.forEach((visualizer) => {
            if (visualizer.isReady && !visualizer.hasErrors) {
                this.renderVisualizer(visualizer, timestamp, deltaTime);
            }
        });
    }
    
    /**
     * Render a single visualizer
     */
    renderVisualizer(visualizer, timestamp, deltaTime) {
        const { gl, program, geometry } = visualizer;
        
        try {
            // Use shader program
            gl.useProgram(program);
            
            // Clear canvas
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            // Update uniforms
            this.updateUniforms(visualizer, timestamp);
            
            // Bind vertex data
            this.bindVertexData(visualizer);
            
            // Draw geometry
            this.drawGeometry(visualizer);
            
            // Update visualizer metrics
            visualizer.frameCount++;
            visualizer.lastRenderTime = timestamp;
            
        } catch (error) {
            console.error(`❌ Render error for ${visualizer.id}:`, error);
            visualizer.hasErrors = true;
            visualizer.lastError = error.message;
            this.metrics.webglErrors++;
        }
    }
    
    /**
     * Update shader uniforms
     */
    updateUniforms(visualizer, timestamp) {
        const { gl, uniforms } = visualizer;
        
        // Phase 4: Get real-time parameters from HomeMaster
        const parameters = this.homeMaster ? 
            this.homeMaster.getGlobalParameters() : 
            visualizer.parameters; // Fallback to static parameters
        
        // Time uniform
        if (uniforms.u_time) {
            gl.uniform1f(uniforms.u_time, timestamp);
        }
        
        // Dimension morphing
        if (uniforms.u_dimension) {
            gl.uniform1f(uniforms.u_dimension, parameters.u_dimension || 3.5);
        }
        
        // Morph factor
        if (uniforms.u_morphFactor) {
            gl.uniform1f(uniforms.u_morphFactor, parameters.u_morphFactor || 0.5);
        }
        
        // Rotation speed
        if (uniforms.u_rotationSpeed) {
            gl.uniform1f(uniforms.u_rotationSpeed, parameters.u_rotationSpeed || 0.6);
        }
        
        // Grid density
        if (uniforms.u_gridDensity) {
            gl.uniform1f(uniforms.u_gridDensity, parameters.u_gridDensity || 8.0);
        }
        
        // Line thickness
        if (uniforms.u_lineThickness) {
            gl.uniform1f(uniforms.u_lineThickness, parameters.u_lineThickness || 0.02);
        }
        
        // Pattern intensity
        if (uniforms.u_patternIntensity) {
            gl.uniform1f(uniforms.u_patternIntensity, parameters.u_patternIntensity || 1.0);
        }
        
        // Color shift
        if (uniforms.u_colorShift) {
            gl.uniform1f(uniforms.u_colorShift, parameters.u_colorShift || 0.0);
        }
        
        // Colors
        if (uniforms.u_primaryColor) {
            gl.uniform3f(uniforms.u_primaryColor, 0.0, 1.0, 1.0); // Cyan
        }
        
        if (uniforms.u_secondaryColor) {
            gl.uniform3f(uniforms.u_secondaryColor, 1.0, 0.0, 1.0); // Magenta
        }
        
        // Model-view and projection matrices (identity for now)
        if (uniforms.u_modelViewMatrix) {
            const identity = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
            gl.uniformMatrix4fv(uniforms.u_modelViewMatrix, false, identity);
        }
        
        if (uniforms.u_projectionMatrix) {
            const perspective = this.createPerspectiveMatrix(45, visualizer.canvas.width / visualizer.canvas.height, 0.1, 100);
            gl.uniformMatrix4fv(uniforms.u_projectionMatrix, false, perspective);
        }
    }
    
    /**
     * Bind vertex data for rendering
     */
    bindVertexData(visualizer) {
        const { gl, attributes, buffers } = visualizer;
        
        // Bind position attribute
        if (attributes.a_position && buffers.position) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.enableVertexAttribArray(attributes.a_position);
            gl.vertexAttribPointer(attributes.a_position, 3, gl.FLOAT, false, 0, 0);
        }
        
        // Bind W coordinate attribute (for 4D)
        if (attributes.a_w && buffers.w) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.w);
            gl.enableVertexAttribArray(attributes.a_w);
            gl.vertexAttribPointer(attributes.a_w, 1, gl.FLOAT, false, 0, 0);
        }
    }
    
    /**
     * Draw the geometry
     */
    drawGeometry(visualizer) {
        const { gl, geometry, buffers } = visualizer;
        
        if (buffers.index && geometry.indices) {
            // Draw with indices (wireframe)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
            gl.drawElements(gl.LINES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
        } else if (geometry.vertices && geometry.vertices.positions) {
            // Draw without indices (points)
            const vertexCount = geometry.vertices.positions.length / 3;
            gl.drawArrays(gl.POINTS, 0, vertexCount);
        }
    }
    
    /**
     * Create perspective projection matrix
     */
    createPerspectiveMatrix(fov, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov * Math.PI / 180);
        const rangeInv = 1.0 / (near - far);
        
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }
    
    /**
     * Get visualizer by ID
     */
    getVisualizer(id) {
        return this.visualizers.get(id);
    }
    
    /**
     * Get all visualizer IDs
     */
    getVisualizerIds() {
        return Array.from(this.visualizers.keys());
    }
    
    /**
     * Get pool metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            isRendering: this.isRendering,
            webglSupported: this.webglSupported,
            webgl2Supported: this.webgl2Supported
        };
    }
    
    /**
     * Update parameters for a specific visualizer
     */
    updateVisualizerParameters(visualizerId, parameters) {
        const visualizer = this.getVisualizer(visualizerId);
        if (visualizer) {
            Object.assign(visualizer.parameters, parameters);
            console.log(`🎮 Updated parameters for ${visualizerId}`);
        }
    }
    
    /**
     * Update parameters for all visualizers
     */
    updateAllParameters(parameters) {
        this.visualizers.forEach((visualizer) => {
            Object.assign(visualizer.parameters, parameters);
        });
        console.log(`🎮 Updated parameters for all ${this.visualizers.size} visualizers`);
    }
    
    /**
     * Shutdown the visualizer pool
     */
    shutdown() {
        console.log('🎮 Shutting down VisualizerPool...');
        
        this.stopRenderLoop();
        
        // Cleanup WebGL contexts
        this.visualizers.forEach((visualizer) => {
            const { gl, program, buffers } = visualizer;
            
            // Delete buffers
            Object.values(buffers).forEach(buffer => {
                if (buffer) gl.deleteBuffer(buffer);
            });
            
            // Delete program
            if (program) gl.deleteProgram(program);
            
            // Lose context
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
        });
        
        this.visualizers.clear();
        this.metrics.activeVisualizers = 0;
        this.isInitialized = false;
        
        console.log('✅ VisualizerPool shutdown complete');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualizerPool;
} else {
    window.VisualizerPool = VisualizerPool;
}

console.log('🎮 VisualizerPool loaded - WebGL context management ready');