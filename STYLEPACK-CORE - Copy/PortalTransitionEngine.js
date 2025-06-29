/**
 * PortalTransitionEngine.js - Dimensional Gateway Effects Between Faces
 * 
 * Creates physics-defying portal transitions that connect different visualization
 * states through dimensional gateways. Features reality distortion mechanics
 * and quantum entanglement synchronization.
 */

class PortalTransitionEngine {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        
        // Portal state management
        this.activePortals = new Map();
        this.portalHistory = [];
        this.quantumEntanglements = new Map();
        
        // Reality distortion parameters
        this.distortionFields = {
            spacetime: { intensity: 0.0, frequency: 0.1, amplitude: 1.0 },
            quantum: { coherence: 1.0, superposition: 0.0, entanglement: 0.0 },
            dimensional: { axis: 'w', rotation: 0.0, fold: 0.0 }
        };
        
        // Portal visual effects
        this.portalEffects = {
            gateway: { 
                enabled: true,
                particleCount: 2000,
                energyField: 'electromagnetic',
                colorSpectrum: 'quantum-rainbow'
            },
            wormhole: {
                enabled: true,
                tunnelDepth: 4.0,
                curvature: 'hyperbolic',
                eventHorizon: 'schwarzschild'
            },
            tessellation: {
                enabled: true,
                pattern: '4d-voronoi',
                recursionDepth: 6,
                fractalDimension: 3.7
            }
        };
        
        // Animation frame management
        this.animationFrame = null;
        this.transitionQueue = [];
        this.isTransitioning = false;
        
        // Quantum synchronization
        this.entanglementPairs = new Set();
        this.coherenceState = 1.0;
        this.superpositionStates = [];
        
