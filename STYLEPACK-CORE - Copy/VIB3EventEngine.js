/**
 * VIB3EventEngine.js - Comprehensive Active/Passive Event Management
 * 
 * Handles all user input and system events with proper categorization
 * between active (state-changing) and passive (feedback-only) events.
 */

class VIB3EventEngine {
    constructor(configSystem, homeMaster, reactivityBridge, layerManager) {
        this.version = '3.0.0';
        this.configSystem = configSystem;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        this.layerManager = layerManager;
        
        // Event manifest and configuration
        this.eventManifest = null;
        this.passiveEvents = new Map();
        this.activeEvents = new Map();
        
        // Event state tracking
        this.activeEventStates = new Map();
        this.passiveEventStates = new Map();
        this.eventHistory = [];
        this.undoStack = [];
        this.redoStack = [];
        
        // Performance optimization
        this.throttledEvents = new Map();
        this.debouncedEvents = new Map();
        this.batchedUpdates = new Set();
        
        // Event prevention and relationships
        this.preventedEvents = new Set();
        this.exclusiveEventPairs = new Map();
        this.sequentialChains = new Map();
        
        console.log('🎮 VIB3EventEngine initialized');
    }
    
    /**
     * Initialize event engine with comprehensive manifest
     */
    async initialize() {
        // Load comprehensive event manifest
        this.eventManifest = await this.loadEventManifest();
        
        // Setup event classifications
        this.setupEventClassifications();
        
        // Initialize performance optimizations
        this.initializePerformanceOptimizations();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize event relationships
        this.initializeEventRelationships();
        
        // Setup undo/redo system
        this.initializeUndoRedoSystem();
        
        console.log('✅ VIB3EventEngine fully initialized with active/passive event system');
        return this;
    }
    
    /**
     * Load comprehensive event manifest
     */
    async loadEventManifest() {
        try {
            const response = await fetch('./config/comprehensive-event-manifest.json');
            if (!response.ok) {
                throw new Error(`Failed to load event manifest: ${response.status}`);
            }
            const manifest = await response.json();
            console.log('📋 Comprehensive event manifest loaded');
            return manifest.vib3EventManifest;
        } catch (error) {
            console.error('❌ Failed to load event manifest:', error);
            return this.getDefaultEventManifest();
        }
    }
    
    /**
     * Setup event classifications from manifest
     */
    setupEventClassifications() {
        // Setup passive events
        Object.entries(this.eventManifest.passiveEvents).forEach(([category, events]) => {
            Object.entries(events).forEach(([eventType, config]) => {
                this.passiveEvents.set(eventType, {
                    category: 'passive',
                    config: config,
                    processor: this.processPassiveEvent.bind(this, eventType)
                });
            });
        });
        
        // Setup active events
        Object.entries(this.eventManifest.activeEvents).forEach(([category, events]) => {
            Object.entries(events).forEach(([eventType, config]) => {
                this.activeEvents.set(eventType, {
                    category: 'active',
                    config: config,
                    processor: this.processActiveEvent.bind(this, eventType)
                });
            });
        });
        
        console.log(`🎯 Event classifications setup: ${this.passiveEvents.size} passive, ${this.activeEvents.size} active`);
    }
    
    /**
     * Initialize performance optimizations
     */
    initializePerformanceOptimizations() {
        const perf = this.eventManifest.performanceOptimization;
        
        // Setup throttling
        Object.entries(perf.throttling).forEach(([eventType, interval]) => {
            this.throttledEvents.set(eventType, {
                interval: interval,
                lastCall: 0,
                pending: false
            });
        });
        
        // Setup debouncing
        Object.entries(perf.debouncing).forEach(([eventType, delay]) => {
            this.debouncedEvents.set(eventType, {
                delay: delay,
                timeoutId: null
            });
        });
        
        console.log('⚡ Performance optimizations initialized');
    }
    
    /**
     * Setup comprehensive event listeners
     */
    setupEventListeners() {
        // Passive event listeners
        this.passiveEvents.forEach((eventInfo, eventType) => {
            document.addEventListener(eventType, (event) => {
                this.handleEvent(event, 'passive');
            }, { 
                passive: eventType.includes('touch') || eventType.includes('wheel'),
                capture: eventInfo.config.bubbling === false
            });
        });
        
        // Active event listeners
        this.activeEvents.forEach((eventInfo, eventType) => {
            document.addEventListener(eventType, (event) => {
                this.handleEvent(event, 'active');
            }, { 
                passive: false,
                capture: eventInfo.config.bubbling === false
            });
        });
        
        console.log('🎧 Comprehensive event listeners setup');
    }
    
