/**
 * VIB3HomeMaster.js - Single Source of Truth for All Visual Parameters
 * 
 * This is the central parameter authority that controls the mathematical
 * interconnectedness of the entire VIB3STYLEPACK system. Every visual
 * element is mathematically linked through this system.
 */

class VIB3HomeMaster {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        
        // Central parameter state - SINGLE SOURCE OF TRUTH
        this.globalParameters = {
            // Master dimensional controls
            dimension: 3.5,
            morphFactor: 0.5,
            gridDensity: 12.0,
            rotationSpeed: 0.6,
            
            // Interaction state parameters
            interactionIntensity: 0.0,
            focusedElement: null,
            hoverState: 'idle',
            lastActivity: Date.now(),
            
            // Section and theme state
            currentSection: 0,
            currentTheme: 'hypercube',
            transitionState: 'idle',
            
            // Parameter web influence factors
            cardInterconnectedness: 0.7,
            backgroundResponsiveness: 0.8,
            cascadeMultiplier: 1.0,
            
            // System health metrics
            frameRate: 60,
            activeElements: 0,
            systemLoad: 0.0
        };
        
        // Mathematical relationship definitions - PARAMETER WEB
        this.parameterWeb = {
            // Card hover relationships
            cardHover: {
                source: 'hoverState',
                affects: {
                    'otherCards.opacity': { 
                        relationship: 'inverse', 
                        intensity: 0.6,
                        curve: 'exponential'
                    },
                    'background.morphFactor': { 
                        relationship: 'linear', 
                        intensity: 0.3,
                        delay: 100
                    },
                    'background.gridDensity': { 
                        relationship: 'logarithmic', 
                        intensity: 0.4
                    }
                }
            },
            
            // Element focus relationships
            elementFocus: {
                source: 'focusedElement',
                affects: {
                    'background.geometry': { 
                        relationship: 'categorical',
                        mapping: 'elementToGeometry'
                    },
                    'background.baseColor': { 
                        relationship: 'interpolation',
                        colorSpace: 'hsl'
                    },
                    'relatedElements.brightness': { 
                        relationship: 'distance',
                        falloff: 'quadratic'
                    }
                }
            },
            
            // Parameter cascade relationships
            parameterCascade: {
                source: 'any',
                affects: {
                    'connectedElements': { 
                        relationship: 'network',
                        propagationSpeed: 200,
                        dampening: 0.8
                    }
                }
            },
            
            // Interaction mode relationships
            interactionMode: {
                source: 'interactionIntensity',
                affects: {
                    'globalElements.reactivity': { 
                        relationship: 'linear',
                        threshold: 0.1
                    },
                    'visualElements.complexity': { 
                        relationship: 'stepped',
                        levels: [0.3, 0.6, 0.9]
                    }
                }
            }
        };
        
        // Element registry for parameter web calculations
        this.elementRegistry = new Map();
        this.activeConnections = new Map();
        this.parameterHistory = [];
        
        // Event system for parameter changes
        this.subscribers = new Map();
        this.changeQueue = [];
        this.isProcessingChanges = false;
        
