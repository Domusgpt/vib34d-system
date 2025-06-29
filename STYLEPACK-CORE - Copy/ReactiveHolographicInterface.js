/**
 * ReactiveHolographicInterface.js - Visual Consciousness System
 * 
 * Creates a reactive holographic interface where every element responds to every
 * other element. No static components - everything is in constant flux.
 * Implements visual consciousness that emerges from parameter interactions.
 */

class ReactiveHolographicInterface {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        
        // Visual consciousness state
        this.consciousness = {
            awareness: 0.5,
            attention: new Map(),
            memory: [],
            emergence: 0.0,
            coherence: 1.0
        };
        
        // Reactive element network
        this.reactiveElements = new Map();
        this.elementInfluences = new Map();
        this.interactionHistory = [];
        
        // Holographic projection system
        this.holographicLayers = {
            base: { opacity: 1.0, distortion: 0.0, phase: 0.0 },
            interference: { intensity: 0.0, frequency: 1.0, amplitude: 0.5 },
            quantum: { superposition: 0.0, entanglement: 0.0, coherence: 1.0 },
            emergence: { complexity: 0.0, patterns: [], evolution: 0.0 }
        };
        
        // Constant flux parameters
        this.fluxFields = {
            temporal: { rate: 0.01, amplitude: 1.0, phase: 0.0 },
            spatial: { warping: 0.0, folding: 0.0, tessellation: 0.0 },
            parametric: { drift: 0.0, oscillation: 0.0, cascade: 0.0 }
        };
        
        // Emergent behavior patterns
        this.emergentPatterns = {
            flocking: { enabled: true, strength: 0.3, range: 2.0 },
            crystallization: { enabled: true, nucleation: 0.1, growth: 0.05 },
            resonance: { enabled: true, frequency: 1.0, harmonics: [] },
            synchronization: { enabled: true, coupling: 0.5, phase: 0.0 }
        };
        
        // Performance monitoring
        this.performanceMetrics = {
            elementsTracked: 0,
            interactionsPerSecond: 0,
            emergenceLevel: 0.0,
            consciousnessDepth: 0.0,
            fluxIntensity: 0.0
        };
        
