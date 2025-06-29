/**
 * HomeMaster.js - Single Source of Truth for Application State
 * 
 * Central state management system for the VIB34D application.
 * Manages current state, state transitions, parameter interpolation,
 * and serves as the authoritative source for all visual parameters.
 * 
 * Part of Phase 3: State Management & Navigation
 */

class HomeMaster {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Core dependencies
        this.jsonConfigSystem = null;
        
        // Current application state
        this.currentState = null;
        this.previousState = null;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        
        // State definitions from state-map.json
        this.stateDefinitions = {};
        this.stateSequence = [];
        this.navigationConfig = {};
        this.transitionConfig = {};
        
        // Global parameters (current state + interpolation)
        this.globalParameters = {
            // Master dimensional controls
            u_dimension: 3.5,
            u_morphFactor: 0.5,
            u_gridDensity: 8.0,
            u_rotationSpeed: 0.6,
            u_lineThickness: 0.02,
            u_patternIntensity: 1.0,
            u_colorShift: 0.0,
            u_glitchIntensity: 0.0,
            u_universeModifier: 1.0,
            
            // State information
            activeTheme: 'dark_matter',
            backgroundGeometry: 'hypercube',
            title: 'VIB34D System',
            description: 'Polytonal Visualizer System'
        };
        
        // Parameter history for interpolation
        this.parameterHistory = [];
        this.maxHistorySize = 10;
        
        // Active cards and their states
        this.activeCards = new Map();
        this.cardTransitions = new Map();
        
        // Transition state management
        this.transitionStartTime = null;
        this.transitionDuration = 800;
        this.transitionCurve = 'easeInOut';
        
        // Event system
        this.eventBus = new EventTarget();
        
        // Performance metrics
        this.metrics = {
            stateChanges: 0,
            transitionTime: 0,
            parameterUpdates: 0,
            lastUpdate: performance.now()
        };
        
