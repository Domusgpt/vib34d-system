/**
 * InteractionCoordinator.js - User Interaction Management System
 * 
 * Handles all user interactions including keyboard navigation, mouse events,
 * and touch gestures. Coordinates with HomeMaster for state transitions
 * and provides the foundation for Phase 4 relational interaction physics.
 * 
 * Part of Phase 3: State Management & Navigation
 */

class InteractionCoordinator {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Core dependencies
        this.jsonConfigSystem = null;
        this.homeMaster = null;
        
        // Interaction state
        this.isEnabled = true;
        this.keyboardEnabled = true;
        this.mouseEnabled = true;
        this.touchEnabled = true;
        
        // Navigation configuration from state-map.json
        this.keyboardNavigation = {};
        this.mouseNavigation = {};
        this.touchNavigation = {};
        
        // Interaction tracking
        this.activeKeys = new Set();
        this.mousePosition = { x: 0, y: 0 };
        this.lastInteraction = Date.now();
        
        // Parameter modifiers (for mouse wheel, etc.)
        this.parameterModifiers = new Map();
        
        // Phase 4: Relational Interaction Physics
        this.interactionBlueprints = {};
        this.stateModifiers = {};
        this.masterParameterMaps = {};
        this.activeAnimations = new Map();
        this.animationQueue = [];
        this.isProcessingAnimations = false;
        this.elementRegistry = new Map();
        this.interactionState = new Map();
        
        // Event handlers (bound for proper context)
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        // Gesture detection
        this.gestureStartPosition = null;
        this.gestureThreshold = 50; // pixels
        
        // Performance metrics
        this.metrics = {
            keyboardEvents: 0,
            mouseEvents: 0,
            touchEvents: 0,
            navigations: 0,
            parameterChanges: 0
        };
        