    /**
     * Handle all events with proper classification
     */
    handleEvent(event, category) {
        const eventType = event.type;
        const startTime = performance.now();
        
        // Check if event should be prevented
        if (this.shouldPreventEvent(eventType, event)) {
            event.preventDefault();
            return;
        }
        
        // Get event configuration
        const eventMap = category === 'passive' ? this.passiveEvents : this.activeEvents;
        const eventInfo = eventMap.get(eventType);
        
        if (!eventInfo) return;
        
        // Apply performance optimizations
        if (this.shouldThrottle(eventType) || this.shouldDebounce(eventType)) {
            this.applyPerformanceOptimization(eventType, event, eventInfo);
            return;
        }
        
        // Process event
        try {
            this.processEvent(event, eventInfo, category);
            
            // Track performance
            this.trackEventPerformance(eventType, startTime);
            
        } catch (error) {
            console.error(`❌ Error processing ${category} event ${eventType}:`, error);
        }
    }
    
    /**
     * Process passive events (feedback only, reversible)
     */
    processPassiveEvent(eventType, event, eventInfo) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        const effects = eventInfo.config.effects;
        
        // Apply target effects
        if (effects.target) {
            this.applyPassiveTargetEffects(target, effects.target, eventType);
        }
        
        // Apply other element effects
        if (effects.others) {
            this.applyPassiveOtherEffects(target, effects.others, eventType);
        }
        
        // Apply system effects
        if (effects.system) {
            this.applyPassiveSystemEffects(effects.system, eventType);
        }
        
        // Handle consciousness updates for passive events
        this.updatePassiveConsciousness(target, eventType, eventInfo.config);
        
        // Store passive state for potential reversal
        this.storePassiveState(target.id, eventType, eventInfo.config);
        
