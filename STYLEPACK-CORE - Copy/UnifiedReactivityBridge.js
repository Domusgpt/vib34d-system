/**
 * UnifiedReactivityBridge.js - JS-CSS-GLSL Synchronization Layer
 * 
 * Ensures all layers (JavaScript, CSS, WebGL) stay perfectly synchronized
 * with the parameter web managed by VIB3HomeMaster. This is the bridge
 * that enables ecosystem-wide reactivity.
 */

class UnifiedReactivityBridge {
    constructor() {
        this.version = '3.0.0';
        this.isInitialized = false;
        
        // Layer synchronization state
        this.syncState = {
            css: { lastSync: 0, pendingUpdates: new Map() },
            webgl: { lastSync: 0, pendingUpdates: new Map() },
            dom: { lastSync: 0, pendingUpdates: new Map() },
            audio: { lastSync: 0, pendingUpdates: new Map() }
        };
        
        // CSS custom property management
        this.cssProperties = new Map();
        this.cssStyleSheet = null;
        
        // WebGL uniform management
        this.webglContexts = new Map();
        this.shaderPrograms = new Map();
        
        // DOM element tracking
        this.domElements = new Map();
        this.mutationObserver = null;
        
        // Synchronization performance metrics
        this.metrics = {
            syncOperationsPerSecond: 0,
            averageSyncTime: 0,
            lastSyncTimestamp: 0,
            syncErrors: 0
        };
        
        // Animation frame management
        this.animationFrame = null;
        this.syncQueue = [];
        this.isSyncing = false;
        
        console.log('🌉 UnifiedReactivityBridge initialized - Multi-layer sync ready');
    }
    
    /**
     * Initialize the bridge with VIB3HomeMaster
     */
    async initialize(homeMaster) {
        this.homeMaster = homeMaster;
        
        // Initialize CSS layer
        await this.initializeCSSLayer();
        
        // Initialize WebGL layer
        await this.initializeWebGLLayer();
        
        // Initialize DOM layer
        await this.initializeDOMLayer();
        
        // Start synchronization engine
        this.startSynchronizationEngine();
        
        // Subscribe to HomeMaster parameter changes
        this.subscribeToParameterChanges();
        
        this.isInitialized = true;
        console.log('✅ UnifiedReactivityBridge fully initialized - All layers synchronized');
        
        return this;
    }
    
    /**
     * Initialize CSS layer with custom properties
     */
    async initializeCSSLayer() {
        // Create dynamic stylesheet for CSS custom properties
        this.cssStyleSheet = document.createElement('style');
        this.cssStyleSheet.textContent = `
            :root {
                /* VIB3 Parameter CSS Custom Properties - Updated by bridge */
                --vib3-dimension: 3.5;
                --vib3-morph-factor: 0.5;
                --vib3-grid-density: 12.0;
                --vib3-rotation-speed: 0.6;
                --vib3-interaction-intensity: 0.0;
                --vib3-hover-state: 0;
                --vib3-focus-element: '';
                --vib3-section-transition: 0;
                
                /* Color parameters */
                --vib3-base-color-r: 1.0;
                --vib3-base-color-g: 0.0;
                --vib3-base-color-b: 1.0;
                
                /* Interaction parameters */
                --vib3-card-opacity: 1.0;
                --vib3-background-brightness: 1.0;
                --vib3-element-scale: 1.0;
                
                /* Animation parameters */
                --vib3-transition-duration: 800ms;
                --vib3-ease-function: cubic-bezier(0.4, 0, 0.2, 1);
                
                /* System parameters */
                --vib3-system-load: 0.0;
                --vib3-frame-rate: 60;
            }
            
            /* Reactive CSS classes that respond to parameter changes */
            .vib3-reactive-element {
                opacity: var(--vib3-card-opacity);
                transform: scale(var(--vib3-element-scale));
                transition: all var(--vib3-transition-duration) var(--vib3-ease-function);
            }
            
            .vib3-background-reactive {
                filter: brightness(var(--vib3-background-brightness));
                transition: filter var(--vib3-transition-duration) var(--vib3-ease-function);
            }
            
            .vib3-hover-dimmed {
                opacity: calc(var(--vib3-card-opacity) * 0.6);
            }
            
            .vib3-focused {
                transform: scale(calc(var(--vib3-element-scale) * 1.05));
                z-index: 100;
            }
        `;
        
        document.head.appendChild(this.cssStyleSheet);
        
        // Initialize CSS property tracking
        this.initializeCSSPropertyTracking();
        
        console.log('🎨 CSS layer initialized with reactive custom properties');
    }
    
