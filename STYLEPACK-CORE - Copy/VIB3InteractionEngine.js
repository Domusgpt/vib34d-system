/**
 * VIB3InteractionEngine.js - User Events to Parameter Mapping
 * 
 * Translates user interactions into parameter changes through the JSON-driven
 * configuration system. Handles keyboard, mouse, touch, and editor events.
 */

class VIB3InteractionEngine {
    constructor(configSystem, homeMaster, reactivityBridge, adaptiveCardSystem) {
        this.version = '3.0.0';
        this.configSystem = configSystem;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        this.adaptiveCardSystem = adaptiveCardSystem;
        
        // Event handling state
        this.activeInteractions = new Map();
        this.eventHistory = [];
        this.interactionContext = {
            hoveredElement: null,
            selectedElements: new Set(),
            dragState: null,
            gestureState: null,
            keyboardState: new Set()
        };
        
        // Interaction configuration
        this.interactionConfig = null;
        this.eventMappings = new Map();
        this.gestureRecognizers = new Map();
        
        // Performance tracking
        this.eventStats = {
            eventsProcessed: 0,
            averageProcessingTime: 0,
            lastEventTime: 0
        };
        
        console.log('🎮 VIB3InteractionEngine initialized');
    }
    
    /**
     * Initialize interaction engine with JSON configuration
     */
    async initialize() {
        // Load interaction configuration from JSON
        this.interactionConfig = this.configSystem.getConfig('dashboard', 'editorDashboard.interactionPresets');
        
        // Setup event mappings from configuration
        this.setupEventMappings();
        
        // Initialize gesture recognizers
        this.initializeGestureRecognizers();
        
        // Setup global event listeners
        this.setupEventListeners();
        
        // Initialize keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Subscribe to configuration changes
        this.configSystem.subscribe('interactionPresetChanged', (data) => {
            this.updateInteractionPreset(data.presetName, data.enabled);
        });
        
        console.log('✅ VIB3InteractionEngine fully initialized');
        return this;
    }
    
    /**
     * Setup event mappings from JSON configuration
     */
    setupEventMappings() {
        // Mouse events
        this.eventMappings.set('mouseenter', {
            type: 'hover',
            processor: this.processHoverEvent.bind(this),
            enabled: this.interactionConfig?.cardHoverEffects?.enabled ?? true
        });
        
        this.eventMappings.set('mouseleave', {
            type: 'unhover',
            processor: this.processUnhoverEvent.bind(this),
            enabled: this.interactionConfig?.cardHoverEffects?.enabled ?? true
        });
        
        this.eventMappings.set('click', {
            type: 'select',
            processor: this.processSelectEvent.bind(this),
            enabled: true
        });
        
        this.eventMappings.set('dblclick', {
            type: 'activate',
            processor: this.processActivateEvent.bind(this),
            enabled: true
        });
        
        // Touch events for mobile
        this.eventMappings.set('touchstart', {
            type: 'touch-begin',
            processor: this.processTouchBeginEvent.bind(this),
            enabled: true
        });
        
        this.eventMappings.set('touchmove', {
            type: 'touch-move',
            processor: this.processTouchMoveEvent.bind(this),
            enabled: true
        });
        
        this.eventMappings.set('touchend', {
            type: 'touch-end',
            processor: this.processTouchEndEvent.bind(this),
            enabled: true
        });
        
        // Drag events
        this.eventMappings.set('dragstart', {
            type: 'drag-begin',
            processor: this.processDragBeginEvent.bind(this),
            enabled: true
        });
        
        this.eventMappings.set('drag', {
            type: 'drag-move',
            processor: this.processDragMoveEvent.bind(this),
            enabled: true
        });
        
        this.eventMappings.set('dragend', {
            type: 'drag-end',
            processor: this.processDragEndEvent.bind(this),
            enabled: true
        });
        
        console.log(`🗺️ Setup ${this.eventMappings.size} event mappings`);
    }
    