        console.log('🏠 HomeMaster initialized');
    }

    /**
     * Initialize HomeMaster with configuration system
     */
    async initialize(jsonConfigSystem) {
        if (this.isInitialized) {
            console.warn('⚠️ HomeMaster already initialized');
            return;
        }

        try {
            console.log('🏠 Initializing HomeMaster...');
            
            this.jsonConfigSystem = jsonConfigSystem;
            
            // Load state definitions from state-map.json
            await this.loadStateDefinitions();
            
            // Load layout definitions for card information
            await this.loadLayoutDefinitions();
            
            // Set initial state
            this.setInitialState();
            
            this.isInitialized = true;
            
            console.log(`✅ HomeMaster initialized with ${Object.keys(this.stateDefinitions).length} states`);
            console.log(`🏠 Initial state: ${this.currentState}`);
            
            return this;
            
        } catch (error) {
            console.error('❌ Failed to initialize HomeMaster:', error);
            throw error;
        }
    }
    
    /**
     * Load state definitions from state-map.json
     */
    async loadStateDefinitions() {
        const stateMapConfig = this.jsonConfigSystem.getConfig('stateMap');
        if (!stateMapConfig) {
            throw new Error('No state-map configuration found');
        }
        
        // Load state definitions
        this.stateDefinitions = stateMapConfig.states || {};
        this.stateSequence = stateMapConfig.stateSequence || Object.keys(this.stateDefinitions);
        this.navigationConfig = stateMapConfig.navigation || {};
        this.transitionConfig = stateMapConfig.transitions || {};
        
        // Store global settings
        this.globalSettings = stateMapConfig.globalSettings || {};
        
        console.log(`🏠 Loaded ${Object.keys(this.stateDefinitions).length} state definitions`);
        console.log(`🏠 State sequence: ${this.stateSequence.join(' → ')}`);
    }
    
    /**
     * Load layout definitions for card information
     */
    async loadLayoutDefinitions() {
        const layoutConfig = this.jsonConfigSystem.getConfig('layout');
        if (!layoutConfig || !layoutConfig.cards) {
            console.warn('⚠️ No layout configuration found');
            return;
        }
        
        // Store card definitions for reference
        this.cardDefinitions = new Map();
        layoutConfig.cards.forEach(card => {
            this.cardDefinitions.set(card.id, card);
        });
        
        console.log(`🏠 Loaded ${this.cardDefinitions.size} card definitions`);
    }
    
    /**
     * Set the initial state from configuration
     */
    setInitialState() {
        const stateMapConfig = this.jsonConfigSystem.getConfig('stateMap');
        const initialStateId = stateMapConfig?.initialState || 'home';
        
        if (!this.stateDefinitions[initialStateId]) {
            console.warn(`⚠️ Initial state '${initialStateId}' not found, using first available state`);
            const availableStates = Object.keys(this.stateDefinitions);
            if (availableStates.length > 0) {
                this.setStateImmediate(availableStates[0]);
            }
        } else {
            this.setStateImmediate(initialStateId);
        }
    }
    
    /**
     * Set state immediately without transition
     */
    setStateImmediate(stateId) {
        const stateDefinition = this.stateDefinitions[stateId];
        if (!stateDefinition) {
            console.error(`❌ State '${stateId}' not found`);
            return false;
        }
        
        this.currentState = stateId;
        this.updateParametersFromState(stateDefinition);
        this.updateActiveCards(stateDefinition);
        
        // Save to parameter history
        this.saveParameterHistory();
        
        console.log(`🏠 State set to: ${stateId}`);
        
        // Emit state change event
        this.eventBus.dispatchEvent(new CustomEvent('stateChanged', {
            detail: {
                newState: stateId,
                stateDefinition: stateDefinition,
                immediate: true
            }
        }));
        
        return true;
    }
    
    /**
     * Navigate to a new state with transition
     */
    async navigateTo(stateId, options = {}) {
        if (this.isTransitioning) {
            console.warn('⚠️ Already transitioning, ignoring navigation request');
            return false;
        }
        
        const stateDefinition = this.stateDefinitions[stateId];
        if (!stateDefinition) {
            console.error(`❌ State '${stateId}' not found`);
            return false;
        }
        
        if (stateId === this.currentState) {
            console.log(`🏠 Already in state '${stateId}'`);
            return true;
        }
        
        console.log(`🏠 Navigating: ${this.currentState} → ${stateId}`);
        
        // Emit state will change event
        this.eventBus.dispatchEvent(new CustomEvent('stateWillChange', {
            detail: {
                fromState: this.currentState,
                toState: stateId,
                fromDefinition: this.stateDefinitions[this.currentState],
                toDefinition: stateDefinition
            }
        }));
        
        // Start transition
        return await this.performStateTransition(stateId, stateDefinition, options);
    }
    
    /**
     * Perform state transition with interpolation
     */
    async performStateTransition(newStateId, newStateDefinition, options = {}) {
        return new Promise((resolve) => {
            this.isTransitioning = true;
            this.previousState = this.currentState;
            this.transitionStartTime = performance.now();
            
            // Get transition configuration
            const transitionKey = `${this.currentState}->${newStateId}`;
            const transitionConfig = this.transitionConfig.stateSpecific?.[transitionKey] || 
                                    this.transitionConfig.default || 
                                    { duration: 800, curve: 'easeInOut' };
            
            this.transitionDuration = options.duration || transitionConfig.duration || 800;
            this.transitionCurve = options.curve || transitionConfig.curve || 'easeInOut';
            
            // Store target parameters for interpolation
            const startParameters = { ...this.globalParameters };
            const targetParameters = this.calculateTargetParameters(newStateDefinition);
            
            // Store target card states
            const startCardStates = this.getCardStates();
            const targetCardStates = this.calculateTargetCardStates(newStateDefinition);
            
            console.log(`🏠 Transition started: ${this.transitionDuration}ms with ${this.transitionCurve} curve`);
            
            // Interpolate over time
            const startTime = performance.now();
            const interpolate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / this.transitionDuration, 1.0);
                
                // Apply easing curve
                const easedProgress = this.applyEasingCurve(progress, this.transitionCurve);
                this.transitionProgress = easedProgress;
                
                // Interpolate parameters
                this.interpolateParameters(startParameters, targetParameters, easedProgress);
                
                // Interpolate card states
                this.interpolateCardStates(startCardStates, targetCardStates, easedProgress);
                
                // Emit progress event
                this.eventBus.dispatchEvent(new CustomEvent('transitionProgress', {
                    detail: {
                        progress: progress,
                        easedProgress: easedProgress,
                        fromState: this.previousState,
                        toState: newStateId
                    }
                }));
                
                // Continue or complete
                if (progress < 1.0) {
                    requestAnimationFrame(interpolate);
                } else {
                    this.completeTransition(newStateId, newStateDefinition);
                    resolve(true); // Resolve the promise when transition completes
                }
            };
            
            // Start interpolation
            requestAnimationFrame(interpolate);
        });
    }
    
    /**
     * Complete the state transition
     */
    completeTransition(newStateId, newStateDefinition) {
        this.currentState = newStateId;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        
        // Ensure final parameters are exact
        this.updateParametersFromState(newStateDefinition);
        this.updateActiveCards(newStateDefinition);
        
        // Save to parameter history
        this.saveParameterHistory();
        
        // Update metrics
        this.metrics.stateChanges++;
        this.metrics.transitionTime = performance.now() - this.transitionStartTime;
        
        console.log(`✅ Transition complete: ${this.previousState} → ${newStateId} (${this.metrics.transitionTime.toFixed(2)}ms)`);
        
        // Emit state change complete event
        this.eventBus.dispatchEvent(new CustomEvent('stateChanged', {
            detail: {
                newState: newStateId,
                previousState: this.previousState,
                stateDefinition: newStateDefinition,
                transitionTime: this.metrics.transitionTime
            }
        }));
        
        this.previousState = null;
    }
    
    /**
     * Calculate target parameters for a state
     */
    calculateTargetParameters(stateDefinition) {
        // Start with current global parameters
        const targetParameters = { ...this.globalParameters };
        
        // Apply state-specific parameter overrides
        if (stateDefinition.parameterOverrides) {
            Object.assign(targetParameters, stateDefinition.parameterOverrides);
        }
        
        // Update state-specific properties
        targetParameters.activeTheme = stateDefinition.activeTheme || targetParameters.activeTheme;
        targetParameters.backgroundGeometry = stateDefinition.backgroundGeometry || targetParameters.backgroundGeometry;
        targetParameters.title = stateDefinition.title || targetParameters.title;
        targetParameters.description = stateDefinition.description || targetParameters.description;
        
        return targetParameters;
    }
    
    /**
     * Calculate target card states for a state
     */
    calculateTargetCardStates(stateDefinition) {
        const targetCardStates = new Map();
        
        // Set all cards to default hidden state
        this.cardDefinitions.forEach((cardDef, cardId) => {
            targetCardStates.set(cardId, {
                visible: false,
                x: cardDef.position?.x || 0,
                y: cardDef.position?.y || 0,
                scale: 1.0,
                opacity: 0.0
            });
        });
        
        // Update with state-specific positions
        if (stateDefinition.cardPositions) {
            Object.entries(stateDefinition.cardPositions).forEach(([cardId, cardState]) => {
                targetCardStates.set(cardId, {
                    visible: cardState.visible !== false,
                    x: cardState.x || 0,
                    y: cardState.y || 0,
                    scale: cardState.scale || 1.0,
                    opacity: cardState.visible !== false ? 1.0 : 0.0
                });
            });
        }
        
        return targetCardStates;
    }
    
    /**
     * Get current card states
     */
    getCardStates() {
        const cardStates = new Map();
        
        this.activeCards.forEach((cardState, cardId) => {
            cardStates.set(cardId, { ...cardState });
        });
        
        return cardStates;
    }
    
    /**
     * Interpolate parameters between start and target
     */
    interpolateParameters(startParams, targetParams, progress) {
        Object.keys(targetParams).forEach(paramName => {
            const startValue = startParams[paramName];
            const targetValue = targetParams[paramName];
            
            if (typeof startValue === 'number' && typeof targetValue === 'number') {
                this.globalParameters[paramName] = startValue + (targetValue - startValue) * progress;
            } else {
                // For non-numeric values, switch at 50% progress
                this.globalParameters[paramName] = progress < 0.5 ? startValue : targetValue;
            }
        });
        
        this.metrics.parameterUpdates++;
    }
    
    /**
     * Interpolate card states
     */
    interpolateCardStates(startStates, targetStates, progress) {
        targetStates.forEach((targetState, cardId) => {
            const startState = startStates.get(cardId) || {
                visible: false, x: 0, y: 0, scale: 1.0, opacity: 0.0
            };
            
            const interpolatedState = {
                visible: targetState.visible,
                x: startState.x + (targetState.x - startState.x) * progress,
                y: startState.y + (targetState.y - startState.y) * progress,
                scale: startState.scale + (targetState.scale - startState.scale) * progress,
                opacity: startState.opacity + (targetState.opacity - startState.opacity) * progress
            };
            
            this.activeCards.set(cardId, interpolatedState);
        });
    }
    
    /**
     * Apply easing curve to progress
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
     * Update parameters from state definition
     */
    updateParametersFromState(stateDefinition) {
        // Apply parameter overrides
        if (stateDefinition.parameterOverrides) {
            Object.assign(this.globalParameters, stateDefinition.parameterOverrides);
        }
        
        // Update state properties
        this.globalParameters.activeTheme = stateDefinition.activeTheme || this.globalParameters.activeTheme;
        this.globalParameters.backgroundGeometry = stateDefinition.backgroundGeometry || this.globalParameters.backgroundGeometry;
        this.globalParameters.title = stateDefinition.title || this.globalParameters.title;
        this.globalParameters.description = stateDefinition.description || this.globalParameters.description;
    }
    
    /**
     * Update active cards from state definition
     */
    updateActiveCards(stateDefinition) {
        // Clear current active cards
        this.activeCards.clear();
        
        // Set cards from state definition
        if (stateDefinition.cardPositions) {
            Object.entries(stateDefinition.cardPositions).forEach(([cardId, cardState]) => {
                this.activeCards.set(cardId, {
                    visible: cardState.visible !== false,
                    x: cardState.x || 0,
                    y: cardState.y || 0,
                    scale: cardState.scale || 1.0,
                    opacity: cardState.visible !== false ? 1.0 : 0.0
                });
            });
        }
    }
    
    /**
     * Navigate to next state in sequence
     */
    navigateNext() {
        if (!this.currentState) return false;
        
        const currentIndex = this.stateSequence.indexOf(this.currentState);
        if (currentIndex === -1) return false;
        
        const nextIndex = (currentIndex + 1) % this.stateSequence.length;
        const nextState = this.stateSequence[nextIndex];
        
        return this.navigateTo(nextState);
    }
    
    /**
     * Navigate to previous state in sequence
     */
    navigatePrevious() {
        if (!this.currentState) return false;
        
        const currentIndex = this.stateSequence.indexOf(this.currentState);
        if (currentIndex === -1) return false;
        
        const prevIndex = (currentIndex - 1 + this.stateSequence.length) % this.stateSequence.length;
        const prevState = this.stateSequence[prevIndex];
        
        return this.navigateTo(prevState);
    }
    
    /**
     * Cycle through states
     */
    cycleState() {
        return this.navigateNext();
    }
    
    /**
     * Save current parameters to history
     */
    saveParameterHistory() {
        const historyEntry = {
            state: this.currentState,
            timestamp: Date.now(),
            parameters: { ...this.globalParameters },
            cardStates: new Map(this.activeCards)
        };
        
        this.parameterHistory.push(historyEntry);
        
        // Limit history size
        if (this.parameterHistory.length > this.maxHistorySize) {
            this.parameterHistory.shift();
        }
    }
    
    /**
     * Get current global parameters
     */
    getGlobalParameters() {
        return { ...this.globalParameters };
    }
    
    /**
     * Get current state information
     */
    getStateInfo() {
        return {
            currentState: this.currentState,
            previousState: this.previousState,
            isTransitioning: this.isTransitioning,
            transitionProgress: this.transitionProgress,
            availableStates: Object.keys(this.stateDefinitions),
            stateSequence: this.stateSequence
        };
    }
    
    /**
     * Get active cards information
     */
    getActiveCards() {
        return new Map(this.activeCards);
    }
    
    /**
     * Get navigation configuration
     */
    getNavigationConfig() {
        return { ...this.navigationConfig };
    }
    
    /**
     * Get metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            isInitialized: this.isInitialized,
            currentState: this.currentState,
            totalStates: Object.keys(this.stateDefinitions).length,
            historySize: this.parameterHistory.length
        };
    }
    
    /**
     * Update a specific parameter
     */
    updateParameter(paramName, value) {
        if (this.globalParameters.hasOwnProperty(paramName)) {
            this.globalParameters[paramName] = value;
            this.metrics.parameterUpdates++;
            
            // Emit parameter update event
            this.eventBus.dispatchEvent(new CustomEvent('parameterUpdated', {
                detail: {
                    parameter: paramName,
                    value: value,
                    allParameters: { ...this.globalParameters }
                }
            }));
            
            return true;
        }
        
        console.warn(`⚠️ Parameter '${paramName}' not found`);
        return false;
    }
    
    /**
     * Subscribe to HomeMaster events
     */
    addEventListener(eventType, callback) {
        this.eventBus.addEventListener(eventType, callback);
        
        return () => {
            this.eventBus.removeEventListener(eventType, callback);
        };
    }
    
    /**
     * Shutdown HomeMaster
     */
    shutdown() {
        console.log('🏠 HomeMaster shutdown initiated...');
        
        this.isTransitioning = false;
        this.activeCards.clear();
        this.parameterHistory.length = 0;
        this.isInitialized = false;
        
        console.log('✅ HomeMaster shutdown complete');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeMaster;
} else {
    window.HomeMaster = HomeMaster;
}

console.log('🏠 HomeMaster loaded - State management ready');