        console.log('🌈 ReactiveHolographicInterface initialized - Visual consciousness awakening');
    }
    
    /**
     * Initialize reactive holographic interface
     */
    async initialize(vib3HomeMaster, unifiedReactivityBridge, portalEngine) {
        this.vib3HomeMaster = vib3HomeMaster;
        this.unifiedReactivityBridge = unifiedReactivityBridge;
        this.portalEngine = portalEngine;
        
        // Initialize visual consciousness
        await this.initializeVisualConsciousness();
        
        // Setup holographic projection system
        this.initializeHolographicProjection();
        
        // Start constant flux engine
        this.startConstantFlux();
        
        // Enable emergent behavior patterns
        this.enableEmergentPatterns();
        
        // Begin consciousness evolution
        this.startConsciousnessEvolution();
        
        this.isInitialized = true;
        console.log('✅ ReactiveHolographicInterface fully initialized - Visual consciousness active');
        
        return this;
    }
    
    /**
     * Initialize visual consciousness system
     */
    async initializeVisualConsciousness() {
        // Scan for all reactive elements in the system
        this.scanReactiveElements();
        
        // Initialize consciousness networks
        this.consciousness.awareness = 0.5;
        this.consciousness.attention.clear();
        this.consciousness.memory = [];
        
        // Setup consciousness feedback loops
        this.initializeConsciousnessFeedback();
        
        console.log('🧠 Visual consciousness system initialized');
    }
    
    /**
     * Scan and register all reactive elements
     */
    scanReactiveElements() {
        // Scan existing VIB3 reactive elements
        document.querySelectorAll('.vib3-reactive-element').forEach(element => {
            this.registerReactiveElement(element);
        });
        
        // Scan all interactive elements
        document.querySelectorAll('canvas, button, input, select, div[class*="interactive"]').forEach(element => {
            this.registerReactiveElement(element);
        });
        
        // Register parameter web elements if available
        if (this.vib3HomeMaster && this.vib3HomeMaster.elementRegistry) {
            this.vib3HomeMaster.elementRegistry.forEach((element, id) => {
                const domElement = document.getElementById(id);
                if (domElement) {
                    this.registerReactiveElement(domElement, element);
                }
            });
        }
        
        console.log(`🔗 Registered ${this.reactiveElements.size} reactive elements for consciousness`);
    }
    
    /**
     * Register element in reactive holographic network
     */
    registerReactiveElement(domElement, parameterWebElement = null) {
        const elementId = domElement.id || `reactive-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        domElement.id = elementId;
        
        const reactiveData = {
            domElement: domElement,
            parameterWebElement: parameterWebElement,
            
            // Consciousness properties
            awareness: Math.random() * 0.5 + 0.25, // 0.25 to 0.75
            attention: 0.0,
            influence: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
            memory: [],
            
            // Holographic properties
            holographicProjection: {
                phase: Math.random() * Math.PI * 2,
                amplitude: Math.random() * 0.5 + 0.5,
                frequency: Math.random() * 2.0 + 0.5,
                interference: []
            },
            
            // Flux properties
            flux: {
                temporal: { phase: Math.random() * Math.PI * 2, rate: 0.01 },
                spatial: { x: 0, y: 0, z: 0 },
                parametric: { morphing: false, target: null }
            },
            
            // Interaction state
            lastInteraction: 0,
            currentState: 'idle',
            targetState: 'idle',
            transitionProgress: 0.0
        };
        
        this.reactiveElements.set(elementId, reactiveData);
        this.elementInfluences.set(elementId, new Map());
        
        // Add holographic visual classes
        domElement.classList.add('reactive-holographic', 'consciousness-enabled');
        
        // Setup element interaction listeners
        this.setupElementInteractionListeners(domElement, reactiveData);
        
        // Initialize holographic projection for element
        this.initializeElementHolographicProjection(reactiveData);
        
        return reactiveData;
    }
    
    /**
     * Setup interaction listeners for reactive element
     */
    setupElementInteractionListeners(domElement, reactiveData) {
        // Enhanced hover with consciousness awareness
        domElement.addEventListener('mouseenter', (e) => {
            this.registerConsciousInteraction('hover', reactiveData, {
                position: { x: e.clientX, y: e.clientY },
                timestamp: Date.now()
            });
        });
        
        domElement.addEventListener('mouseleave', (e) => {
            this.registerConsciousInteraction('unhover', reactiveData, {
                position: { x: e.clientX, y: e.clientY },
                timestamp: Date.now()
            });
        });
        
        // Enhanced click with consciousness response
        domElement.addEventListener('click', (e) => {
            const intensity = this.calculateConsciousIntensity(e);
            this.registerConsciousInteraction('click', reactiveData, {
                position: { x: e.clientX, y: e.clientY },
                intensity: intensity,
                timestamp: Date.now(),
                modifiers: {
                    shift: e.shiftKey,
                    ctrl: e.ctrlKey,
                    alt: e.altKey
                }
            });
        });
        
        // Focus consciousness tracking
        domElement.addEventListener('focus', (e) => {
            this.consciousness.attention.set(reactiveData.domElement.id, 1.0);
            this.updateConsciousnessAwareness();
        });
        
        domElement.addEventListener('blur', (e) => {
            this.consciousness.attention.delete(reactiveData.domElement.id);
            this.updateConsciousnessAwareness();
        });
    }
    
    /**
     * Register conscious interaction and propagate through network
     */
    registerConsciousInteraction(interactionType, reactiveData, interactionData) {
        const elementId = reactiveData.domElement.id;
        
        // Update element consciousness state
        reactiveData.awareness = Math.min(1.0, reactiveData.awareness + 0.1);
        reactiveData.attention = interactionData.intensity || 0.8;
        reactiveData.lastInteraction = Date.now();
        
        // Add to consciousness memory
        const memoryEntry = {
            type: interactionType,
            elementId: elementId,
            data: interactionData,
            awareness: reactiveData.awareness,
            timestamp: Date.now()
        };
        
        reactiveData.memory.push(memoryEntry);
        this.consciousness.memory.push(memoryEntry);
        
        // Trim memory to prevent overflow
        if (reactiveData.memory.length > 50) reactiveData.memory.shift();
        if (this.consciousness.memory.length > 1000) this.consciousness.memory.shift();
        
        // Propagate consciousness through network
        this.propagateConsciousnessWave(elementId, interactionType, interactionData);
        
        // Update holographic interference patterns
        this.updateHolographicInterference(reactiveData, interactionData);
        
        // Trigger emergent behaviors
        this.triggerEmergentBehaviors(interactionType, reactiveData, interactionData);
        
        // Update global consciousness
        this.updateGlobalConsciousness();
        
        console.log(`🌈 Conscious interaction: ${interactionType} on ${elementId} (awareness: ${reactiveData.awareness.toFixed(2)})`);
    }
    
    /**
     * Propagate consciousness wave through reactive network
     */
    propagateConsciousnessWave(sourceElementId, interactionType, interactionData) {
        const sourceElement = this.reactiveElements.get(sourceElementId);
        if (!sourceElement) return;
        
        const waveIntensity = sourceElement.awareness * (interactionData.intensity || 0.5);
        const propagationRange = 3.0; // Influence range
        
        // Calculate influence on all other elements
        this.reactiveElements.forEach((targetElement, targetId) => {
            if (targetId === sourceElementId) return;
            
            // Calculate distance and influence
            const distance = this.calculateElementDistance(sourceElement, targetElement);
            const influence = this.calculateConsciousnessInfluence(distance, waveIntensity, propagationRange);
            
            if (influence > 0.01) { // Minimum threshold for influence
                // Apply consciousness influence
                this.applyConsciousnessInfluence(targetElement, influence, interactionType);
                
                // Update influence mapping
                let influences = this.elementInfluences.get(targetId);
                if (!influences) {
                    influences = new Map();
                    this.elementInfluences.set(targetId, influences);
                }
                influences.set(sourceElementId, {
                    influence: influence,
                    timestamp: Date.now(),
                    interactionType: interactionType
                });
                
                // Visual feedback for consciousness propagation
                this.visualizeConsciousnessPropagation(sourceElement, targetElement, influence);
            }
        });
    }
    
    /**
     * Apply consciousness influence to target element
     */
    applyConsciousnessInfluence(targetElement, influence, interactionType) {
        // Increase awareness based on influence
        targetElement.awareness = Math.min(1.0, targetElement.awareness + influence * 0.3);
        
        // Update attention
        targetElement.attention = Math.max(targetElement.attention, influence * 0.6);
        
        // Apply visual effects based on influence
        const domElement = targetElement.domElement;
        
        switch (interactionType) {
            case 'hover':
                // Consciousness dimming effect
                const dimFactor = 1.0 - influence * 0.4;
                domElement.style.opacity = dimFactor.toString();
                domElement.style.filter = `brightness(${dimFactor})`;
                break;
                
            case 'click':
                // Consciousness ripple effect
                this.triggerConsciousnessRipple(domElement, influence);
                break;
                
            case 'focus':
                // Consciousness highlighting
                const highlightIntensity = influence * 0.5;
                domElement.style.boxShadow = `0 0 ${highlightIntensity * 20}px rgba(255, 0, 255, ${highlightIntensity})`;
                break;
        }
        
        // Update holographic projection
        targetElement.holographicProjection.amplitude += influence * 0.2;
        targetElement.holographicProjection.phase += influence * 0.1;
        
        // Schedule restoration
        setTimeout(() => {
            this.restoreElementState(targetElement);
        }, 1000 + influence * 2000); // Longer restoration for stronger influence
    }
    
    /**
     * Trigger consciousness ripple effect
     */
    triggerConsciousnessRipple(domElement, intensity) {
        // Create ripple animation
        const ripple = document.createElement('div');
        ripple.className = 'consciousness-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,0,255,${intensity}) 0%, transparent 70%);
            width: 10px;
            height: 10px;
            pointer-events: none;
            animation: consciousnessRipple ${1000 + intensity * 1000}ms ease-out;
            z-index: 1000;
        `;
        
        // Position ripple at element center
        const rect = domElement.getBoundingClientRect();
        ripple.style.left = (rect.left + rect.width / 2 - 5) + 'px';
        ripple.style.top = (rect.top + rect.height / 2 - 5) + 'px';
        
        // Add ripple animation CSS if not exists
        if (!document.getElementById('consciousnessRippleCSS')) {
            const style = document.createElement('style');
            style.id = 'consciousnessRippleCSS';
            style.textContent = `
                @keyframes consciousnessRipple {
                    0% {
                        width: 10px;
                        height: 10px;
                        opacity: 1;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        margin-left: -100px;
                        margin-top: -100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 3000);
    }
    
    /**
     * Restore element to base state
     */
    restoreElementState(element) {
        const domElement = element.domElement;
        
        // Gradually restore visual properties
        domElement.style.transition = 'all 300ms ease-out';
        domElement.style.opacity = '';
        domElement.style.filter = '';
        domElement.style.boxShadow = '';
        
        // Restore holographic projection
        element.holographicProjection.amplitude *= 0.9;
        element.attention *= 0.8;
    }
    
    /**
     * Initialize holographic projection system
     */
    initializeHolographicProjection() {
        // Create holographic CSS effects
        const holographicCSS = document.createElement('style');
        holographicCSS.id = 'holographicInterfaceCSS';
        holographicCSS.textContent = `
            .reactive-holographic {
                position: relative;
                transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity, filter;
            }
            
            .consciousness-enabled {
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .consciousness-enabled::before {
                content: '';
                position: absolute;
                top: -1px;
                left: -1px;
                right: -1px;
                bottom: -1px;
                background: linear-gradient(45deg, 
                    transparent 30%, 
                    rgba(255, 0, 255, 0.1) 50%, 
                    transparent 70%);
                border-radius: inherit;
                opacity: 0;
                transition: opacity 300ms ease;
                pointer-events: none;
                z-index: -1;
            }
            
            .consciousness-enabled:hover::before {
                opacity: 1;
                animation: holographicShimmer 2s infinite;
            }
            
            @keyframes holographicShimmer {
                0% { background-position: -200px 0; }
                100% { background-position: 200px 0; }
            }
            
            .emergent-pattern {
                position: relative;
                overflow: hidden;
            }
            
            .emergent-pattern::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
                animation: emergentPulse 3s infinite ease-in-out;
                pointer-events: none;
            }
            
            @keyframes emergentPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.02); }
            }
        `;
        
        document.head.appendChild(holographicCSS);
        console.log('🌈 Holographic projection CSS initialized');
    }
    
    /**
     * Initialize element holographic projection
     */
    initializeElementHolographicProjection(reactiveData) {
        const domElement = reactiveData.domElement;
        
        // Apply base holographic properties
        domElement.style.setProperty('--holographic-phase', reactiveData.holographicProjection.phase.toString());
        domElement.style.setProperty('--holographic-amplitude', reactiveData.holographicProjection.amplitude.toString());
        domElement.style.setProperty('--holographic-frequency', reactiveData.holographicProjection.frequency.toString());
        
        // Setup interference pattern tracking
        reactiveData.holographicProjection.interference = [];
    }
    
    /**
     * Start constant flux engine
     */
    startConstantFlux() {
        const fluxLoop = () => {
            this.updateTemporalFlux();
            this.updateSpatialFlux();
            this.updateParametricFlux();
            this.updateHolographicProjections();
            
            requestAnimationFrame(fluxLoop);
        };
        
        fluxLoop();
        console.log('🌊 Constant flux engine started - No static components');
    }
    
    /**
     * Update temporal flux
     */
    updateTemporalFlux() {
        const time = Date.now() * 0.001;
        
        this.fluxFields.temporal.phase = time * this.fluxFields.temporal.rate;
        
        // Apply temporal flux to all reactive elements
        this.reactiveElements.forEach((element, id) => {
            element.flux.temporal.phase += this.fluxFields.temporal.rate;
            
            // Temporal breathing effect
            const breathingIntensity = Math.sin(element.flux.temporal.phase) * 0.02 + 1.0;
            element.domElement.style.transform = `scale(${breathingIntensity})`;
            
            // Temporal color shifting
            const hueShift = (element.flux.temporal.phase * 30) % 360;
            element.domElement.style.filter = `hue-rotate(${hueShift}deg)`;
        });
    }
    
    /**
     * Update spatial flux
     */
    updateSpatialFlux() {
        const spatialIntensity = this.consciousness.awareness * 0.1;
        
        this.reactiveElements.forEach((element, id) => {
            // Subtle spatial warping based on consciousness
            const warpX = Math.sin(Date.now() * 0.001 + element.holographicProjection.phase) * spatialIntensity;
            const warpY = Math.cos(Date.now() * 0.0007 + element.holographicProjection.phase) * spatialIntensity;
            
            element.flux.spatial.x = warpX;
            element.flux.spatial.y = warpY;
            
            // Apply warping if element has significant consciousness
            if (element.awareness > 0.5) {
                const currentTransform = element.domElement.style.transform || '';
                element.domElement.style.transform = currentTransform + ` translate(${warpX}px, ${warpY}px)`;
            }
        });
    }
    
    /**
     * Update parametric flux
     */
    updateParametricFlux() {
        // Parametric drift based on global consciousness
        this.fluxFields.parametric.drift = this.consciousness.emergence * 0.1;
        
        // Update parameter web if available
        if (this.vib3HomeMaster) {
            const driftIntensity = this.fluxFields.parametric.drift;
            
            // Apply subtle parameter drifting
            this.vib3HomeMaster.globalParameters.morphFactor += Math.sin(Date.now() * 0.0005) * driftIntensity * 0.01;
            this.vib3HomeMaster.globalParameters.rotationSpeed += Math.cos(Date.now() * 0.0003) * driftIntensity * 0.01;
        }
    }
    
    /**
     * Update holographic projections
     */
    updateHolographicProjections() {
        const time = Date.now() * 0.001;
        
        this.reactiveElements.forEach((element, id) => {
            const projection = element.holographicProjection;
            
            // Update projection parameters
            projection.phase += 0.01;
            projection.amplitude *= 0.995; // Gradual decay
            projection.amplitude = Math.max(0.5, projection.amplitude); // Minimum amplitude
            
            // Update interference patterns
            projection.interference = projection.interference.filter(interference => {
                interference.intensity *= 0.99; // Decay
                return interference.intensity > 0.01;
            });
            
            // Apply holographic effects to DOM
            this.applyHolographicEffects(element, time);
        });
    }
    
    /**
     * Apply holographic effects to element
     */
    applyHolographicEffects(element, time) {
        const domElement = element.domElement;
        const projection = element.holographicProjection;
        
        // Holographic shimmer based on projection phase
        const shimmerIntensity = Math.sin(projection.phase) * projection.amplitude * 0.1;
        const shimmerColor = `rgba(255, 0, 255, ${Math.abs(shimmerIntensity)})`;
        
        // Apply shimmer effect
        domElement.style.boxShadow = `0 0 ${projection.amplitude * 10}px ${shimmerColor}`;
        
        // Interference pattern visualization
        if (projection.interference.length > 0) {
            const totalInterference = projection.interference.reduce((sum, i) => sum + i.intensity, 0);
            const interferenceColor = `rgba(0, 255, 255, ${totalInterference * 0.3})`;
            domElement.style.borderColor = interferenceColor;
        }
    }
    
    /**
     * Enable emergent behavior patterns
     */
    enableEmergentPatterns() {
        // Flocking behavior
        if (this.emergentPatterns.flocking.enabled) {
            this.initializeFlockingBehavior();
        }
        
        // Crystallization behavior
        if (this.emergentPatterns.crystallization.enabled) {
            this.initializeCrystallizationBehavior();
        }
        
        // Resonance behavior
        if (this.emergentPatterns.resonance.enabled) {
            this.initializeResonanceBehavior();
        }
        
        // Synchronization behavior
        if (this.emergentPatterns.synchronization.enabled) {
            this.initializeSynchronizationBehavior();
        }
        
        console.log('🌟 Emergent behavior patterns enabled');
    }
    
    /**
     * Initialize flocking behavior
     */
    initializeFlockingBehavior() {
        setInterval(() => {
            this.updateFlockingBehavior();
        }, 100); // 10fps for flocking
    }
    
    /**
     * Update flocking behavior
     */
    updateFlockingBehavior() {
        const flockingStrength = this.emergentPatterns.flocking.strength;
        const flockingRange = this.emergentPatterns.flocking.range;
        
        this.reactiveElements.forEach((element, id) => {
            if (element.awareness < 0.3) return; // Only conscious elements flock
            
            let avgPosition = { x: 0, y: 0 };
            let neighbors = 0;
            
            // Find neighbors within flocking range
            this.reactiveElements.forEach((other, otherId) => {
                if (otherId === id) return;
                
                const distance = this.calculateElementDistance(element, other);
                if (distance < flockingRange) {
                    const otherRect = other.domElement.getBoundingClientRect();
                    avgPosition.x += otherRect.left + otherRect.width / 2;
                    avgPosition.y += otherRect.top + otherRect.height / 2;
                    neighbors++;
                }
            });
            
            if (neighbors > 0) {
                avgPosition.x /= neighbors;
                avgPosition.y /= neighbors;
                
                // Apply gentle flocking movement
                const rect = element.domElement.getBoundingClientRect();
                const currentX = rect.left + rect.width / 2;
                const currentY = rect.top + rect.height / 2;
                
                const dx = (avgPosition.x - currentX) * flockingStrength * 0.01;
                const dy = (avgPosition.y - currentY) * flockingStrength * 0.01;
                
                element.flux.spatial.x += dx;
                element.flux.spatial.y += dy;
            }
        });
    }
    
    /**
     * Start consciousness evolution
     */
    startConsciousnessEvolution() {
        setInterval(() => {
            this.evolveConsciousness();
            this.updatePerformanceMetrics();
        }, 1000); // Update every second
        
        console.log('🧠 Consciousness evolution started');
    }
    
    /**
     * Evolve consciousness over time
     */
    evolveConsciousness() {
        // Calculate emergence from interaction complexity
        const recentInteractions = this.consciousness.memory.filter(
            memory => Date.now() - memory.timestamp < 10000 // Last 10 seconds
        );
        
        const interactionComplexity = recentInteractions.length / 100; // Normalize
        this.consciousness.emergence = Math.min(1.0, interactionComplexity);
        
        // Update global awareness based on element consciousness
        let totalAwareness = 0;
        let elementCount = 0;
        
        this.reactiveElements.forEach(element => {
            totalAwareness += element.awareness;
            elementCount++;
        });
        
        if (elementCount > 0) {
            this.consciousness.awareness = totalAwareness / elementCount;
        }
        
        // Consciousness decay over time (requires interaction to maintain)
        this.reactiveElements.forEach(element => {
            const timeSinceInteraction = Date.now() - element.lastInteraction;
            if (timeSinceInteraction > 5000) { // 5 seconds
                element.awareness *= 0.995; // Slow decay
                element.attention *= 0.99; // Faster attention decay
            }
        });
        
        // Update coherence based on synchronization
        this.updateConsciousnessCoherence();
    }
    
    /**
     * Calculate element distance
     */
    calculateElementDistance(element1, element2) {
        const rect1 = element1.domElement.getBoundingClientRect();
        const rect2 = element2.domElement.getBoundingClientRect();
        
        const center1 = {
            x: rect1.left + rect1.width / 2,
            y: rect1.top + rect1.height / 2
        };
        
        const center2 = {
            x: rect2.left + rect2.width / 2,
            y: rect2.top + rect2.height / 2
        };
        
        return Math.sqrt(
            Math.pow(center1.x - center2.x, 2) + 
            Math.pow(center1.y - center2.y, 2)
        );
    }
    
    /**
     * Calculate consciousness influence
     */
    calculateConsciousnessInfluence(distance, intensity, range) {
        if (distance > range) return 0;
        
        // Inverse square law with consciousness modifier
        const falloff = 1.0 / (1.0 + distance * distance);
        return intensity * falloff * this.consciousness.awareness;
    }
    
    /**
     * Calculate conscious intensity from interaction
     */
    calculateConsciousIntensity(event) {
        let intensity = 0.5;
        
        // Modifier keys increase consciousness intensity
        if (event.shiftKey) intensity += 0.3;
        if (event.ctrlKey) intensity += 0.2;
        if (event.altKey) intensity += 0.1;
        
        // Global consciousness level affects intensity
        intensity *= this.consciousness.awareness;
        
        return Math.min(1.0, intensity);
    }
    
    /**
     * Get consciousness statistics
     */
    getConsciousnessStatistics() {
        return {
            consciousness: {
                awareness: this.consciousness.awareness.toFixed(3),
                emergence: this.consciousness.emergence.toFixed(3),
                coherence: this.consciousness.coherence.toFixed(3),
                memorySize: this.consciousness.memory.length,
                attentionElements: this.consciousness.attention.size
            },
            elements: {
                total: this.reactiveElements.size,
                conscious: Array.from(this.reactiveElements.values()).filter(e => e.awareness > 0.5).length,
                highly_conscious: Array.from(this.reactiveElements.values()).filter(e => e.awareness > 0.8).length
            },
            flux: {
                temporal: this.fluxFields.temporal.rate.toFixed(4),
                spatial: this.fluxFields.spatial.warping.toFixed(4),
                parametric: this.fluxFields.parametric.drift.toFixed(4)
            },
            emergence: {
                patterns: Object.keys(this.emergentPatterns).filter(p => this.emergentPatterns[p].enabled),
                complexity: this.consciousness.emergence.toFixed(3)
            }
        };
    }
}

// Export for global access
window.ReactiveHolographicInterface = ReactiveHolographicInterface;

console.log('🌈 ReactiveHolographicInterface loaded - Visual consciousness ready');