        console.log(`👁️ Passive event processed: ${eventType} on ${target.id}`);
    }
    
    /**
     * Process active events (state-changing, persistent)
     */
    processActiveEvent(eventType, event, eventInfo) {
        const target = this.getEventTarget(event);
        if (!target) return;
        
        // Store previous state for undo
        const previousState = this.captureElementState(target);
        
        const effects = eventInfo.config.effects;
        
        // Apply target effects
        if (effects.target) {
            this.applyActiveTargetEffects(target, effects.target, eventType);
        }
        
        // Apply other element effects
        if (effects.others) {
            this.applyActiveOtherEffects(target, effects.others, eventType);
        }
        
        // Apply system effects
        if (effects.system) {
            this.applyActiveSystemEffects(effects.system, eventType);
        }
        
        // Handle layer management for active events
        if (effects.target?.layer) {
            this.handleActiveLayerEffects(target, effects.target.layer);
        }
        
        // Update consciousness for active events
        this.updateActiveConsciousness(target, eventType, eventInfo.config);
        
        // Store for undo if undoable
        if (eventInfo.config.undoable) {
            this.storeUndoableAction(eventType, target, previousState);
        }
        
        // Register with parameter web
        this.registerActiveInteraction(target, eventType, eventInfo.config);
        
        console.log(`⚡ Active event processed: ${eventType} on ${target.id}`);
    }
    
    /**
     * Apply passive target effects (visual feedback only)
     */
    applyPassiveTargetEffects(target, effects, eventType) {
        // Visual effects
        if (effects.visual) {
            Object.entries(effects.visual).forEach(([property, value]) => {
                this.applyVisualEffect(target.element, property, value, true);
            });
        }
        
        // Consciousness effects (temporary)
        if (effects.consciousness) {
            Object.entries(effects.consciousness).forEach(([aspect, value]) => {
                this.updateElementConsciousness(target.id, aspect, value, true);
            });
        }
    }
    
    /**
     * Apply active target effects (state changes)
     */
    applyActiveTargetEffects(target, effects, eventType) {
        // State changes
        if (effects.state) {
            Object.entries(effects.state).forEach(([property, value]) => {
                this.updateElementState(target, property, value);
            });
        }
        
        // Visual effects (persistent)
        if (effects.visual) {
            Object.entries(effects.visual).forEach(([property, value]) => {
                this.applyVisualEffect(target.element, property, value, false);
            });
        }
        
        // Actions
        if (effects.action) {
            this.executeElementAction(target, effects.action);
        }
        
        // Position changes
        if (effects.position) {
            this.updateElementPosition(target, effects.position);
        }
        
        // Consciousness effects (persistent)
        if (effects.consciousness) {
            Object.entries(effects.consciousness).forEach(([aspect, value]) => {
                this.updateElementConsciousness(target.id, aspect, value, false);
            });
        }
    }
    
    /**
     * Apply visual effect to element
     */
    applyVisualEffect(element, property, value, temporary = false) {
        if (!element) return;
        
        switch (property) {
            case 'hover':
                if (value) element.classList.add('vib3-hover');
                else element.classList.remove('vib3-hover');
                break;
            case 'brightness':
                element.style.filter = `brightness(${value})`;
                break;
            case 'scale':
                element.style.transform = `scale(${value})`;
                break;
            case 'opacity':
                element.style.opacity = value;
                break;
            case 'transition':
                element.style.transition = value;
                break;
            case 'elevation':
                element.style.zIndex = value;
                break;
            case 'selection-indicator':
                if (value) element.classList.add('vib3-selected');
                else element.classList.remove('vib3-selected');
                break;
            case 'drag-placeholder':
                if (value) element.classList.add('vib3-dragging');
                else element.classList.remove('vib3-dragging');
                break;
            case 'restore':
                // Restore to default state
                element.style.filter = '';
                element.style.transform = '';
                element.style.opacity = '';
                element.classList.remove('vib3-hover', 'vib3-selected', 'vib3-dragging');
                break;
        }
        
        // Store for potential reversal if temporary
        if (temporary) {
            this.storeTemporaryEffect(element, property, value);
        }
    }
    
    /**
     * Handle layer effects for active events
     */
    handleActiveLayerEffects(target, layerEffects) {
        if (!this.layerManager) return;
        
        if (layerEffects.moveToLayer) {
            this.layerManager.moveElementToLayer(target.id, layerEffects.moveToLayer);
        }
        
        if (layerEffects.zIndexBoost) {
            this.layerManager.applyTemporaryElevation(target.id, layerEffects.zIndexBoost);
        }
        
        if (layerEffects.restoreLayer) {
            this.layerManager.restoreOriginalElevation(target.id);
        }
    }
    
    /**
     * Initialize event relationships and prevention rules
     */
    initializeEventRelationships() {
        const relationships = this.eventManifest.eventRelationships;
        
        // Setup exclusive pairs
        relationships.exclusive.pairs.forEach(([event1, event2]) => {
            this.exclusiveEventPairs.set(event1, event2);
            this.exclusiveEventPairs.set(event2, event1);
        });
        
        // Setup sequential chains
        relationships.sequential.chains.forEach((chain, index) => {
            this.sequentialChains.set(`chain-${index}`, chain);
        });
        
        console.log('🔗 Event relationships initialized');
    }
    
    /**
     * Check if event should be prevented
     */
    shouldPreventEvent(eventType, event) {
        const preventRules = this.eventManifest.eventRelationships.preventable.rules;
        
        return preventRules.some(rule => {
            if (rule.event === eventType) {
                // Check timing conditions
                if (rule.timing === 'within-500ms') {
                    const now = Date.now();
                    const recentEvents = this.eventHistory.filter(e => 
                        now - e.timestamp < 500 && rule.prevents.includes(e.type)
                    );
                    return recentEvents.length > 0;
                }
                
                // Check other conditions
                if (rule.condition === 'drag-initiated') {
                    return this.activeEventStates.has('dragstart');
                }
            }
            
            return false;
        });
    }
    
    /**
     * Performance optimization checks
     */
    shouldThrottle(eventType) {
        const throttleInfo = this.throttledEvents.get(eventType);
        if (!throttleInfo) return false;
        
        const now = Date.now();
        return (now - throttleInfo.lastCall) < throttleInfo.interval;
    }
    
    shouldDebounce(eventType) {
        return this.debouncedEvents.has(eventType);
    }
    
    /**
     * Apply performance optimization
     */
    applyPerformanceOptimization(eventType, event, eventInfo) {
        // Throttling
        if (this.shouldThrottle(eventType)) {
            const throttleInfo = this.throttledEvents.get(eventType);
            if (!throttleInfo.pending) {
                throttleInfo.pending = true;
                setTimeout(() => {
                    this.processEvent(event, eventInfo, eventInfo.category);
                    throttleInfo.lastCall = Date.now();
                    throttleInfo.pending = false;
                }, throttleInfo.interval);
            }
            return;
        }
        
        // Debouncing
        if (this.shouldDebounce(eventType)) {
            const debounceInfo = this.debouncedEvents.get(eventType);
            if (debounceInfo.timeoutId) {
                clearTimeout(debounceInfo.timeoutId);
            }
            debounceInfo.timeoutId = setTimeout(() => {
                this.processEvent(event, eventInfo, eventInfo.category);
            }, debounceInfo.delay);
            return;
        }
    }
    
    /**
     * Process event with proper routing
     */
    processEvent(event, eventInfo, category) {
        if (category === 'passive') {
            this.processPassiveEvent(event.type, event, eventInfo);
        } else {
            this.processActiveEvent(event.type, event, eventInfo);
        }
        
        // Add to event history
        this.eventHistory.push({
            type: event.type,
            category: category,
            timestamp: Date.now(),
            target: this.getEventTarget(event)?.id
        });
        
        // Limit history size
        if (this.eventHistory.length > 1000) {
            this.eventHistory = this.eventHistory.slice(-500);
        }
    }
    
    /**
     * Get event target with VIB3 element detection
     */
    getEventTarget(event) {
        const element = event.target.closest('.vib3-element, .adaptive-card-container, .master-control');
        if (!element) return null;
        
        return {
            id: element.dataset.elementId || element.dataset.cardId || element.id,
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
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height
        };
    }
    
    /**
     * Initialize undo/redo system
     */
    initializeUndoRedoSystem() {
        // Keyboard shortcuts for undo/redo
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.redo();
            }
        });
        
        console.log('↩️ Undo/redo system initialized');
    }
    
    /**
     * Store undoable action
     */
    storeUndoableAction(eventType, target, previousState) {
        this.undoStack.push({
            eventType: eventType,
            targetId: target.id,
            previousState: previousState,
            timestamp: Date.now()
        });
        
        // Clear redo stack when new action is performed
        this.redoStack = [];
        
        // Limit undo stack size
        if (this.undoStack.length > 50) {
            this.undoStack = this.undoStack.slice(-25);
        }
    }
    
    /**
     * Undo last action
     */
    undo() {
        if (this.undoStack.length === 0) return false;
        
        const action = this.undoStack.pop();
        const element = document.querySelector(`[data-element-id="${action.targetId}"]`);
        
        if (element) {
            // Store current state for redo
            const currentState = this.captureElementState({ id: action.targetId, element: element });
            this.redoStack.push({
                ...action,
                previousState: currentState
            });
            
            // Restore previous state
            this.restoreElementState(element, action.previousState);
            
            console.log(`↩️ Undid: ${action.eventType} on ${action.targetId}`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Redo last undone action
     */
    redo() {
        if (this.redoStack.length === 0) return false;
        
        const action = this.redoStack.pop();
        const element = document.querySelector(`[data-element-id="${action.targetId}"]`);
        
        if (element) {
            // Store current state for undo
            const currentState = this.captureElementState({ id: action.targetId, element: element });
            this.undoStack.push({
                ...action,
                previousState: currentState
            });
            
            // Restore redo state
            this.restoreElementState(element, action.previousState);
            
            console.log(`↪️ Redid: ${action.eventType} on ${action.targetId}`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Get event engine statistics
     */
    getEventStatistics() {
        return {
            passiveEventsConfigured: this.passiveEvents.size,
            activeEventsConfigured: this.activeEvents.size,
            recentEvents: this.eventHistory.slice(-10),
            undoStackSize: this.undoStack.length,
            redoStackSize: this.redoStack.length,
            throttledEvents: Array.from(this.throttledEvents.keys()),
            debouncedEvents: Array.from(this.debouncedEvents.keys())
        };
    }
    
    /**
     * Get default event manifest
     */
    getDefaultEventManifest() {
        return {
            passiveEvents: {
                mouse: {
                    mouseenter: { category: 'passive', effects: { target: { visual: { hover: true } } } },
                    mouseleave: { category: 'passive', effects: { target: { visual: { hover: false } } } }
                }
            },
            activeEvents: {
                navigation: {
                    click: { category: 'active', effects: { target: { state: { selected: true } } }, undoable: true }
                }
            },
            eventRelationships: { exclusive: { pairs: [] }, preventable: { rules: [] } },
            performanceOptimization: { throttling: {}, debouncing: {} }
        };
    }
}

// Export for global access
window.VIB3EventEngine = VIB3EventEngine;

console.log('🎮 VIB3EventEngine loaded - Comprehensive active/passive event system ready');