        console.log('🎯 InteractionCoordinator initialized');
    }

    /**
     * Initialize InteractionCoordinator with dependencies
     */
    async initialize(jsonConfigSystem, homeMaster) {
        if (this.isInitialized) {
            console.warn('⚠️ InteractionCoordinator already initialized');
            return;
        }

        try {
            console.log('🎯 Initializing InteractionCoordinator...');
            
            this.jsonConfigSystem = jsonConfigSystem;
            this.homeMaster = homeMaster;
            
            // Load navigation configuration
            await this.loadNavigationConfiguration();
            
            // Phase 4: Load interaction blueprints
            await this.loadInteractionBlueprints();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Phase 4: Start animation engine
            this.startAnimationEngine();
            
            this.isInitialized = true;
            
            console.log('✅ InteractionCoordinator initialized');
            console.log(`🎯 Keyboard navigation: ${Object.keys(this.keyboardNavigation).length} bindings`);
            
            return this;
            
        } catch (error) {
            console.error('❌ Failed to initialize InteractionCoordinator:', error);
            throw error;
        }
    }
    
    /**
     * Load navigation configuration from state-map.json
     */
    async loadNavigationConfiguration() {
        const stateMapConfig = this.jsonConfigSystem.getConfig('stateMap');
        if (!stateMapConfig || !stateMapConfig.navigation) {
            console.warn('⚠️ No navigation configuration found');
            return;
        }
        
        const navConfig = stateMapConfig.navigation;
        
        // Load keyboard navigation
        this.keyboardNavigation = navConfig.keyboard || {};
        
        // Load mouse navigation
        this.mouseNavigation = navConfig.mouse || {};
        
        // Load touch gestures
        this.touchNavigation = navConfig.gestures || {};
        
        // Load global settings
        const globalSettings = stateMapConfig.globalSettings || {};
        this.keyboardEnabled = globalSettings.enableKeyboardNavigation !== false;
        this.mouseEnabled = globalSettings.enableMouseNavigation !== false;
        this.touchEnabled = globalSettings.enableTouchGestures !== false;
        
        console.log('🎯 Navigation configuration loaded');
    }
    
    /**
     * Load interaction blueprints from behavior.json (Phase 4.1)
     */
    async loadInteractionBlueprints() {
        console.log('🌊 Loading interaction blueprints...');
        
        const behaviorConfig = this.jsonConfigSystem.getConfig('behavior');
        if (!behaviorConfig) {
            console.warn('⚠️ No behavior configuration found');
            return;
        }
        
        // Load interaction blueprints
        this.interactionBlueprints = behaviorConfig.interactionBlueprints || {};
        this.stateModifiers = behaviorConfig.stateModifiers || {};
        this.masterParameterMaps = behaviorConfig.masterParameterMaps || {};
        
        console.log(`🌊 Loaded ${Object.keys(this.interactionBlueprints).length} interaction blueprints`);
        console.log(`🎯 Loaded ${Object.keys(this.stateModifiers).length} state modifiers`);
        console.log(`🔧 Loaded ${Object.keys(this.masterParameterMaps).length} master parameter maps`);
        
        // Register DOM elements for interaction tracking
        this.registerDOMElements();
    }
    
    /**
     * Register DOM elements for relational targeting (Phase 4.2)
     */
    registerDOMElements() {
        console.log('🎯 Registering DOM elements for relational targeting...');
        
        // Register adaptive cards
        const cards = document.querySelectorAll('.adaptive-card');
        cards.forEach((card, index) => {
            this.elementRegistry.set(card.id || `card-${index}`, {
                element: card,
                type: 'card',
                relationships: {
                    siblings: Array.from(cards).filter(c => c !== card),
                    parent: card.parentElement,
                    children: Array.from(card.children)
                },
                initialState: this.captureElementState(card),
                currentState: {},
                targetState: {}
            });
        });
        
        // Register navigation buttons
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach((button, index) => {
            this.elementRegistry.set(button.id || `nav-button-${index}`, {
                element: button,
                type: 'nav-button',
                relationships: {
                    siblings: Array.from(navButtons).filter(b => b !== button),
                    parent: button.parentElement
                },
                initialState: this.captureElementState(button),
                currentState: {},
                targetState: {}
            });
        });
        
        // Register parameter sliders
        const sliders = document.querySelectorAll('.param-slider');
        sliders.forEach((slider, index) => {
            this.elementRegistry.set(slider.id || `slider-${index}`, {
                element: slider,
                type: 'slider',
                relationships: {
                    siblings: Array.from(sliders).filter(s => s !== slider),
                    parent: slider.parentElement
                },
                initialState: this.captureElementState(slider),
                currentState: {},
                targetState: {}
            });
        });
        
        console.log(`🎯 Registered ${this.elementRegistry.size} elements for interaction`);
    }
    
    /**
     * Capture initial state of an element
     */
    captureElementState(element) {
        const computedStyle = window.getComputedStyle(element);
        const canvas = element.querySelector('.card-visualizer');
        
        return {
            // CSS properties
            transform: computedStyle.transform,
            scale: computedStyle.scale || '1',
            opacity: computedStyle.opacity,
            backgroundColor: computedStyle.backgroundColor,
            borderColor: computedStyle.borderColor,
            
            // WebGL parameters (if canvas exists)
            webglParams: canvas ? this.getWebGLParameters(canvas) : {},
            
            // Custom properties
            customProperties: this.getCustomProperties(element)
        };
    }
    
    /**
     * Get WebGL parameters for a canvas element
     */
    getWebGLParameters(canvas) {
        // This would interface with VisualizerPool to get current shader uniforms
        // For now, return default values
        return {
            u_patternIntensity: 1.0,
            u_morphFactor: 0.5,
            u_glitchIntensity: 0.0,
            u_colorShift: 0.0,
            u_dimension: 3.5,
            u_gridDensity: 8.0,
            u_rotationSpeed: 0.6
        };
    }
    
    /**
     * Get custom CSS properties for an element
     */
    getCustomProperties(element) {
        const style = window.getComputedStyle(element);
        const customProps = {};
        
        // Get all CSS custom properties (variables)
        for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (prop.startsWith('--')) {
                customProps[prop] = style.getPropertyValue(prop);
            }
        }
        
        return customProps;
    }
    
    /**
     * Start the animation engine (Phase 4.3)
     */
    startAnimationEngine() {
        console.log('🎬 Starting animation engine...');
        
        // Start animation processing loop
        this.animationLoop();
        
        // Set up idle detection
        this.setupIdleDetection();
        
        console.log('✅ Animation engine started');
    }
    
    /**
     * Main animation processing loop
     */
    animationLoop() {
        if (this.animationQueue.length > 0 && !this.isProcessingAnimations) {
            this.processAnimationQueue();
        }
        
        // Update active animations
        this.updateActiveAnimations();
        
        // Continue loop
        requestAnimationFrame(() => this.animationLoop());
    }
    
    /**
     * Process queued animations
     */
    async processAnimationQueue() {
        if (this.isProcessingAnimations || this.animationQueue.length === 0) return;
        
        this.isProcessingAnimations = true;
        
        while (this.animationQueue.length > 0) {
            const animationBatch = this.animationQueue.splice(0, 5); // Process in batches
            
            await Promise.all(animationBatch.map(animation => this.executeAnimation(animation)));
        }
        
        this.isProcessingAnimations = false;
    }
    
    /**
     * Execute a single animation
     */
    async executeAnimation(animation) {
        const { target, property, fromValue, toValue, curve, duration, elementId } = animation;
        
        const startTime = performance.now();
        const animationId = `${elementId}-${property}-${startTime}`;
        
        // Store active animation
        this.activeAnimations.set(animationId, {
            ...animation,
            startTime,
            progress: 0,
            completed: false
        });
        
        return new Promise(resolve => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.applyEasingCurve(progress, curve);
                
                // Calculate current value
                const currentValue = this.interpolateValue(fromValue, toValue, easedProgress);
                
                // Apply the animation
                this.applyAnimationValue(target, property, currentValue);
                
                // Update active animation
                const activeAnim = this.activeAnimations.get(animationId);
                if (activeAnim) {
                    activeAnim.progress = progress;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Animation complete
                    this.activeAnimations.delete(animationId);
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    /**
     * Apply easing curves to animation progress
     */
    applyEasingCurve(t, curve) {
        switch (curve) {
            case 'linear':
                return t;
            case 'easeIn':
                return t * t;
            case 'easeOut':
                return 1 - (1 - t) * (1 - t);
            case 'easeInOut':
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'parabolic':
                return t * (2 - t);
            case 'cubic':
                return t * t * (3 - 2 * t);
            default:
                return t;
        }
    }
    
    /**
     * Interpolate between two values
     */
    interpolateValue(from, to, progress) {
        if (typeof from === 'number' && typeof to === 'number') {
            return from + (to - from) * progress;
        }
        
        // Handle special value formats
        if (typeof to === 'string') {
            if (to.startsWith('*=')) {
                const multiplier = parseFloat(to.substring(2));
                return from * (1 + (multiplier - 1) * progress);
            } else if (to.startsWith('+=')) {
                const addition = parseFloat(to.substring(2));
                return from + addition * progress;
            } else if (to === 'initial' || to === 'reset') {
                // Return to initial value (would need to be stored)
                return from;
            }
        }
        
        // For non-numeric values, switch at 50% progress
        return progress < 0.5 ? from : to;
    }
    
    /**
     * Apply animation value to target element/property
     */
    applyAnimationValue(target, property, value) {
        if (!target) return;
        
        // Handle different property types
        if (property.startsWith('u_')) {
            // WebGL uniform parameter
            this.updateWebGLParameter(target, property, value);
        } else if (property.includes('.')) {
            // Nested property (e.g., transform.scale)
            this.updateNestedProperty(target, property, value);
        } else {
            // Direct CSS property
            this.updateCSSProperty(target, property, value);
        }
    }
    
    /**
     * Update WebGL shader parameter
     */
    updateWebGLParameter(target, parameter, value) {
        // Interface with HomeMaster to update global parameters
        if (this.homeMaster) {
            this.homeMaster.updateParameter(parameter, value);
        }
        
        // Also update local element state if it's a card
        const elementData = this.elementRegistry.get(target.id);
        if (elementData) {
            elementData.currentState.webglParams = elementData.currentState.webglParams || {};
            elementData.currentState.webglParams[parameter] = value;
        }
    }
    
    /**
     * Update nested CSS property (e.g., transform.scale)
     */
    updateNestedProperty(target, property, value) {
        const [parent, child] = property.split('.');
        
        if (parent === 'transform') {
            // Handle transform properties
            let currentTransform = target.style.transform || '';
            
            // Parse existing transform
            const transforms = this.parseTransform(currentTransform);
            transforms[child] = value;
            
            // Rebuild transform string
            const transformString = Object.entries(transforms)
                .map(([prop, val]) => `${prop}(${val})`)
                .join(' ');
                
            target.style.transform = transformString;
        }
    }
    
    /**
     * Update direct CSS property
     */
    updateCSSProperty(target, property, value) {
        target.style[property] = value;
    }
    
    /**
     * Parse CSS transform string into components
     */
    parseTransform(transformString) {
        const transforms = {};
        
        if (!transformString || transformString === 'none') {
            return transforms;
        }
        
        // Parse transform functions
        const regex = /(\w+)\(([^)]+)\)/g;
        let match;
        
        while ((match = regex.exec(transformString)) !== null) {
            transforms[match[1]] = match[2];
        }
        
        return transforms;
    }
    
    /**
     * Update active animations
     */
    updateActiveAnimations() {
        // Clean up completed animations and handle conflicts
        const currentTime = performance.now();
        
        this.activeAnimations.forEach((animation, animationId) => {
            if (currentTime - animation.startTime > animation.duration) {
                this.activeAnimations.delete(animationId);
            }
        });
    }
    
    /**
     * Set up idle detection for system idle response
     */
    setupIdleDetection() {
        const idleBlueprint = this.interactionBlueprints.systemIdleResponse;
        if (!idleBlueprint) return;
        
        const idleTimeout = idleBlueprint.timeout || 30000;
        let idleTimer = null;
        
        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            
            idleTimer = setTimeout(() => {
                this.executeInteractionBlueprint('systemIdleResponse', null, {
                    type: 'idle',
                    target: null
                });
            }, idleTimeout);
        };
        
        // Reset timer on any interaction
        document.addEventListener('mousemove', resetIdleTimer);
        document.addEventListener('keydown', resetIdleTimer);
        document.addEventListener('click', resetIdleTimer);
        
        // Start initial timer
        resetIdleTimer();
    }
    
    /**
     * Execute interaction blueprint (Phase 4.4)
     */
    executeInteractionBlueprint(blueprintName, sourceElement, eventData) {
        const blueprint = this.interactionBlueprints[blueprintName];
        if (!blueprint) {
            console.warn(`⚠️ Interaction blueprint '${blueprintName}' not found`);
            return;
        }
        
        console.log(`🌊 Executing interaction blueprint: ${blueprintName}`);
        
        // Apply state modifiers if current state has them
        const currentState = this.homeMaster?.getStateInfo().currentState;
        const stateModifiers = this.stateModifiers[currentState]?.[blueprintName];
        
        // Process each reaction in the blueprint
        blueprint.reactions?.forEach(reaction => {
            this.executeReaction(reaction, sourceElement, eventData, stateModifiers);
        });
        
        // Set up revert animation if specified
        if (blueprint.revertOn && blueprint.revertAnimation) {
            this.setupRevertAnimation(blueprint, sourceElement, eventData);
        }
    }
    
    /**
     * Execute a single reaction with relational targeting (Phase 4.2)
     */
    executeReaction(reaction, sourceElement, eventData, stateModifiers) {
        // Resolve target elements based on relational targeting
        const targetElements = this.resolveRelationalTargets(reaction.target, sourceElement);
        
        if (targetElements.length === 0) {
            console.warn(`⚠️ No target elements found for: ${reaction.target}`);
            return;
        }
        
        // Execute animations for each target element
        targetElements.forEach(targetElement => {
            Object.entries(reaction.animation).forEach(([property, animationConfig]) => {
                this.queueAnimation(targetElement, property, animationConfig, stateModifiers);
            });
        });
    }
    
    /**
     * Resolve relational targets (subject/parent/siblings/ecosystem/global) (Phase 4.2)
     */
    resolveRelationalTargets(targetType, sourceElement) {
        switch (targetType) {
            case 'subject':
                return [sourceElement];
                
            case 'parent':
                return sourceElement?.parentElement ? [sourceElement.parentElement] : [];
                
            case 'siblings':
                if (!sourceElement?.parentElement) return [];
                return Array.from(sourceElement.parentElement.children)
                    .filter(child => child !== sourceElement);
                    
            case 'children':
                return sourceElement ? Array.from(sourceElement.children) : [];
                
            case 'ecosystem':
                // All elements of the same type as source
                const sourceData = this.getElementData(sourceElement);
                if (!sourceData) return [];
                
                return Array.from(this.elementRegistry.values())
                    .filter(data => data.type === sourceData.type && data.element !== sourceElement)
                    .map(data => data.element);
                    
            case 'global':
                // Return global target for WebGL parameters
                return ['global'];
                
            default:
                console.warn(`⚠️ Unknown target type: ${targetType}`);
                return [];
        }
    }
    
    /**
     * Get element data from registry
     */
    getElementData(element) {
        if (!element || !element.id) return null;
        return this.elementRegistry.get(element.id);
    }
    
    /**
     * Queue animation for execution
     */
    queueAnimation(targetElement, property, animationConfig, stateModifiers) {
        // Apply state modifiers if available
        let modifiedConfig = { ...animationConfig };
        
        if (stateModifiers?.parameterMultipliers && property.startsWith('u_')) {
            const multiplier = stateModifiers.parameterMultipliers[property];
            if (multiplier && typeof modifiedConfig.to === 'string' && modifiedConfig.to.startsWith('*=')) {
                const originalMultiplier = parseFloat(modifiedConfig.to.substring(2));
                modifiedConfig.to = `*=${originalMultiplier * multiplier}`;
            }
        }
        
        // Get current value for interpolation
        const currentValue = this.getCurrentPropertyValue(targetElement, property);
        
        // Parse target value
        const targetValue = this.parseTargetValue(modifiedConfig.to, currentValue);
        
        // Create animation object
        const animation = {
            target: targetElement,
            property: property,
            fromValue: currentValue,
            toValue: targetValue,
            curve: modifiedConfig.curve || 'linear',
            duration: modifiedConfig.duration || 300,
            elementId: targetElement === 'global' ? 'global' : (targetElement.id || 'unknown')
        };
        
        // Add to animation queue
        this.animationQueue.push(animation);
    }
    
    /**
     * Get current property value for an element
     */
    getCurrentPropertyValue(targetElement, property) {
        if (targetElement === 'global') {
            // Get global parameter from HomeMaster
            if (property.startsWith('u_') && this.homeMaster) {
                const globalParams = this.homeMaster.getGlobalParameters();
                return globalParams[property] || 0;
            }
            return 0;
        }
        
        if (property.startsWith('u_')) {
            // WebGL parameter - get from element data or default
            const elementData = this.getElementData(targetElement);
            return elementData?.currentState.webglParams?.[property] || 
                   elementData?.initialState.webglParams?.[property] || 0;
        }
        
        if (property.includes('.')) {
            // Nested property (e.g., transform.scale)
            return this.getNestedPropertyValue(targetElement, property);
        }
        
        // Direct CSS property
        const computedStyle = window.getComputedStyle(targetElement);
        return computedStyle[property] || '';
    }
    
    /**
     * Get nested property value (e.g., transform.scale)
     */
    getNestedPropertyValue(element, property) {
        const [parent, child] = property.split('.');
        
        if (parent === 'transform') {
            const transform = element.style.transform || '';
            const transforms = this.parseTransform(transform);
            return transforms[child] || (child === 'scale' ? '1' : '0');
        }
        
        return '';
    }
    
    /**
     * Parse target value (handle *=, +=, initial, etc.)
     */
    parseTargetValue(targetValue, currentValue) {
        if (typeof targetValue === 'number') {
            return targetValue;
        }
        
        if (typeof targetValue === 'string') {
            if (targetValue.startsWith('*=')) {
                const multiplier = parseFloat(targetValue.substring(2));
                return parseFloat(currentValue) * multiplier;
            } else if (targetValue.startsWith('+=')) {
                const addition = parseFloat(targetValue.substring(2));
                return parseFloat(currentValue) + addition;
            } else if (targetValue === 'initial' || targetValue === 'reset') {
                // Would need to get initial value from element registry
                return currentValue; // For now, return current
            } else {
                // Try to parse as number, otherwise return as-is
                const numValue = parseFloat(targetValue);
                return isNaN(numValue) ? targetValue : numValue;
            }
        }
        
        return targetValue;
    }
    
    /**
     * Set up revert animation
     */
    setupRevertAnimation(blueprint, sourceElement, eventData) {
        const revertTrigger = blueprint.revertOn;
        const revertDelay = blueprint.revertDelay || 0;
        
        if (revertTrigger === 'onLeave' || revertTrigger === 'onRelease') {
            // Set up event listener for revert
            const revertEventType = revertTrigger === 'onLeave' ? 'mouseleave' : 'mouseup';
            
            const revertHandler = () => {
                setTimeout(() => {
                    blueprint.revertAnimation.reactions?.forEach(reaction => {
                        this.executeReaction(reaction, sourceElement, eventData);
                    });
                }, revertDelay);
                
                // Remove the event listener
                sourceElement?.removeEventListener(revertEventType, revertHandler);
            };
            
            sourceElement?.addEventListener(revertEventType, revertHandler);
        }
    }
    
    /**
     * Set up event listeners for all interaction types
     */
    setupEventListeners() {
        // Phase 3: Keyboard events
        if (this.keyboardEnabled) {
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('keyup', this.handleKeyUp);
        }
        
        // Phase 4: Set up interaction blueprint event listeners
        this.setupInteractionEventListeners();
        
        // Mouse events
        if (this.mouseEnabled) {
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mousedown', this.handleMouseDown);
            document.addEventListener('mouseup', this.handleMouseUp);
            document.addEventListener('wheel', this.handleWheel, { passive: false });
        }
        
        // Touch events
        if (this.touchEnabled) {
            document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
            document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        }
        
        console.log('🎯 Event listeners registered');
    }
    
    /**
     * Set up interaction blueprint event listeners (Phase 4.4 - CRITICAL)
     */
    setupInteractionEventListeners() {
        console.log('🌊 Setting up interaction blueprint event listeners...');
        
        Object.entries(this.interactionBlueprints).forEach(([blueprintName, blueprint]) => {
            const { trigger, selector } = blueprint;
            
            if (!trigger || !selector) {
                console.warn(`⚠️ Blueprint ${blueprintName} missing trigger or selector`);
                return;
            }
            
            // Find all elements matching the selector
            const elements = document.querySelectorAll(selector);
            
            if (elements.length === 0) {
                console.warn(`⚠️ No elements found for selector: ${selector}`);
                return;
            }
            
            // Map trigger to DOM event
            const eventType = this.mapTriggerToEvent(trigger);
            if (!eventType) {
                console.warn(`⚠️ Unknown trigger type: ${trigger}`);
                return;
            }
            
            // Set up event listeners for each matching element
            elements.forEach(element => {
                const handler = (event) => {
                    // Prevent default for some events
                    if (eventType === 'click' || eventType === 'input') {
                        event.preventDefault();
                    }
                    
                    // Execute the interaction blueprint
                    this.executeInteractionBlueprint(blueprintName, element, {
                        originalEvent: event,
                        eventType: eventType,
                        trigger: trigger
                    });
                };
                
                element.addEventListener(eventType, handler);
                
                // Store handler reference for cleanup
                if (!element._vib34dHandlers) {
                    element._vib34dHandlers = new Map();
                }
                element._vib34dHandlers.set(blueprintName, handler);
            });
            
            console.log(`🌊 Set up ${elements.length} listeners for ${blueprintName} (${selector})`);
        });
        
        console.log('✅ All interaction blueprint event listeners set up');
    }
    
    /**
     * Map interaction trigger to DOM event type
     */
    mapTriggerToEvent(trigger) {
        const triggerMap = {
            'onHover': 'mouseenter',
            'onLeave': 'mouseleave', 
            'onClick': 'click',
            'onRelease': 'mouseup',
            'onInput': 'input',
            'onChange': 'change',
            'onFocus': 'focus',
            'onBlur': 'blur'
        };
        
        return triggerMap[trigger];
    }
    
    /**
     * Handle keyboard key down events
     */
    handleKeyDown(event) {
        if (!this.isEnabled || !this.keyboardEnabled) return;
        
        const key = event.code || event.key;
        this.activeKeys.add(key);
        this.lastInteraction = Date.now();
        this.metrics.keyboardEvents++;
        
        // Check for navigation commands
        const navigationCommand = this.keyboardNavigation[key];
        if (navigationCommand) {
            event.preventDefault();
            this.executeNavigationCommand(navigationCommand);
            return;
        }
        
        // Handle special key combinations
        if (event.ctrlKey || event.metaKey) {
            this.handleKeyboardShortcut(event);
        }
        
        console.log(`🎯 Key down: ${key}`);
    }
    
    /**
     * Handle keyboard key up events
     */
    handleKeyUp(event) {
        if (!this.isEnabled || !this.keyboardEnabled) return;
        
        const key = event.code || event.key;
        this.activeKeys.delete(key);
        this.metrics.keyboardEvents++;
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcut(event) {
        const key = event.code || event.key;
        
        // Add common shortcuts
        switch (key) {
            case 'KeyR':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.resetToInitialState();
                }
                break;
            case 'KeyF':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }
    
    /**
     * Handle mouse move events
     */
    handleMouseMove(event) {
        if (!this.isEnabled || !this.mouseEnabled) return;
        
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
        this.lastInteraction = Date.now();
        this.metrics.mouseEvents++;
        
        // TODO: Phase 4 - Mouse position can influence parameters
    }
    
    /**
     * Handle mouse down events
     */
    handleMouseDown(event) {
        if (!this.isEnabled || !this.mouseEnabled) return;
        
        this.lastInteraction = Date.now();
        this.metrics.mouseEvents++;
        
        // TODO: Phase 4 - Mouse clicks can trigger interactions
    }
    
    /**
     * Handle mouse up events
     */
    handleMouseUp(event) {
        if (!this.isEnabled || !this.mouseEnabled) return;
        
        this.metrics.mouseEvents++;
    }
    
    /**
     * Handle mouse wheel events
     */
    handleWheel(event) {
        if (!this.isEnabled || !this.mouseEnabled) return;
        
        event.preventDefault();
        this.lastInteraction = Date.now();
        this.metrics.mouseEvents++;
        
        // Handle mouse wheel navigation
        const wheelDirection = event.deltaY > 0 ? 'down' : 'up';
        const wheelConfig = this.mouseNavigation.wheel;
        
        if (wheelConfig && wheelConfig[wheelDirection]) {
            this.executeNavigationCommand(wheelConfig[wheelDirection]);
        }
    }
    
    /**
     * Handle touch start events
     */
    handleTouchStart(event) {
        if (!this.isEnabled || !this.touchEnabled) return;
        
        this.lastInteraction = Date.now();
        this.metrics.touchEvents++;
        
        // Store gesture start position
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.gestureStartPosition = {
                x: touch.clientX,
                y: touch.clientY,
                timestamp: Date.now()
            };
        }
    }
    
    /**
     * Handle touch move events
     */
    handleTouchMove(event) {
        if (!this.isEnabled || !this.touchEnabled) return;
        
        this.metrics.touchEvents++;
        
        // Prevent default to avoid scrolling
        event.preventDefault();
    }
    
    /**
     * Handle touch end events
     */
    handleTouchEnd(event) {
        if (!this.isEnabled || !this.touchEnabled) return;
        
        this.metrics.touchEvents++;
        
        // Detect gestures
        if (this.gestureStartPosition && event.changedTouches.length === 1) {
            const touch = event.changedTouches[0];
            const endPosition = {
                x: touch.clientX,
                y: touch.clientY,
                timestamp: Date.now()
            };
            
            this.detectGesture(this.gestureStartPosition, endPosition);
        }
        
        this.gestureStartPosition = null;
    }
    
    /**
     * Detect swipe gestures
     */
    detectGesture(startPos, endPos) {
        const deltaX = endPos.x - startPos.x;
        const deltaY = endPos.y - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = endPos.timestamp - startPos.timestamp;
        
        // Check if it's a valid swipe (minimum distance and speed)
        if (distance < this.gestureThreshold || duration > 500) {
            return;
        }
        
        // Determine swipe direction
        let gesture = null;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            gesture = deltaX > 0 ? 'swipeRight' : 'swipeLeft';
        } else {
            // Vertical swipe
            gesture = deltaY > 0 ? 'swipeDown' : 'swipeUp';
        }
        
        // Execute gesture command
        const gestureCommand = this.touchNavigation[gesture];
        if (gestureCommand) {
            console.log(`🎯 Gesture detected: ${gesture}`);
            this.executeNavigationCommand(gestureCommand);
        }
    }
    
    /**
     * Execute a navigation command
     */
    executeNavigationCommand(command) {
        if (!this.homeMaster) {
            console.warn('⚠️ HomeMaster not available for navigation');
            return;
        }
        
        console.log(`🎯 Executing navigation command: ${command}`);
        
        // Parse command and execute
        if (command.includes('navigateTo(')) {
            // Extract state from navigateTo('state')
            const match = command.match(/navigateTo\(['"]([^'"]+)['"]\)/);
            if (match) {
                const targetState = match[1];
                this.homeMaster.navigateTo(targetState);
                this.metrics.navigations++;
            }
        } else if (command === 'navigateNext()') {
            this.homeMaster.navigateNext();
            this.metrics.navigations++;
        } else if (command === 'navigatePrevious()') {
            this.homeMaster.navigatePrevious();
            this.metrics.navigations++;
        } else if (command === 'cycleState()') {
            this.homeMaster.cycleState();
            this.metrics.navigations++;
        } else if (command.includes('increaseParameter(')) {
            // Extract parameter and amount from increaseParameter('param', amount)
            const match = command.match(/increaseParameter\(['"]([^'"]+)['"], *([0-9.]+)\)/);
            if (match) {
                const paramName = match[1];
                const amount = parseFloat(match[2]);
                this.modifyParameter(paramName, amount);
            }
        } else if (command.includes('decreaseParameter(')) {
            // Extract parameter and amount from decreaseParameter('param', amount)
            const match = command.match(/decreaseParameter\(['"]([^'"]+)['"], *([0-9.]+)\)/);
            if (match) {
                const paramName = match[1];
                const amount = -parseFloat(match[2]);
                this.modifyParameter(paramName, amount);
            }
        }
    }
    
    /**
     * Modify a parameter by a relative amount
     */
    modifyParameter(paramName, amount) {
        if (!this.homeMaster) return;
        
        const currentParams = this.homeMaster.getGlobalParameters();
        const currentValue = currentParams[paramName];
        
        if (typeof currentValue === 'number') {
            const newValue = currentValue + amount;
            
            // Apply parameter constraints if available
            const constrainedValue = this.constrainParameter(paramName, newValue);
            
            this.homeMaster.updateParameter(paramName, constrainedValue);
            this.metrics.parameterChanges++;
            
            console.log(`🎯 Parameter modified: ${paramName} = ${constrainedValue.toFixed(3)} (Δ${amount.toFixed(3)})`);
        }
    }
    
    /**
     * Apply constraints to parameter values
     */
    constrainParameter(paramName, value) {
        // Get parameter constraints from visuals config
        const visualsConfig = this.jsonConfigSystem.getConfig('visuals');
        const parameterDef = visualsConfig?.parameters?.[paramName];
        
        if (parameterDef) {
            const min = parameterDef.min;
            const max = parameterDef.max;
            
            if (typeof min === 'number' && value < min) return min;
            if (typeof max === 'number' && value > max) return max;
        }
        
        return value;
    }
    
    /**
     * Reset to initial state
     */
    resetToInitialState() {
        if (!this.homeMaster) return;
        
        const stateMapConfig = this.jsonConfigSystem.getConfig('stateMap');
        const initialState = stateMapConfig?.initialState || 'home';
        
        console.log('🎯 Resetting to initial state:', initialState);
        this.homeMaster.navigateTo(initialState);
    }
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('⚠️ Could not enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.warn('⚠️ Could not exit fullscreen:', err);
            });
        }
    }
    
    /**
     * Get current interaction state
     */
    getInteractionState() {
        return {
            isEnabled: this.isEnabled,
            keyboardEnabled: this.keyboardEnabled,
            mouseEnabled: this.mouseEnabled,
            touchEnabled: this.touchEnabled,
            activeKeys: Array.from(this.activeKeys),
            mousePosition: { ...this.mousePosition },
            lastInteraction: this.lastInteraction,
            timeSinceLastInteraction: Date.now() - this.lastInteraction
        };
    }
    
    /**
     * Get navigation configuration
     */
    getNavigationConfiguration() {
        return {
            keyboard: { ...this.keyboardNavigation },
            mouse: { ...this.mouseNavigation },
            touch: { ...this.touchNavigation }
        };
    }
    
    /**
     * Get metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            isInitialized: this.isInitialized,
            activeKeysCount: this.activeKeys.size,
            timeSinceLastInteraction: Date.now() - this.lastInteraction
        };
    }
    
    /**
     * Enable/disable interaction handling
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log(`🎯 InteractionCoordinator ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Enable/disable specific interaction types
     */
    setKeyboardEnabled(enabled) {
        this.keyboardEnabled = enabled;
        console.log(`🎯 Keyboard navigation ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    setMouseEnabled(enabled) {
        this.mouseEnabled = enabled;
        console.log(`🎯 Mouse navigation ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    setTouchEnabled(enabled) {
        this.touchEnabled = enabled;
        console.log(`🎯 Touch navigation ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Add custom navigation binding
     */
    addKeyboardBinding(key, command) {
        this.keyboardNavigation[key] = command;
        console.log(`🎯 Added keyboard binding: ${key} → ${command}`);
    }
    
    /**
     * Remove navigation binding
     */
    removeKeyboardBinding(key) {
        delete this.keyboardNavigation[key];
        console.log(`🎯 Removed keyboard binding: ${key}`);
    }
    
    /**
     * Shutdown InteractionCoordinator
     */
    shutdown() {
        console.log('🎯 InteractionCoordinator shutdown initiated...');
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        
        // Clear state
        this.activeKeys.clear();
        this.parameterModifiers.clear();
        this.isInitialized = false;
        
        console.log('✅ InteractionCoordinator shutdown complete');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionCoordinator;
} else {
    window.InteractionCoordinator = InteractionCoordinator;
}

console.log('🎯 InteractionCoordinator loaded - User interaction management ready');