        console.log('🌀 PortalTransitionEngine initialized - Dimensional gateways ready');
    }
    
    /**
     * Initialize portal transition system
     */
    async initialize(hypercubeCore, vib3HomeMaster) {
        this.hypercubeCore = hypercubeCore;
        this.vib3HomeMaster = vib3HomeMaster;
        
        // Initialize portal shader programs
        await this.initializePortalShaders();
        
        // Setup quantum entanglement network
        this.initializeQuantumEntanglement();
        
        // Start reality distortion engine
        this.startRealityDistortion();
        
        this.isInitialized = true;
        console.log('✅ PortalTransitionEngine fully initialized');
        
        return this;
    }
    
    /**
     * Initialize portal transition shaders
     */
    async initializePortalShaders() {
        if (!this.hypercubeCore || !this.hypercubeCore.gl) {
            console.warn('⚠️ WebGL context not available for portal shaders');
            return;
        }
        
        const gl = this.hypercubeCore.gl;
        
        // Portal vertex shader with 4D transformations
        const portalVertexShader = `
            attribute vec4 a_position;
            attribute vec3 a_normal;
            attribute vec4 a_color;
            
            uniform mat4 u_modelViewMatrix;
            uniform mat4 u_projectionMatrix;
            uniform mat3 u_normalMatrix;
            
            // Portal distortion uniforms
            uniform float u_portalIntensity;
            uniform float u_dimensionalFold;
            uniform float u_realityDistortion;
            uniform float u_quantumCoherence;
            uniform vec4 u_portalCenter;
            uniform float u_time;
            
            varying vec4 v_color;
            varying vec3 v_normal;
            varying vec4 v_worldPosition;
            varying float v_portalDistance;
            varying float v_distortionFactor;
            
            // 4D rotation matrices for dimensional folding
            mat4 rotate4D(float angle, int plane) {
                float c = cos(angle);
                float s = sin(angle);
                mat4 rotation = mat4(1.0);
                
                if (plane == 0) { // XY plane
                    rotation[0][0] = c; rotation[0][1] = -s;
                    rotation[1][0] = s; rotation[1][1] = c;
                } else if (plane == 1) { // XZ plane  
                    rotation[0][0] = c; rotation[0][2] = -s;
                    rotation[2][0] = s; rotation[2][2] = c;
                } else if (plane == 2) { // XW plane
                    rotation[0][0] = c; rotation[0][3] = -s;
                    rotation[3][0] = s; rotation[3][3] = c;
                } else if (plane == 3) { // YZ plane
                    rotation[1][1] = c; rotation[1][2] = -s;
                    rotation[2][1] = s; rotation[2][2] = c;
                } else if (plane == 4) { // YW plane
                    rotation[1][1] = c; rotation[1][3] = -s;
                    rotation[3][1] = s; rotation[3][3] = c;
                } else if (plane == 5) { // ZW plane
                    rotation[2][2] = c; rotation[2][3] = -s;
                    rotation[3][2] = s; rotation[3][3] = c;
                }
                
                return rotation;
            }
            
            // Portal distortion function
            vec4 applyPortalDistortion(vec4 pos) {
                float distance = length(pos.xyz - u_portalCenter.xyz);
                v_portalDistance = distance;
                
                // Reality distortion based on distance to portal
                float distortionRadius = 2.0;
                float distortionFactor = 1.0 - smoothstep(0.0, distortionRadius, distance);
                v_distortionFactor = distortionFactor;
                
                // Apply dimensional folding
                float foldAngle = u_dimensionalFold * distortionFactor * sin(u_time * 2.0);
                mat4 fold = rotate4D(foldAngle, 2); // XW folding
                
                // Spacetime curvature
                vec4 curved = pos;
                curved.xyz += sin(pos.xyz * 3.14159 + u_time) * u_realityDistortion * distortionFactor * 0.1;
                
                // Quantum superposition effects
                if (u_quantumCoherence < 1.0) {
                    float coherenceFactor = mix(0.5, 1.0, u_quantumCoherence);
                    curved.xyz *= coherenceFactor;
                    curved.w += sin(u_time * 10.0) * (1.0 - u_quantumCoherence) * 0.1;
                }
                
                return fold * curved;
            }
            
            void main() {
                // Apply portal distortion to position
                vec4 distortedPosition = applyPortalDistortion(a_position);
                
                // Standard transformations
                vec4 worldPosition = u_modelViewMatrix * distortedPosition;
                v_worldPosition = worldPosition;
                
                gl_Position = u_projectionMatrix * worldPosition;
                
                // Transform normal with distortion effects
                vec3 distortedNormal = a_normal;
                if (v_distortionFactor > 0.1) {
                    // Bend normals around portal
                    vec3 toPortal = normalize(u_portalCenter.xyz - distortedPosition.xyz);
                    distortedNormal = mix(distortedNormal, toPortal, v_distortionFactor * 0.3);
                }
                
                v_normal = normalize(u_normalMatrix * distortedNormal);
                v_color = a_color;
            }
        `;
        
        // Portal fragment shader with quantum effects
        const portalFragmentShader = `
            precision highp float;
            
            varying vec4 v_color;
            varying vec3 v_normal;
            varying vec4 v_worldPosition;
            varying float v_portalDistance;
            varying float v_distortionFactor;
            
            uniform float u_time;
            uniform float u_portalIntensity;
            uniform float u_quantumCoherence;
            uniform vec3 u_baseColor;
            uniform vec3 u_portalColor;
            uniform float u_energyField;
            uniform float u_dimensionalPhase;
            
            // Quantum color calculations
            vec3 quantumSpectrum(float phase) {
                // Generate quantum rainbow based on wave interference
                vec3 quantum;
                quantum.r = 0.5 + 0.5 * sin(phase * 6.28318 + 0.0);
                quantum.g = 0.5 + 0.5 * sin(phase * 6.28318 + 2.09439);
                quantum.b = 0.5 + 0.5 * sin(phase * 6.28318 + 4.18879);
                return quantum;
            }
            
            // Portal energy field visualization
            vec3 energyField(vec3 pos, float time) {
                float field = 0.0;
                
                // Electromagnetic interference patterns
                field += sin(pos.x * 10.0 + time * 5.0) * 0.3;
                field += sin(pos.y * 12.0 + time * 7.0) * 0.2;
                field += sin(pos.z * 8.0 + time * 3.0) * 0.4;
                field += sin(length(pos) * 15.0 - time * 10.0) * 0.5;
                
                // Convert to color
                return quantumSpectrum(field * 0.5 + 0.5);
            }
            
            // Reality distortion visual effects
            float realityGlitch(vec3 pos, float time) {
                float glitch = 0.0;
                
                // Digital noise patterns
                glitch += fract(sin(dot(pos.xy, vec2(12.9898, 78.233))) * 43758.5453);
                glitch *= step(0.98, fract(time * 20.0)); // Intermittent glitches
                
                // Quantum decoherence effects
                glitch += (1.0 - u_quantumCoherence) * 0.5;
                
                return glitch;
            }
            
            void main() {
                vec3 finalColor = v_color.rgb;
                
                // Portal proximity effects
                if (v_portalDistance < 2.0) {
                    float portalFactor = 1.0 - (v_portalDistance / 2.0);
                    
                    // Energy field visualization
                    vec3 energy = energyField(v_worldPosition.xyz, u_time);
                    finalColor = mix(finalColor, energy, portalFactor * u_portalIntensity * 0.7);
                    
                    // Portal color bleeding
                    finalColor = mix(finalColor, u_portalColor, portalFactor * 0.3);
                    
                    // Dimensional phase effects
                    float phase = u_dimensionalPhase + v_portalDistance * 3.14159;
                    vec3 phaseColor = quantumSpectrum(phase);
                    finalColor = mix(finalColor, phaseColor, portalFactor * 0.2);
                }
                
                // Reality distortion glitches
                float glitch = realityGlitch(v_worldPosition.xyz, u_time);
                if (glitch > 0.5) {
                    finalColor = mix(finalColor, vec3(1.0, 0.0, 1.0), glitch * 0.8);
                }
                
                // Quantum coherence effects
                if (u_quantumCoherence < 1.0) {
                    float decoherence = 1.0 - u_quantumCoherence;
                    
                    // Superposition visualization
                    vec3 superposed = quantumSpectrum(u_time * 5.0 + v_portalDistance);
                    finalColor = mix(finalColor, superposed, decoherence * 0.4);
                    
                    // Transparency effects for uncertainty
                    gl_FragColor.a = v_color.a * (0.3 + 0.7 * u_quantumCoherence);
                } else {
                    gl_FragColor.a = v_color.a;
                }
                
                // Enhanced brightness near portals
                finalColor *= 1.0 + v_distortionFactor * 0.5;
                
                gl_FragColor.rgb = finalColor;
            }
        `;
        
        // Create and compile portal shader program
        try {
            this.portalShaderProgram = this.hypercubeCore.shaderManager.createShaderProgram(
                portalVertexShader,
                portalFragmentShader
            );
            
            // Get uniform locations
            this.portalUniforms = {
                portalIntensity: gl.getUniformLocation(this.portalShaderProgram, 'u_portalIntensity'),
                dimensionalFold: gl.getUniformLocation(this.portalShaderProgram, 'u_dimensionalFold'),
                realityDistortion: gl.getUniformLocation(this.portalShaderProgram, 'u_realityDistortion'),
                quantumCoherence: gl.getUniformLocation(this.portalShaderProgram, 'u_quantumCoherence'),
                portalCenter: gl.getUniformLocation(this.portalShaderProgram, 'u_portalCenter'),
                time: gl.getUniformLocation(this.portalShaderProgram, 'u_time'),
                baseColor: gl.getUniformLocation(this.portalShaderProgram, 'u_baseColor'),
                portalColor: gl.getUniformLocation(this.portalShaderProgram, 'u_portalColor'),
                energyField: gl.getUniformLocation(this.portalShaderProgram, 'u_energyField'),
                dimensionalPhase: gl.getUniformLocation(this.portalShaderProgram, 'u_dimensionalPhase')
            };
            
            console.log('🌀 Portal shaders compiled successfully');
            
        } catch (error) {
            console.error('❌ Failed to compile portal shaders:', error);
        }
    }
    
    /**
     * Initialize quantum entanglement network
     */
    initializeQuantumEntanglement() {
        // Create quantum entanglement pairs between visualizers
        this.quantumEntanglements.set('hypercube-tetrahedron', {
            state: 'entangled',
            coherence: 1.0,
            correlation: 0.95,
            lastSync: Date.now()
        });
        
        this.quantumEntanglements.set('sphere-torus', {
            state: 'entangled', 
            coherence: 0.9,
            correlation: 0.87,
            lastSync: Date.now()
        });
        
        this.quantumEntanglements.set('klein-fractal', {
            state: 'superposed',
            coherence: 0.7,
            correlation: 0.92,
            lastSync: Date.now()
        });
        
        console.log('🔗 Quantum entanglement network initialized');
    }
    
    /**
     * Start reality distortion engine
     */
    startRealityDistortion() {
        const distortionLoop = () => {
            this.updateRealityDistortion();
            this.updateQuantumStates();
            this.processPortalTransitions();
            
            this.animationFrame = requestAnimationFrame(distortionLoop);
        };
        
        distortionLoop();
        console.log('🌊 Reality distortion engine started');
    }
    
    /**
     * Create portal between two visualization states
     */
    createPortal(fromGeometry, toGeometry, transitionType = 'wormhole') {
        const portalId = `portal-${fromGeometry}-${toGeometry}-${Date.now()}`;
        
        const portal = {
            id: portalId,
            from: fromGeometry,
            to: toGeometry,
            type: transitionType,
            intensity: 0.0,
            phase: 0.0,
            createdAt: Date.now(),
            state: 'opening',
            
            // Portal parameters
            center: { x: 0, y: 0, z: 0, w: 0 },
            radius: 0.0,
            targetRadius: 1.5,
            energyField: 'electromagnetic',
            dimensionalFold: 0.0,
            
            // Quantum properties
            coherence: 1.0,
            entanglement: this.quantumEntanglements.get(`${fromGeometry}-${toGeometry}`) || null
        };
        
        this.activePortals.set(portalId, portal);
        this.portalHistory.push({ action: 'created', portalId, timestamp: Date.now() });
        
        // Start portal opening animation
        this.animatePortalOpening(portalId);
        
        console.log(`🌀 Portal created: ${fromGeometry} → ${toGeometry} (${transitionType})`);
        return portalId;
    }
    
    /**
     * Animate portal opening sequence
     */
    animatePortalOpening(portalId) {
        const portal = this.activePortals.get(portalId);
        if (!portal) return;
        
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const openingAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            
            // Ease-in-out curve for smooth opening
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            // Update portal parameters
            portal.intensity = easeProgress;
            portal.radius = easeProgress * portal.targetRadius;
            portal.phase = easeProgress * Math.PI * 2;
            portal.dimensionalFold = easeProgress * 0.5;
            
            // Reality distortion effects
            this.distortionFields.spacetime.intensity = easeProgress * 0.8;
            this.distortionFields.dimensional.fold = easeProgress * 0.3;
            
            if (progress < 1.0) {
                requestAnimationFrame(openingAnimation);
            } else {
                portal.state = 'stable';
                console.log(`🌀 Portal fully opened: ${portal.id}`);
                
                // Trigger geometry transition
                setTimeout(() => {
                    this.executePortalTransition(portalId);
                }, 500);
            }
        };
        
        openingAnimation();
    }
    
    /**
     * Execute portal transition between geometries
     */
    executePortalTransition(portalId) {
        const portal = this.activePortals.get(portalId);
        if (!portal || !this.hypercubeCore) return;
        
        portal.state = 'transitioning';
        
        // Apply quantum entanglement effects
        if (portal.entanglement) {
            this.synchronizeEntangledStates(portal.entanglement);
        }
        
        // Trigger geometry change with portal effects
        if (this.hypercubeCore.setGeometry) {
            // Store original geometry state
            const originalGeometry = this.hypercubeCore.currentGeometry;
            
            // Apply reality distortion during transition
            this.distortionFields.quantum.superposition = 0.7;
            this.distortionFields.spacetime.intensity = 1.0;
            
            // Execute geometry transition
            this.hypercubeCore.setGeometry(portal.to);
            
            // Portal visual feedback
            this.triggerPortalFlash(portal);
            
            // Gradually restore reality coherence
            setTimeout(() => {
                this.distortionFields.quantum.superposition = 0.0;
                this.distortionFields.spacetime.intensity = 0.0;
                portal.state = 'closing';
                
                this.closePortal(portalId);
            }, 1500);
            
            console.log(`🌀 Portal transition executed: ${originalGeometry} → ${portal.to}`);
        }
    }
    
    /**
     * Trigger portal flash effect
     */
    triggerPortalFlash(portal) {
        // Create intense visual flash
        const flashIntensity = 2.0;
        const flashDuration = 300;
        
        // Apply to portal uniforms if available
        if (this.portalShaderProgram && this.hypercubeCore.gl) {
            const gl = this.hypercubeCore.gl;
            gl.useProgram(this.portalShaderProgram);
            
            gl.uniform1f(this.portalUniforms.portalIntensity, flashIntensity);
            gl.uniform3f(this.portalUniforms.portalColor, 1.0, 1.0, 1.0); // White flash
            gl.uniform1f(this.portalUniforms.dimensionalPhase, Math.PI);
        }
        
        // Notify parameter web of portal flash
        if (this.vib3HomeMaster) {
            this.vib3HomeMaster.registerInteraction('portalFlash', 'main-hypercube-canvas', flashIntensity, {
                portalId: portal.id,
                transition: `${portal.from}-${portal.to}`,
                flashType: 'dimensional-gateway'
            });
        }
        
        // Fade flash gradually
        setTimeout(() => {
            if (this.portalShaderProgram && this.hypercubeCore.gl) {
                const gl = this.hypercubeCore.gl;
                gl.useProgram(this.portalShaderProgram);
                gl.uniform1f(this.portalUniforms.portalIntensity, portal.intensity);
            }
        }, flashDuration);
    }
    
    /**
     * Synchronize quantum entangled states
     */
    synchronizeEntangledStates(entanglement) {
        // Update quantum coherence based on entanglement
        this.coherenceState = entanglement.coherence;
        
        // Apply entanglement correlation
        this.distortionFields.quantum.entanglement = entanglement.correlation;
        
        // Update entanglement timing
        entanglement.lastSync = Date.now();
        
        console.log(`🔗 Quantum entanglement synchronized (coherence: ${entanglement.coherence.toFixed(2)})`);
    }
    
    /**
     * Close portal and cleanup
     */
    closePortal(portalId) {
        const portal = this.activePortals.get(portalId);
        if (!portal) return;
        
        portal.state = 'closing';
        
        // Animate portal closing
        const closingDuration = 1000;
        const startTime = Date.now();
        
        const closingAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / closingDuration, 1.0);
            const remainingIntensity = 1.0 - progress;
            
            portal.intensity = remainingIntensity;
            portal.radius = remainingIntensity * portal.targetRadius;
            portal.dimensionalFold = remainingIntensity * 0.5;
            
            if (progress < 1.0) {
                requestAnimationFrame(closingAnimation);
            } else {
                // Portal fully closed
                this.activePortals.delete(portalId);
                this.portalHistory.push({ action: 'closed', portalId, timestamp: Date.now() });
                console.log(`🌀 Portal closed: ${portal.id}`);
            }
        };
        
        closingAnimation();
    }
    
    /**
     * Update reality distortion effects
     */
    updateRealityDistortion() {
        const time = Date.now() * 0.001;
        
        // Spacetime distortion oscillations
        this.distortionFields.spacetime.frequency = 0.1 + Math.sin(time * 0.5) * 0.05;
        this.distortionFields.spacetime.amplitude = 1.0 + Math.cos(time * 0.3) * 0.2;
        
        // Dimensional rotation
        this.distortionFields.dimensional.rotation += 0.01;
        if (this.distortionFields.dimensional.rotation > Math.PI * 2) {
            this.distortionFields.dimensional.rotation = 0;
        }
        
        // Update portal shader uniforms
        if (this.portalShaderProgram && this.hypercubeCore && this.hypercubeCore.gl) {
            const gl = this.hypercubeCore.gl;
            gl.useProgram(this.portalShaderProgram);
            
            gl.uniform1f(this.portalUniforms.time, time);
            gl.uniform1f(this.portalUniforms.realityDistortion, this.distortionFields.spacetime.intensity);
            gl.uniform1f(this.portalUniforms.dimensionalFold, this.distortionFields.dimensional.fold);
            gl.uniform1f(this.portalUniforms.quantumCoherence, this.coherenceState);
        }
    }
    
    /**
     * Update quantum states
     */
    updateQuantumStates() {
        // Quantum decoherence over time
        this.quantumEntanglements.forEach((entanglement, pair) => {
            const timeSinceSync = Date.now() - entanglement.lastSync;
            const decoherenceRate = 0.00001; // Very slow decoherence
            
            entanglement.coherence = Math.max(0.5, entanglement.coherence - timeSinceSync * decoherenceRate);
        });
        
        // Update global coherence state
        let totalCoherence = 0;
        let count = 0;
        this.quantumEntanglements.forEach(entanglement => {
            totalCoherence += entanglement.coherence;
            count++;
        });
        
        if (count > 0) {
            this.coherenceState = totalCoherence / count;
        }
    }
    
    /**
     * Process portal transition queue
     */
    processPortalTransitions() {
        if (this.transitionQueue.length > 0 && !this.isTransitioning) {
            const transition = this.transitionQueue.shift();
            this.executeQueuedTransition(transition);
        }
    }
    
    /**
     * Queue portal transition
     */
    queuePortalTransition(fromGeometry, toGeometry, transitionType = 'wormhole') {
        this.transitionQueue.push({
            from: fromGeometry,
            to: toGeometry,
            type: transitionType,
            timestamp: Date.now()
        });
        
        console.log(`🌀 Portal transition queued: ${fromGeometry} → ${toGeometry}`);
    }
    
    /**
     * Execute queued transition
     */
    executeQueuedTransition(transition) {
        this.isTransitioning = true;
        
        const portalId = this.createPortal(transition.from, transition.to, transition.type);
        
        // Mark transition as complete when portal closes
        const originalClosePortal = this.closePortal.bind(this);
        this.closePortal = (id) => {
            originalClosePortal(id);
            if (id === portalId) {
                this.isTransitioning = false;
            }
        };
    }
    
    /**
     * Get current portal statistics
     */
    getPortalStatistics() {
        return {
            activePortals: this.activePortals.size,
            queuedTransitions: this.transitionQueue.length,
            quantumEntanglements: this.quantumEntanglements.size,
            coherenceState: this.coherenceState.toFixed(3),
            realityDistortion: this.distortionFields.spacetime.intensity.toFixed(3),
            portalHistory: this.portalHistory.length
        };
    }
    
    /**
     * Emergency reality reset
     */
    emergencyRealityReset() {
        console.log('🚨 Emergency reality reset initiated');
        
        // Close all portals immediately
        this.activePortals.forEach((portal, id) => {
            this.activePortals.delete(id);
        });
        
        // Reset distortion fields
        this.distortionFields.spacetime.intensity = 0.0;
        this.distortionFields.quantum.superposition = 0.0;
        this.distortionFields.dimensional.fold = 0.0;
        
        // Restore quantum coherence
        this.coherenceState = 1.0;
        this.quantumEntanglements.forEach(entanglement => {
            entanglement.coherence = 1.0;
        });
        
        // Clear transition queue
        this.transitionQueue = [];
        this.isTransitioning = false;
        
        console.log('✅ Reality restored to baseline state');
    }
}

// Export for global access
window.PortalTransitionEngine = PortalTransitionEngine;

console.log('🌀 PortalTransitionEngine loaded - Dimensional gateways ready');