    /**
     * Initialize gesture recognizers
     */
    initializeGestureRecognizers() {
        // Pinch-to-zoom gesture
        this.gestureRecognizers.set('pinch', {
            active: false,
            startDistance: 0,
            currentDistance: 0,
            scale: 1.0,
            processor: this.processPinchGesture.bind(this)
        });
        
        // Two-finger rotate gesture
        this.gestureRecognizers.set('rotate', {
            active: false,
            startAngle: 0,
            currentAngle: 0,
            rotation: 0,
            processor: this.processRotateGesture.bind(this)
        });
        
        // Swipe gesture
        this.gestureRecognizers.set('swipe', {
            active: false,
            startPoint: null,
            threshold: 50,
            processor: this.processSwipeGesture.bind(this)
        });
        
        console.log(`👋 Initialized ${this.gestureRecognizers.size} gesture recognizers`);
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mouse events
        document.addEventListener('mouseenter', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('mouseleave', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('click', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('dblclick', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        
        // Touch events
        document.addEventListener('touchstart', this.handleGlobalEvent.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleGlobalEvent.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleGlobalEvent.bind(this), { passive: false });
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this), { capture: true });
        document.addEventListener('keyup', this.handleKeyUp.bind(this), { capture: true });
        
        // Drag events
        document.addEventListener('dragstart', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('drag', this.handleGlobalEvent.bind(this), { capture: true });
        document.addEventListener('dragend', this.handleGlobalEvent.bind(this), { capture: true });
        
        // Window events
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        window.addEventListener('wheel', this.handleWheelEvent.bind(this), { passive: false });
        
        console.log('🎯 Global event listeners setup complete');
    }
    
    /**
     * Setup keyboard shortcuts from JSON configuration
     */
    setupKeyboardShortcuts() {
        const shortcuts = this.configSystem.getConfig('dashboard', 'editorDashboard.editorInterface.keyboardShortcuts');
        
        if (!shortcuts) return;
        
        this.keyboardShortcuts = new Map();
        Object.entries(shortcuts).forEach(([combination, action]) => {
            this.keyboardShortcuts.set(combination, action);
        });
        
        console.log(`⌨️ Setup ${this.keyboardShortcuts.size} keyboard shortcuts`);
    }
    
    /**
     * Handle global events and route to appropriate processors
     */
    handleGlobalEvent(event) {
        const startTime = performance.now();
        
        // Check if event should be processed
        if (!this.shouldProcessEvent(event)) {
            return;
        }
        
        // Get event mapping
        const mapping = this.eventMappings.get(event.type);
        if (!mapping || !mapping.enabled) {
            return;
        }
        
        // Process event
        try {
            mapping.processor(event);
            
            // Update statistics
            this.updateEventStats(startTime);
            
        } catch (error) {
            console.error(`❌ Error processing ${event.type} event:`, error);
        }
    }
    
    /**
     * Process hover event - Card consciousness activation
     */
    processHoverEvent(event) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        // Update interaction context
        this.interactionContext.hoveredElement = target;
        
        // Get hover configuration
        const hoverConfig = this.interactionConfig?.cardHoverEffects;
        if (!hoverConfig?.enabled) return;
        
        // Register interaction with parameter web
        this.homeMaster.registerInteraction('cardHover', target.id, 0.8, {
            elementType: target.type,
            position: target.position,
            timestamp: Date.now()
        });
        
        // Apply DOM effects from configuration
        this.applyDOMEffects(target.element, hoverConfig.targetCardDOM);
        
        // Apply consciousness wave effect
        if (hoverConfig.consciousnessWave?.enabled) {
            this.triggerConsciousnessWave(target, hoverConfig.consciousnessWave);
        }
        
        // Dim other cards
        this.applyOtherCardEffects(target.id, hoverConfig.otherCardsDOM);
        
        console.log(`🎯 Hover activated on ${target.id}`);
    }
    
    /**
     * Process unhover event
     */
    processUnhoverEvent(event) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        // Clear interaction context
        this.interactionContext.hoveredElement = null;
        
        // Register unhover with parameter web
        this.homeMaster.registerInteraction('cardUnhover', target.id, 0.0, {
            elementType: target.type,
            timestamp: Date.now()
        });
        
        // Reset DOM effects
        this.resetDOMEffects(target.element);
        this.resetOtherCardEffects();
        
        console.log(`🎯 Hover deactivated on ${target.id}`);
    }
    
    /**
     * Process select event
     */
    processSelectEvent(event) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        // Handle multi-select
        const isMultiSelect = event.ctrlKey || event.metaKey;
        
        if (!isMultiSelect) {
            this.interactionContext.selectedElements.clear();
        }
        
        this.interactionContext.selectedElements.add(target.id);
        
        // Notify adaptive card system
        if (this.adaptiveCardSystem) {
            this.adaptiveCardSystem.selectCard(target.id, isMultiSelect);
        }
        
        // Register selection interaction
        this.homeMaster.registerInteraction('elementSelect', target.id, 1.0, {
            multiSelect: isMultiSelect,
            selectedCount: this.interactionContext.selectedElements.size
        });
        
        console.log(`✅ Selected ${target.id} (multi: ${isMultiSelect})`);
    }
    