        console.log('🏠 VIB3HomeMaster initialized - Parameter authority active');
    }
    
    /**
     * Initialize the master system with UnifiedReactivityBridge
     */
    async initialize(reactivityBridge, configSystem) {
        this.reactivityBridge = reactivityBridge;
        this.configSystem = configSystem;
        
        // Load initial parameters from JSON config
        if (this.configSystem && this.configSystem.isLoaded) {
            await this.loadParametersFromConfig();
        }
        
        // Start parameter web calculation engine
        this.startParameterWebEngine();
        
        // Initialize performance monitoring
        this.initializePerformanceMonitoring();
        
        this.isInitialized = true;
        console.log('✅ VIB3HomeMaster fully initialized with parameter web active');
        
        return this;
    }
    
    /**
     * Register element in the parameter web
     */
    registerElement(elementId, elementType, properties = {}) {
        const element = {
            id: elementId,
            type: elementType,
            properties: properties,
            connections: new Set(),
            lastUpdate: Date.now(),
            parametricInfluence: properties.influence || 1.0,
            currentState: {},
            targetState: {}
        };
        
        this.elementRegistry.set(elementId, element);
        this.globalParameters.activeElements = this.elementRegistry.size;
        
        // Calculate initial connections based on element type and properties
        this.calculateElementConnections(elementId);
        
        console.log(`🔗 Registered element in parameter web: ${elementId} (${elementType})`);
        return element;
    }
    
    /**
     * Calculate mathematical connections between elements
     */
    calculateElementConnections(elementId) {
        const element = this.elementRegistry.get(elementId);
        if (!element) return;
        
        // Clear existing connections
        element.connections.clear();
        
        // Calculate connections based on mathematical relationships
        this.elementRegistry.forEach((otherElement, otherId) => {
            if (otherId === elementId) return;
            
            const connectionStrength = this.calculateConnectionStrength(element, otherElement);
            
            if (connectionStrength > 0.1) { // Threshold for meaningful connections
                element.connections.add({
                    targetId: otherId,
                    strength: connectionStrength,
                    type: this.determineConnectionType(element, otherElement),
                    lastSync: 0
                });
            }
        });
        
        console.log(`🔗 Element ${elementId} has ${element.connections.size} parameter connections`);
    }
    
    /**
     * Calculate connection strength between two elements
     */
    calculateConnectionStrength(element1, element2) {
        let strength = 0;
        
        // Type-based connections
        if (element1.type === element2.type) {
            strength += 0.4; // Same type elements are naturally connected
        }
        
        // Geometric proximity (if position data available)
        if (element1.properties.position && element2.properties.position) {
            const distance = this.calculateDistance(
                element1.properties.position, 
                element2.properties.position
            );
            strength += Math.max(0, 0.5 - distance * 0.1); // Closer = stronger
        }
        
        // Semantic relatedness
        if (element1.properties.category === element2.properties.category) {
            strength += 0.3;
        }
        
        // Parameter compatibility
        const parameterOverlap = this.calculateParameterOverlap(element1, element2);
        strength += parameterOverlap * 0.2;
        
        // Global interconnectedness factor
        strength *= this.globalParameters.cardInterconnectedness;
        
        return Math.min(1.0, strength);
    }
    
    /**
     * Register interaction with parameter cascade calculation
     */
    registerInteraction(eventType, targetElementId, intensity = 1.0, data = {}) {
        const timestamp = Date.now();
        
        // Update global interaction state
        this.globalParameters.interactionIntensity = intensity;
        this.globalParameters.lastActivity = timestamp;
        
        // Log interaction for parameter web
        const interaction = {
            type: eventType,
            target: targetElementId,
            intensity: intensity,
            timestamp: timestamp,
            data: data
        };
        
        // Process parameter web effects
        this.processParameterWebEffects(interaction);
        
        // Queue parameter updates
        this.queueParameterUpdates(eventType, targetElementId, intensity, data);
        
        console.log(`🌊 Interaction registered: ${eventType} on ${targetElementId} (intensity: ${intensity.toFixed(2)})`);
        
        return interaction;
    }
    
    /**
     * Process parameter web effects - CORE MATHEMATICAL INTERCONNECTEDNESS
     */
    processParameterWebEffects(interaction) {
        const webDefinition = this.parameterWeb[interaction.type] || this.parameterWeb.parameterCascade;
        const targetElement = this.elementRegistry.get(interaction.target);
        
        if (!targetElement) return;
        
        // Calculate affected elements based on parameter web
        const affectedElements = this.calculateAffectedElements(targetElement, webDefinition);
        
        affectedElements.forEach(({ elementId, influence }) => {
            const element = this.elementRegistry.get(elementId);
            if (!element) return;
            
            // Apply mathematical relationship
            Object.entries(webDefinition.affects).forEach(([parameter, relationship]) => {
                const newValue = this.calculateParameterValue(
                    parameter,
                    relationship,
                    interaction.intensity,
                    influence
                );
                
                this.updateElementParameter(elementId, parameter, newValue, interaction.timestamp);
            });
        });
    }
    
    /**
     * Calculate affected elements in parameter web
     */
    calculateAffectedElements(sourceElement, webDefinition) {
        const affected = [];
        
        // Direct connections
        sourceElement.connections.forEach(connection => {
            const influence = connection.strength * this.globalParameters.cascadeMultiplier;
            affected.push({
                elementId: connection.targetId,
                influence: influence,
                connectionType: connection.type
            });
        });
        
        // Global effects (background, other sections)
        if (webDefinition.affects['background']) {
            affected.push({
                elementId: 'background',
                influence: this.globalParameters.backgroundResponsiveness,
                connectionType: 'global'
            });
        }
        
        return affected;
    }
    
    /**
     * Calculate new parameter value based on mathematical relationship
     */
    calculateParameterValue(parameter, relationship, intensity, influence) {
        const baseValue = this.getParameterBaseValue(parameter);
        
        switch (relationship.relationship) {
            case 'linear':
                return baseValue + (intensity * influence * relationship.intensity);
                
            case 'inverse':
                return baseValue * (1.0 - intensity * influence * relationship.intensity);
                
            case 'exponential':
                return baseValue * Math.pow(1.0 + intensity * influence, relationship.intensity);
                
            case 'logarithmic':
                return baseValue + Math.log(1.0 + intensity * influence) * relationship.intensity;
                
            case 'sine':
                return baseValue + Math.sin(intensity * influence * Math.PI) * relationship.intensity;
                
            case 'distance':
                // Distance-based falloff for spatial relationships
                const distance = this.calculateElementDistance(parameter);
                const falloff = relationship.falloff === 'quadratic' ? 
                    1.0 / (1.0 + distance * distance) : 
                    1.0 / (1.0 + distance);
                return baseValue + (intensity * influence * falloff * relationship.intensity);
                
            default:
                return baseValue;
        }
    }
    
    /**
     * Queue parameter updates for batch processing
     */
    queueParameterUpdates(eventType, targetElementId, intensity, data) {
        this.changeQueue.push({
            eventType,
            targetElementId,
            intensity,
            data,
            timestamp: Date.now()
        });
        
        if (!this.isProcessingChanges) {
            this.processChangeQueue();
        }
    }
    
    /**
     * Process queued parameter changes with mathematical synchronization
     */
    async processChangeQueue() {
        if (this.isProcessingChanges || this.changeQueue.length === 0) return;
        
        this.isProcessingChanges = true;
        
        while (this.changeQueue.length > 0) {
            const batch = this.changeQueue.splice(0, 10); // Process in batches of 10
            
            // Calculate synchronized parameter updates
            const updates = this.calculateSynchronizedUpdates(batch);
            
            // Apply updates through UnifiedReactivityBridge
            if (this.reactivityBridge) {
                await this.reactivityBridge.applySynchronizedUpdates(updates);
            }
            
            // Update parameter history for analysis
            this.updateParameterHistory(updates);
        }
        
        this.isProcessingChanges = false;
    }
    
    /**
     * Calculate synchronized updates across all layers (CSS, WebGL, DOM)
     */
    calculateSynchronizedUpdates(changeBatch) {
        const updates = {
            css: new Map(),
            webgl: new Map(),
            dom: new Map(),
            timestamp: Date.now()
        };
        
        changeBatch.forEach(change => {
            const element = this.elementRegistry.get(change.targetElementId);
            if (!element) return;
            
            // Calculate CSS updates
            this.calculateCSSUpdates(element, change, updates.css);
            
            // Calculate WebGL updates
            this.calculateWebGLUpdates(element, change, updates.webgl);
            
            // Calculate DOM updates
            this.calculateDOMUpdates(element, change, updates.dom);
        });
        
        return updates;
    }
    
    /**
     * Get current parameters for specific section/element
     */
    getParametersForSection(sectionId) {
        const baseParameters = { ...this.globalParameters };
        
        // Apply section-specific modifications
        if (this.configSystem) {
            const sectionConfig = this.configSystem.getConfig('content', `sections.${sectionId}`);
            if (sectionConfig && sectionConfig.parameters) {
                Object.assign(baseParameters, sectionConfig.parameters);
            }
        }
        
        // Apply current interaction modifications
        this.applyInteractionModifications(baseParameters);
        
        return baseParameters;
    }
    
    /**
     * Transition to new section with parameter interpolation
     */
    async transitionToSection(newSectionId, duration = 800) {
        console.log(`🌐 Transitioning to section ${newSectionId}`);
        
        const oldSection = this.globalParameters.currentSection;
        const oldParameters = this.getParametersForSection(oldSection);
        const newParameters = this.getParametersForSection(newSectionId);
        
        // Update state
        this.globalParameters.currentSection = newSectionId;
        this.globalParameters.transitionState = 'transitioning';
        
        // Calculate interpolation steps
        const steps = 60; // 60fps assumption
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const easeProgress = this.easeInOutCubic(progress);
            
            // Interpolate all parameters
            const interpolatedParameters = this.interpolateParameters(
                oldParameters, 
                newParameters, 
                easeProgress
            );
            
            // Apply through reactivity bridge
            if (this.reactivityBridge) {
                await this.reactivityBridge.updateParameters(interpolatedParameters);
            }
            
            // Wait for next frame
            if (i < steps) {
                await new Promise(resolve => setTimeout(resolve, stepDuration));
            }
        }
        
        this.globalParameters.transitionState = 'idle';
        
        // Trigger completion events
        this.notifySubscribers('sectionTransitionComplete', {
            oldSection,
            newSection: newSectionId,
            duration
        });
        
        console.log(`✅ Section transition complete: ${oldSection} → ${newSectionId}`);
    }
    
    /**
     * Subscribe to parameter changes
     */
    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        
        this.subscribers.get(eventType).add(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(eventType);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }
    
    /**
     * Notify subscribers of parameter changes
     */
    notifySubscribers(eventType, data) {
        const callbacks = this.subscribers.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in VIB3HomeMaster subscriber for ${eventType}:`, error);
                }
            });
        }
    }
    
    /**
     * Start parameter web calculation engine
     */
    startParameterWebEngine() {
        // High-frequency parameter web updates (60fps)
        setInterval(() => {
            this.updateParameterWeb();
        }, 16.67); // ~60fps
        
        // Performance monitoring (1fps)
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 1000);
        
        console.log('🔄 Parameter web calculation engine started');
    }
    
    /**
     * Update parameter web calculations
     */
    updateParameterWeb() {
        const now = Date.now();
        
        // Decay interaction intensity
        if (now - this.globalParameters.lastActivity > 100) {
            this.globalParameters.interactionIntensity *= 0.95;
        }
        
        // Update element states
        this.elementRegistry.forEach((element, elementId) => {
            this.updateElementState(element, now);
        });
        
        // Process any queued changes
        if (this.changeQueue.length > 0 && !this.isProcessingChanges) {
            this.processChangeQueue();
        }
    }
    
    /**
     * Utility functions for mathematical calculations
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    interpolateParameters(params1, params2, progress) {
        const result = {};
        
        Object.keys(params1).forEach(key => {
            if (typeof params1[key] === 'number' && typeof params2[key] === 'number') {
                result[key] = params1[key] + (params2[key] - params1[key]) * progress;
            } else {
                result[key] = progress < 0.5 ? params1[key] : params2[key];
            }
        });
        
        return result;
    }
    
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        this.performanceMetrics = {
            parameterUpdatesPerSecond: 0,
            elementCount: 0,
            connectionCount: 0,
            lastFrameTime: performance.now()
        };
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        const now = performance.now();
        const deltaTime = now - this.performanceMetrics.lastFrameTime;
        
        this.performanceMetrics.lastFrameTime = now;
        this.performanceMetrics.elementCount = this.elementRegistry.size;
        
        // Calculate total connections
        let totalConnections = 0;
        this.elementRegistry.forEach(element => {
            totalConnections += element.connections.size;
        });
        this.performanceMetrics.connectionCount = totalConnections;
        
        // Update system load
        this.globalParameters.systemLoad = this.calculateSystemLoad();
    }
    
    /**
     * Calculate current system load
     */
    calculateSystemLoad() {
        const elementFactor = Math.min(1.0, this.elementRegistry.size / 100);
        const connectionFactor = Math.min(1.0, this.performanceMetrics.connectionCount / 1000);
        const interactionFactor = this.globalParameters.interactionIntensity;
        
        return (elementFactor + connectionFactor + interactionFactor) / 3;
    }
}

// Export for use in other modules
window.VIB3HomeMaster = VIB3HomeMaster;

console.log('🏠 VIB3HomeMaster loaded - Parameter authority ready');