    /**
     * Initialize CSS property tracking for automatic updates
     */
    initializeCSSPropertyTracking() {
        const rootStyle = getComputedStyle(document.documentElement);
        
        // Track all VIB3 CSS custom properties
        const vib3Properties = [
            'vib3-dimension', 'vib3-morph-factor', 'vib3-grid-density',
            'vib3-rotation-speed', 'vib3-interaction-intensity', 'vib3-hover-state',
            'vib3-base-color-r', 'vib3-base-color-g', 'vib3-base-color-b',
            'vib3-card-opacity', 'vib3-background-brightness', 'vib3-element-scale'
        ];
        
        vib3Properties.forEach(prop => {
            const value = rootStyle.getPropertyValue(`--${prop}`);
            this.cssProperties.set(prop, parseFloat(value) || 0);
        });
    }
    
    /**
     * Initialize WebGL layer for shader uniform synchronization
     */
    async initializeWebGLLayer() {
        // Scan for WebGL contexts in the page
        this.scanForWebGLContexts();
        
        // Set up uniform mapping for common shader parameters
        this.setupShaderUniformMapping();
        
        console.log(`🎮 WebGL layer initialized - ${this.webglContexts.size} contexts found`);
    }
    
    /**
     * Scan page for WebGL contexts and register them
     */
    scanForWebGLContexts() {
        const canvases = document.querySelectorAll('canvas');
        
        canvases.forEach((canvas, index) => {
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const contextId = canvas.id || `webgl-context-${index}`;
                this.webglContexts.set(contextId, {
                    canvas: canvas,
                    gl: gl,
                    uniformLocations: new Map(),
                    lastUpdate: 0,
                    isActive: true
                });
                
                console.log(`🔗 Registered WebGL context: ${contextId}`);
            }
        });
    }
    
    /**
     * Setup shader uniform mapping for parameter synchronization
     */
    setupShaderUniformMapping() {
        // Standard VIB3 shader uniform names
        this.uniformMapping = {
            'dimension': 'u_dimension',
            'morphFactor': 'u_morphFactor',
            'gridDensity': 'u_gridDensity',
            'rotationSpeed': 'u_rotationSpeed',
            'interactionIntensity': 'u_interactionIntensity',
            'time': 'u_time',
            'baseColor': 'u_baseColor',
            'resolution': 'u_resolution',
            'mouse': 'u_mouse'
        };
    }
    
    /**
     * Initialize DOM layer for element tracking
     */
    async initializeDOMLayer() {
        // Set up mutation observer for dynamic element tracking
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // New elements added - check if they need reactive registration
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.registerReactiveElement(node);
                        }
                    });
                }
            });
        });
        
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Register existing reactive elements
        this.scanForReactiveElements();
        
        console.log(`🏠 DOM layer initialized - ${this.domElements.size} reactive elements registered`);
    }
    
    /**
     * Scan for existing reactive elements
     */
    scanForReactiveElements() {
        const reactiveElements = document.querySelectorAll('.vib3-reactive-element, [data-vib3-reactive]');
        
        reactiveElements.forEach(element => {
            this.registerReactiveElement(element);
        });
    }
    
    /**
     * Register element for reactive updates
     */
    registerReactiveElement(element) {
        const elementId = element.id || `reactive-${this.domElements.size}`;
        
        if (!element.id) {
            element.id = elementId;
        }
        
        const reactiveData = {
            element: element,
            type: element.dataset.vib3Type || 'generic',
            properties: this.parseElementProperties(element),
            lastUpdate: 0,
            animations: new Map()
        };
        
        this.domElements.set(elementId, reactiveData);
        
        // Add reactive classes if not present
        if (!element.classList.contains('vib3-reactive-element')) {
            element.classList.add('vib3-reactive-element');
        }
        
        console.log(`🔗 Registered reactive element: ${elementId} (${reactiveData.type})`);
    }
    
    /**
     * Parse element properties for reactive behavior
     */
    parseElementProperties(element) {
        const properties = {};
        
        // Parse data attributes for reactive properties
        Object.keys(element.dataset).forEach(key => {
            if (key.startsWith('vib3')) {
                const propName = key.replace('vib3', '').toLowerCase();
                properties[propName] = element.dataset[key];
            }
        });
        
        return properties;
    }
    
    /**
     * Apply synchronized updates across all layers - CORE SYNCHRONIZATION
     */
    async applySynchronizedUpdates(updates) {
        const startTime = performance.now();
        
        try {
            // Apply updates to all layers simultaneously
            await Promise.all([
                this.applyCSSUpdates(updates.css),
                this.applyWebGLUpdates(updates.webgl),
                this.applyDOMUpdates(updates.dom)
            ]);
            
            // Update sync state
            const syncTime = performance.now() - startTime;
            this.updateSyncMetrics(syncTime);
            
            console.log(`🔄 Synchronized update complete (${syncTime.toFixed(2)}ms)`);
            
        } catch (error) {
            this.metrics.syncErrors++;
            console.error('❌ Synchronization error:', error);
        }
    }
    
    /**
     * Apply CSS updates via custom properties
     */
    async applyCSSUpdates(cssUpdates) {
        const root = document.documentElement;
        
        cssUpdates.forEach((value, property) => {
            const cssProperty = `--vib3-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssProperty, value);
            this.cssProperties.set(property, value);
        });
        
        this.syncState.css.lastSync = Date.now();
    }
    
    /**
     * Apply WebGL uniform updates
     */
    async applyWebGLUpdates(webglUpdates) {
        this.webglContexts.forEach((context, contextId) => {
            if (!context.isActive) return;
            
            const { gl } = context;
            
            webglUpdates.forEach((value, parameter) => {
                const uniformName = this.uniformMapping[parameter];
                if (!uniformName) return;
                
                // Get or cache uniform location
                let location = context.uniformLocations.get(uniformName);
                if (location === undefined) {
                    // Try to get current program (this may need adjustment based on your shader setup)
                    const program = gl.getParameter(gl.CURRENT_PROGRAM);
                    if (program) {
                        location = gl.getUniformLocation(program, uniformName);
                        context.uniformLocations.set(uniformName, location);
                    }
                }
                
                if (location) {
                    // Apply uniform based on type
                    this.setWebGLUniform(gl, location, parameter, value);
                }
            });
            
            context.lastUpdate = Date.now();
        });
        
        this.syncState.webgl.lastSync = Date.now();
    }
    
    /**
     * Set WebGL uniform with proper type handling
     */
    setWebGLUniform(gl, location, parameter, value) {
        try {
            switch (parameter) {
                case 'baseColor':
                    if (Array.isArray(value) && value.length === 3) {
                        gl.uniform3fv(location, value);
                    }
                    break;
                    
                case 'resolution':
                    if (Array.isArray(value) && value.length === 2) {
                        gl.uniform2fv(location, value);
                    }
                    break;
                    
                case 'mouse':
                    if (Array.isArray(value) && value.length === 2) {
                        gl.uniform2fv(location, value);
                    }
                    break;
                    
                default:
                    // Single float value
                    if (typeof value === 'number') {
                        gl.uniform1f(location, value);
                    }
                    break;
            }
        } catch (error) {
            console.warn(`WebGL uniform update failed for ${parameter}:`, error);
        }
    }
    
    /**
     * Apply DOM element updates
     */
    async applyDOMUpdates(domUpdates) {
        domUpdates.forEach((value, elementProperty) => {
            const [elementId, property] = elementProperty.split('.');
            const elementData = this.domElements.get(elementId);
            
            if (elementData) {
                this.updateElementProperty(elementData.element, property, value);
            }
        });
        
        this.syncState.dom.lastSync = Date.now();
    }
    
    /**
     * Update individual element property
     */
    updateElementProperty(element, property, value) {
        switch (property) {
            case 'opacity':
                element.style.opacity = value;
                break;
                
            case 'scale':
                element.style.transform = `scale(${value})`;
                break;
                
            case 'brightness':
                element.style.filter = `brightness(${value})`;
                break;
                
            case 'class':
                // Add/remove classes based on value
                if (value.startsWith('+')) {
                    element.classList.add(value.substring(1));
                } else if (value.startsWith('-')) {
                    element.classList.remove(value.substring(1));
                }
                break;
                
            default:
                // Generic property update
                if (property.startsWith('data-')) {
                    element.setAttribute(property, value);
                } else {
                    element.style[property] = value;
                }
                break;
        }
    }
    
    /**
     * Trigger reaction across all layers - ECOSYSTEM-WIDE REACTIVITY
     */
    async triggerReaction(reactionType, parameters = {}) {
        console.log(`🌊 Triggering ecosystem reaction: ${reactionType}`);
        
        const reaction = {
            type: reactionType,
            parameters: parameters,
            timestamp: Date.now()
        };
        
        // Queue reaction for next sync cycle
        this.syncQueue.push(reaction);
        
        if (!this.isSyncing) {
            this.processSyncQueue();
        }
    }
    
    /**
     * Process queued reactions and sync operations
     */
    async processSyncQueue() {
        if (this.isSyncing || this.syncQueue.length === 0) return;
        
        this.isSyncing = true;
        
        while (this.syncQueue.length > 0) {
            const reaction = this.syncQueue.shift();
            
            // Process reaction based on type
            await this.processReaction(reaction);
        }
        
        this.isSyncing = false;
    }
    
    /**
     * Process individual reaction
     */
    async processReaction(reaction) {
        switch (reaction.type) {
            case 'cardHover':
                await this.processCardHoverReaction(reaction.parameters);
                break;
                
            case 'elementFocus':
                await this.processElementFocusReaction(reaction.parameters);
                break;
                
            case 'sectionTransition':
                await this.processSectionTransitionReaction(reaction.parameters);
                break;
                
            case 'parameterCascade':
                await this.processParameterCascadeReaction(reaction.parameters);
                break;
                
            default:
                await this.processGenericReaction(reaction);
                break;
        }
    }
    
    /**
     * Process card hover reaction - OTHER CARDS DIM/BRIGHTEN
     */
    async processCardHoverReaction(parameters) {
        const { targetCard, isHovering, relatedness = {} } = parameters;
        
        // Update CSS custom properties for card states
        const updates = new Map();
        
        if (isHovering) {
            updates.set('hover-state', 1);
            updates.set('interaction-intensity', 0.8);
            
            // Dim other cards based on relatedness
            this.domElements.forEach((elementData, elementId) => {
                if (elementId !== targetCard && elementData.type === 'card') {
                    const relatednessFactor = relatedness[elementId] || 0.3;
                    const opacity = 0.4 + (relatednessFactor * 0.4); // 0.4 to 0.8 range
                    
                    elementData.element.style.opacity = opacity;
                }
            });
            
        } else {
            updates.set('hover-state', 0);
            updates.set('interaction-intensity', 0);
            
            // Restore all card opacities
            this.domElements.forEach((elementData) => {
                if (elementData.type === 'card') {
                    elementData.element.style.opacity = 1.0;
                }
            });
        }
        
        await this.applyCSSUpdates(updates);
    }
    
    /**
     * Process element focus reaction - BACKGROUND GEOMETRY SHIFTS
     */
    async processElementFocusReaction(parameters) {
        const { focusedElement, elementProperties = {} } = parameters;
        
        // Update background geometry based on focused element
        const backgroundUpdates = new Map();
        
        if (focusedElement) {
            // Map element properties to background parameters
            backgroundUpdates.set('morphFactor', elementProperties.morphFactor || 0.8);
            backgroundUpdates.set('gridDensity', elementProperties.gridDensity || 15.0);
            backgroundUpdates.set('dimension', elementProperties.dimension || 3.7);
            
            // Update WebGL uniforms for background shader
            await this.applyWebGLUpdates(backgroundUpdates);
        }
    }
    
    /**
     * Start synchronization engine
     */
    startSynchronizationEngine() {
        // High-frequency sync (60fps)
        const syncLoop = () => {
            this.processSyncQueue();
            this.animationFrame = requestAnimationFrame(syncLoop);
        };
        
        syncLoop();
        
        // Performance monitoring (1fps)
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 1000);
        
        console.log('🔄 Synchronization engine started');
    }
    
    /**
     * Subscribe to HomeMaster parameter changes
     */
    subscribeToParameterChanges() {
        if (this.homeMaster) {
            this.homeMaster.subscribe('parameterUpdate', (data) => {
                this.handleParameterUpdate(data);
            });
            
            this.homeMaster.subscribe('elementRegistered', (data) => {
                this.handleElementRegistration(data);
            });
        }
    }
    
    /**
     * Handle parameter updates from HomeMaster
     */
    async handleParameterUpdate(data) {
        const { parameter, value, elementId, source } = data;
        
        // Prepare synchronized updates
        const updates = {
            css: new Map(),
            webgl: new Map(),
            dom: new Map()
        };
        
        // Map parameter to appropriate layers
        updates.css.set(parameter, value);
        updates.webgl.set(parameter, value);
        
        if (elementId) {
            updates.dom.set(`${elementId}.${parameter}`, value);
        }
        
        await this.applySynchronizedUpdates(updates);
    }
    
    /**
     * Update synchronization performance metrics
     */
    updateSyncMetrics(syncTime) {
        this.metrics.lastSyncTimestamp = Date.now();
        this.metrics.averageSyncTime = (this.metrics.averageSyncTime + syncTime) / 2;
        this.metrics.syncOperationsPerSecond++;
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        // Reset per-second counters
        this.metrics.syncOperationsPerSecond = 0;
        
        // Update system status
        console.log('🔄 Bridge metrics:', {
            avgSyncTime: this.metrics.averageSyncTime.toFixed(2) + 'ms',
            activeContexts: this.webglContexts.size,
            reactiveElements: this.domElements.size,
            syncErrors: this.metrics.syncErrors
        });
    }
    
    /**
     * Cleanup and destroy bridge
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        this.webglContexts.clear();
        this.domElements.clear();
        this.cssProperties.clear();
        
        console.log('🌉 UnifiedReactivityBridge destroyed');
    }
}

// Export for use in other modules
window.UnifiedReactivityBridge = UnifiedReactivityBridge;

console.log('🌉 UnifiedReactivityBridge loaded - Multi-layer synchronization ready');