    /**
     * Process activation event (double-click)
     */
    processActivateEvent(event) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        // Check for portal transition activation
        const portalConfig = this.interactionConfig?.portalTransitionEffects;
        if (portalConfig?.enabled) {
            this.triggerPortalTransition(target, portalConfig);
        }
        
        // Register activation interaction
        this.homeMaster.registerInteraction('elementActivate', target.id, 1.5, {
            activationType: 'double-click',
            timestamp: Date.now()
        });
        
        console.log(`🚪 Activated portal transition on ${target.id}`);
    }
    
    /**
     * Handle mouse move for continuous parameter updates
     */
    handleMouseMove(event) {
        const mousePos = { x: event.clientX, y: event.clientY };
        
        // Update consciousness level based on mouse activity
        const intensity = this.calculateMouseIntensity(mousePos);
        
        // Update master controls if consciousness tracking enabled
        const consciousnessConfig = this.configSystem.getMasterControls()?.consciousnessLevel;
        if (consciousnessConfig) {
            const newLevel = Math.min(1.0, intensity * 0.1 + 0.5);
            this.configSystem.updateMasterControl('consciousnessLevel', newLevel, 'mouse-tracking');
        }
        
        // Store last mouse position for gesture detection
        this.lastMousePosition = mousePos;
        this.lastMouseTime = Date.now();
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyDown(event) {
        const combination = this.getKeyboardCombination(event);
        const action = this.keyboardShortcuts?.get(combination);
        
        if (action) {
            event.preventDefault();
            this.executeKeyboardAction(action, event);
        }
        
        // Track keyboard state
        this.interactionContext.keyboardState.add(event.key);
    }
    
    /**
     * Handle key up events
     */
    handleKeyUp(event) {
        this.interactionContext.keyboardState.delete(event.key);
    }
    
    /**
     * Execute keyboard action from configuration
     */
    executeKeyboardAction(action, event) {
        switch (action) {
            case 'activatePortalMode':
                this.activatePortalMode();
                break;
            case 'triggerRealityDistortion':
                this.triggerRealityDistortion();
                break;
            case 'synchronizeQuantumEntanglement':
                this.synchronizeQuantumEntanglement();
                break;
            case 'boostConsciousness':
                this.boostConsciousness();
                break;
            case 'pauseAllAnimations':
                this.pauseAllAnimations();
                break;
            case 'cycleSelectedElements':
                this.cycleSelectedElements();
                break;
            default:
                console.log(`⌨️ Keyboard action: ${action}`);
        }
    }
    
    /**
     * Activate portal mode from keyboard shortcut
     */
    activatePortalMode() {
        const portalConfig = this.interactionConfig?.portalTransitionEffects;
        if (!portalConfig?.enabled) return;
        
        // Enable portal mode for all selected elements
        this.interactionContext.selectedElements.forEach(elementId => {
            this.homeMaster.registerInteraction('portalActivation', elementId, 1.0, {
                activationType: 'keyboard',
                mode: 'portal-ready'
            });
        });
        
        console.log('🚪 Portal mode activated via keyboard');
    }
    
    /**
     * Trigger reality distortion effect
     */
    triggerRealityDistortion() {
        const distortionConfig = this.interactionConfig?.realityDistortionEffects;
        if (!distortionConfig?.enabled) return;
        
        // Apply reality distortion to master stability control
        this.configSystem.updateMasterControl('realityStability', 0.3, 'keyboard-distortion');
        
        // Reset after duration
        setTimeout(() => {
            this.configSystem.updateMasterControl('realityStability', 0.8, 'auto-reset');
        }, 3000);
        
        console.log('🌀 Reality distortion triggered via keyboard');
    }
    
    /**
     * Synchronize quantum entanglement effects
     */
    synchronizeQuantumEntanglement() {
        const entanglementConfig = this.interactionConfig?.quantumEntanglementEffects;
        if (!entanglementConfig?.enabled) return;
        
        // Trigger synchronization across all visualizers
        Object.entries(entanglementConfig.entanglementPairs).forEach(([pair, config]) => {
            this.homeMaster.registerInteraction('quantumSync', pair, config.coherence, {
                correlation: config.correlation,
                syncType: 'manual'
            });
        });
        
        console.log('⚛️ Quantum entanglement synchronized via keyboard');
    }
    
    /**
     * Boost consciousness level temporarily
     */
    boostConsciousness() {
        const currentLevel = this.configSystem.getMasterControls()?.consciousnessLevel?.value || 0.6;
        const boostedLevel = Math.min(1.0, currentLevel + 0.3);
        
        this.configSystem.updateMasterControl('consciousnessLevel', boostedLevel, 'keyboard-boost');
        
        // Gradual decay back to normal
        const decayInterval = setInterval(() => {
            const current = this.configSystem.getMasterControls()?.consciousnessLevel?.value || 0.6;
            const newLevel = Math.max(currentLevel, current - 0.05);
            
            this.configSystem.updateMasterControl('consciousnessLevel', newLevel, 'auto-decay');
            
            if (newLevel <= currentLevel) {
                clearInterval(decayInterval);
            }
        }, 200);
        
        console.log('🧠 Consciousness level boosted via keyboard');
    }
    
    /**
     * Apply DOM effects based on configuration
     */
    applyDOMEffects(element, effectConfig) {
        if (!element || !effectConfig) return;
        
        const { scale, brightness, shadowIntensity, transition } = effectConfig;
        
        element.style.transition = transition || 'all 300ms ease';
        element.style.transform = `scale(${scale || 1.0})`;
        element.style.filter = `brightness(${brightness || 1.0})`;
        
        if (shadowIntensity) {
            element.style.boxShadow = `0 0 ${shadowIntensity * 20}px rgba(255, 0, 255, ${shadowIntensity * 0.5})`;
        }
    }
    
    /**
     * Apply effects to other cards during hover
     */
    applyOtherCardEffects(hoveredCardId, effectConfig) {
        if (!effectConfig) return;
        
        document.querySelectorAll('.adaptive-card-container').forEach(element => {
            if (element.dataset.cardId !== hoveredCardId) {
                this.applyDOMEffects(element, effectConfig);
            }
        });
    }
    
    /**
     * Reset DOM effects
     */
    resetDOMEffects(element) {
        if (!element) return;
        
        element.style.transform = '';
        element.style.filter = '';
        element.style.boxShadow = '';
    }
    
    /**
     * Reset all card effects
     */
    resetOtherCardEffects() {
        document.querySelectorAll('.adaptive-card-container').forEach(element => {
            this.resetDOMEffects(element);
        });
    }
    
    /**
     * Trigger consciousness wave effect
     */
    triggerConsciousnessWave(target, waveConfig) {
        const { propagationSpeed, intensityFalloff, visualFeedback } = waveConfig;
        
        // Create ripple effect
        if (visualFeedback === 'ripple-effect') {
            this.createRippleEffect(target.position, propagationSpeed, intensityFalloff);
        }
        
        // Propagate consciousness through parameter web
        this.homeMaster.registerInteraction('consciousnessWave', target.id, 0.9, {
            propagationSpeed: propagationSpeed,
            falloff: intensityFalloff
        });
    }
    
    /**
     * Get event target information
     */
    getEventTarget(event) {
        const element = event.target.closest('.adaptive-card-container, .vib3-element');
        if (!element) return null;
        
        return {
            id: element.dataset.cardId || element.id,
            type: element.dataset.elementType || 'unknown',
            element: element,
            position: this.getElementPosition(element)
        };
    }
    
    /**
     * Get element position
     */
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    /**
     * Calculate mouse intensity for consciousness tracking
     */
    calculateMouseIntensity(mousePos) {
        if (!this.lastMousePosition) return 0;
        
        const distance = Math.sqrt(
            Math.pow(mousePos.x - this.lastMousePosition.x, 2) +
            Math.pow(mousePos.y - this.lastMousePosition.y, 2)
        );
        
        const timeElapsed = Date.now() - (this.lastMouseTime || 0);
        const velocity = timeElapsed > 0 ? distance / timeElapsed : 0;
        
        return Math.min(1.0, velocity * 0.1);
    }
    
    /**
     * Should process event based on configuration and state
     */
    shouldProcessEvent(event) {
        // Skip if interaction engine disabled
        if (!this.interactionConfig) return false;
        
        // Skip if element is not VIB3 related
        const isVIB3Element = event.target.closest('.adaptive-card-container, .vib3-element, .master-control');
        if (!isVIB3Element) return false;
        
        return true;
    }
    
    /**
     * Update event processing statistics
     */
    updateEventStats(startTime) {
        const processingTime = performance.now() - startTime;
        this.eventStats.eventsProcessed++;
        this.eventStats.averageProcessingTime = 
            (this.eventStats.averageProcessingTime + processingTime) / 2;
        this.eventStats.lastEventTime = Date.now();
    }
    
    /**
     * Get keyboard combination string
     */
    getKeyboardCombination(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.shiftKey) parts.push('Shift');
        if (event.altKey) parts.push('Alt');
        if (event.metaKey) parts.push('Meta');
        parts.push(event.key);
        return parts.join('+');
    }
    
    /**
     * Update interaction preset configuration
     */
    updateInteractionPreset(presetName, enabled) {
        console.log(`🎛️ Interaction preset ${presetName}: ${enabled ? 'enabled' : 'disabled'}`);
        
        // Update event mapping states
        switch (presetName) {
            case 'cardHoverEffects':
                this.eventMappings.get('mouseenter').enabled = enabled;
                this.eventMappings.get('mouseleave').enabled = enabled;
                break;
            case 'portalTransitionEffects':
                // Portal transitions handled in activate events
                break;
            case 'quantumEntanglementEffects':
                // Quantum effects handled in parameter web
                break;
        }
    }
    
    /**
     * Get interaction statistics
     */
    getInteractionStatistics() {
        return {
            eventsProcessed: this.eventStats.eventsProcessed,
            averageProcessingTime: this.eventStats.averageProcessingTime,
            activeInteractions: this.activeInteractions.size,
            selectedElements: this.interactionContext.selectedElements.size,
            hoveredElement: this.interactionContext.hoveredElement?.id || null,
            keyboardState: Array.from(this.interactionContext.keyboardState)
        };
    }
}

// Export for global access
window.VIB3InteractionEngine = VIB3InteractionEngine;

console.log('🎮 VIB3InteractionEngine loaded - User event to parameter mapping ready');