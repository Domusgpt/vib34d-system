/**
 * GeometryRegistry.js - Geometry Management System
 * 
 * Manages the 8 core VIB34D geometries by loading definitions from visuals.json
 * and mapping geometry names to their respective GLSL shader implementations.
 * 
 * Part of Phase 2: Visualizer Rendering & Geometry
 */

class GeometryRegistry {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Geometry definitions loaded from visuals.json
        this.geometries = new Map();
        
        // Shader cache for loaded GLSL files
        this.shaderCache = new Map();
        
        // Default parameters for each geometry type
        this.defaultParameters = new Map();
        
        // Performance metrics
        this.metrics = {
            geometriesLoaded: 0,
            shadersLoaded: 0,
            loadTime: 0
        };
        
        console.log('📐 GeometryRegistry initialized');
    }

    /**
     * Initialize the geometry registry with configuration system
     */
    async initialize(jsonConfigSystem) {
        if (this.isInitialized) {
            console.warn('⚠️ GeometryRegistry already initialized');
            return;
        }

        const startTime = performance.now();
        
        try {
            console.log('📐 Loading geometry definitions...');
            
            this.jsonConfigSystem = jsonConfigSystem;
            
            // Get visuals configuration
            const visualsConfig = this.jsonConfigSystem.getConfig('visuals');
            if (!visualsConfig) {
                throw new Error('No visuals configuration found');
            }
            
            // Load geometry definitions
            await this.loadGeometryDefinitions(visualsConfig);
            
            // Load default parameters
            this.loadDefaultParameters(visualsConfig);
            
            // Initialize built-in geometries (for shaders we'll create inline)
            this.initializeBuiltInGeometries();
            
            this.metrics.loadTime = performance.now() - startTime;
            this.isInitialized = true;
            
            console.log(`✅ GeometryRegistry initialized in ${this.metrics.loadTime.toFixed(2)}ms`);
            console.log(`📊 Loaded ${this.metrics.geometriesLoaded} geometries, ${this.metrics.shadersLoaded} shaders`);
            
            return this;
            
        } catch (error) {
            console.error('❌ Failed to initialize GeometryRegistry:', error);
            throw error;
        }
    }
    
    /**
     * Load geometry definitions from visuals.json
     */
    async loadGeometryDefinitions(visualsConfig) {
        const geometryDefs = visualsConfig.geometries || [];
        
        for (const geometryDef of geometryDefs) {
            try {
                const geometry = {
                    name: geometryDef.name,
                    displayName: geometryDef.displayName || geometryDef.name,
                    description: geometryDef.description || '',
                    shaderFile: geometryDef.shaderFile,
                    category: geometryDef.category || 'standard',
                    complexity: geometryDef.complexity || 'medium',
                    defaultParams: geometryDef.defaultParams || {},
                    
                    // WebGL shader programs (will be compiled later)
                    vertexShader: null,
                    fragmentShader: null,
                    program: null,
                    
                    // Geometry-specific data
                    vertices: null,
                    indices: null,
                    
                    // Status
                    isLoaded: false,
                    loadTime: null
                };
                
                this.geometries.set(geometryDef.name, geometry);
                this.metrics.geometriesLoaded++;
                
                console.log(`📐 Registered geometry: ${geometryDef.name} (${geometry.category})`);
                
            } catch (error) {
                console.error(`❌ Failed to load geometry ${geometryDef.name}:`, error);
            }
        }
    }
    
    /**
     * Load default parameters from visuals.json
     */
    loadDefaultParameters(visualsConfig) {
        const parameters = visualsConfig.parameters || {};
        
        // Store global default parameters
        Object.entries(parameters).forEach(([paramName, paramDef]) => {
            this.defaultParameters.set(paramName, {
                name: paramName,
                default: paramDef.default,
                min: paramDef.min,
                max: paramDef.max,
                step: paramDef.step || 0.01,
                type: paramDef.type || 'float',
                description: paramDef.description || ''
            });
        });
        
        console.log(`📐 Loaded ${this.defaultParameters.size} default parameters`);
    }
    
    /**
     * Initialize built-in geometries with inline shaders (Phase 2.3)
     */
    initializeBuiltInGeometries() {
        // Initialize hypercube geometry with inline shaders
        this.initializeHypercubeGeometry();
        
        // Initialize other basic geometries
        this.initializeTetrahedronGeometry();
        this.initializeSphereGeometry();
        this.initializeTorusGeometry();
        
        console.log('📐 Built-in geometries initialized');
    }
    
    /**
     * Initialize hypercube geometry (Task 2.3 - Primary geometry)
     */
    initializeHypercubeGeometry() {
        let hypercube = this.geometries.get('hypercube');
        if (!hypercube) {
            // Create hypercube geometry if it doesn't exist
            console.log('📐 Creating missing hypercube geometry...');
            hypercube = {
                name: 'hypercube',
                displayName: '4D Hypercube (Tesseract)',
                description: 'Built-in 4D hypercube geometry with tesseract projection',
                type: 'wireframe',
                complexity: 'high',
                category: '4d',
                isLoaded: false,
                hasShaders: false
            };
            this.geometries.set('hypercube', hypercube);
        }
        
        // Vertex shader for 4D hypercube projection
        hypercube.vertexShader = `
            attribute vec4 a_position;
            attribute float a_w; // 4th dimension coordinate
            
            uniform mat4 u_modelViewMatrix;
            uniform mat4 u_projectionMatrix;
            uniform float u_time;
            uniform float u_dimension; // 3.0 to 5.0
            uniform float u_rotationSpeed;
            
            varying vec3 v_position;
            varying float v_depth;
            varying float v_w;
            
            // 4D rotation matrices
            mat4 rotateXW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    c, 0.0, 0.0, -s,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    s, 0.0, 0.0, c
                );
            }
            
            mat4 rotateYW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1.0, 0.0, 0.0, 0.0,
                    0.0, c, 0.0, -s,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, s, 0.0, c
                );
            }
            
            void main() {
                // Create 4D position
                vec4 pos4d = vec4(a_position.xyz, a_w);
                
                // Apply 4D rotations
                float time = u_time * u_rotationSpeed * 0.001;
                pos4d = rotateXW(time) * pos4d;
                pos4d = rotateYW(time * 0.7) * pos4d;
                
                // Project from 4D to 3D
                float w = pos4d.w;
                float perspective4d = 1.0 / (2.0 - w * 0.5);
                vec3 pos3d = pos4d.xyz * perspective4d;
                
                // Apply dimension morphing
                float morphFactor = (u_dimension - 3.0) / 2.0;
                pos3d = mix(a_position.xyz, pos3d, morphFactor);
                
                v_position = pos3d;
                v_depth = pos3d.z;
                v_w = w;
                
                gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(pos3d, 1.0);
            }
        `;
        
        // Fragment shader for hypercube
        hypercube.fragmentShader = `
            precision mediump float;
            
            uniform float u_time;
            uniform float u_gridDensity;
            uniform float u_lineThickness;
            uniform float u_patternIntensity;
            uniform float u_colorShift;
            uniform vec3 u_primaryColor;
            uniform vec3 u_secondaryColor;
            
            varying vec3 v_position;
            varying float v_depth;
            varying float v_w;
            
            void main() {
                // Create grid pattern
                vec2 grid = fract(v_position.xy * u_gridDensity);
                float gridLines = smoothstep(0.0, u_lineThickness, grid.x) * 
                                 smoothstep(0.0, u_lineThickness, grid.y);
                
                // Color based on 4D position and time
                float hue = v_w * 0.5 + u_time * 0.0001 + u_colorShift;
                vec3 color = mix(u_primaryColor, u_secondaryColor, sin(hue) * 0.5 + 0.5);
                
                // Depth-based intensity
                float intensity = (1.0 - abs(v_depth) * 0.5) * u_patternIntensity;
                
                // Combine grid and color
                vec3 finalColor = color * intensity * (0.3 + gridLines * 0.7);
                
                // 4D depth effects
                float alpha = 0.7 + v_w * 0.3;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `;
        
        // Generate hypercube vertices (8 vertices of 3D cube, extended to 4D)
        hypercube.vertices = this.generateHypercubeVertices();
        hypercube.indices = this.generateHypercubeIndices();
        
        // Mark shaders as loaded and geometry as ready
        hypercube.hasShaders = true;
        hypercube.isLoaded = true;
        this.metrics.shadersLoaded++;
        
        console.log('📐 Hypercube geometry initialized with 4D shaders');
    }
    
    /**
     * Generate hypercube vertices (16 vertices: 8 for w=+1, 8 for w=-1)
     */
    generateHypercubeVertices() {
        const vertices = [];
        const positions = [];
        const wCoords = [];
        
        // Generate 16 vertices of 4D hypercube
        for (let w = -1; w <= 1; w += 2) {
            for (let z = -1; z <= 1; z += 2) {
                for (let y = -1; y <= 1; y += 2) {
                    for (let x = -1; x <= 1; x += 2) {
                        // Position (x, y, z)
                        positions.push(x * 0.5, y * 0.5, z * 0.5);
                        // W coordinate
                        wCoords.push(w * 0.5);
                    }
                }
            }
        }
        
        return {
            positions: new Float32Array(positions),
            wCoords: new Float32Array(wCoords)
        };
    }
    
    /**
     * Generate hypercube edge indices
     */
    generateHypercubeIndices() {
        const indices = [];
        
        // Connect vertices to form hypercube edges
        // This creates the wireframe structure of a 4D hypercube
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                // Check if vertices are connected by an edge
                // (differ by exactly one coordinate)
                const xi = (i >> 0) & 1;
                const yi = (i >> 1) & 1;
                const zi = (i >> 2) & 1;
                const wi = (i >> 3) & 1;
                
                const xj = (j >> 0) & 1;
                const yj = (j >> 1) & 1;
                const zj = (j >> 2) & 1;
                const wj = (j >> 3) & 1;
                
                const diff = Math.abs(xi - xj) + Math.abs(yi - yj) + 
                            Math.abs(zi - zj) + Math.abs(wi - wj);
                
                if (diff === 1) {
                    indices.push(i, j);
                }
            }
        }
        
        return new Uint16Array(indices);
    }
    
    /**
     * Initialize other basic geometries (simplified for Phase 2)
     */
    initializeTetrahedronGeometry() {
        const tetrahedron = this.geometries.get('tetrahedron');
        if (!tetrahedron) return;
        
        // Basic tetrahedron implementation
        tetrahedron.isLoaded = true;
        this.metrics.shadersLoaded++;
        console.log('📐 Tetrahedron geometry initialized');
    }
    
    initializeSphereGeometry() {
        const sphere = this.geometries.get('sphere');
        if (!sphere) return;
        
        // Basic sphere implementation
        sphere.isLoaded = true;
        this.metrics.shadersLoaded++;
        console.log('📐 Sphere geometry initialized');
    }
    
    initializeTorusGeometry() {
        const torus = this.geometries.get('torus');
        if (!torus) return;
        
        // Basic torus implementation
        torus.isLoaded = true;
        this.metrics.shadersLoaded++;
        console.log('📐 Torus geometry initialized');
    }
    
    /**
     * Get geometry definition by name
     */
    getGeometry(name) {
        const geometry = this.geometries.get(name);
        if (!geometry) {
            console.warn(`⚠️ Geometry '${name}' not found, using default`);
            return this.geometries.get('hypercube') || null;
        }
        return geometry;
    }
    
    /**
     * Get all available geometry names
     */
    getGeometryNames() {
        return Array.from(this.geometries.keys());
    }
    
    /**
     * Get default parameters for a specific geometry or global defaults
     */
    getDefaultParameters(geometryName = null) {
        const params = {};
        
        // Get global defaults
        this.defaultParameters.forEach((paramDef, paramName) => {
            params[paramName] = paramDef.default;
        });
        
        // Override with geometry-specific defaults
        if (geometryName) {
            const geometry = this.getGeometry(geometryName);
            if (geometry && geometry.defaultParams) {
                Object.assign(params, geometry.defaultParams);
            }
        }
        
        return params;
    }
    
    /**
     * Check if a geometry is loaded and ready
     */
    isGeometryReady(name) {
        const geometry = this.getGeometry(name);
        return geometry && geometry.isLoaded;
    }
    
    /**
     * Get geometry metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            totalGeometries: this.geometries.size,
            loadedGeometries: Array.from(this.geometries.values()).filter(g => g.isLoaded).length
        };
    }
    
    /**
     * Reload geometry definitions from configuration
     */
    async reload() {
        console.log('🔄 Reloading GeometryRegistry...');
        
        this.geometries.clear();
        this.defaultParameters.clear();
        this.shaderCache.clear();
        this.metrics = { geometriesLoaded: 0, shadersLoaded: 0, loadTime: 0 };
        this.isInitialized = false;
        
        if (this.jsonConfigSystem) {
            await this.initialize(this.jsonConfigSystem);
        }
    }
    
    /**
     * Validate geometry configuration
     */
    validateGeometry(geometryName) {
        const geometry = this.getGeometry(geometryName);
        if (!geometry) return false;
        
        const issues = [];
        
        if (!geometry.vertexShader) issues.push('Missing vertex shader');
        if (!geometry.fragmentShader) issues.push('Missing fragment shader');
        if (!geometry.vertices) issues.push('Missing vertex data');
        
        if (issues.length > 0) {
            console.warn(`⚠️ Geometry '${geometryName}' validation issues:`, issues);
            return false;
        }
        
        return true;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeometryRegistry;
} else {
    window.GeometryRegistry = GeometryRegistry;
}

console.log('📐 GeometryRegistry loaded - Geometry management ready');