/**
 * SystemController.js - Main Application Orchestrator
 * 
 * The central controller that orchestrates all modules in the VIB34D system.
 * Initializes JsonConfigSystem, manages state transitions, and coordinates
 * between HomeMaster, VisualizerPool, and InteractionCoordinator.
 */

class SystemController {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.isBooting = false;
        
        // Core modules
        this.jsonConfigSystem = null;
        this.homeMaster = null;
        this.visualizerPool = null;
        this.interactionCoordinator = null;
        this.geometryRegistry = null;
        this.agentAPI = null; // Phase 5: Agent API
        
        // Application state
        this.currentState = null;
        this.isTransitioning = false;
        this.applicationContainer = null;
        
        // Event system for inter-module communication
        this.eventBus = new EventTarget();
        
        // Performance monitoring
        this.performanceMetrics = {
            bootTime: null,
            lastFrameTime: performance.now(),
            frameCount: 0,
            averageFPS: 60
        };
        
        // Bind methods to preserve context
        this.handleConfigLoaded = this.handleConfigLoaded.bind(this);
        this.handleConfigUpdated = this.handleConfigUpdated.bind(this);
        this.handleNavigationRequest = this.handleNavigationRequest.bind(this);
        this.handleParameterUpdate = this.handleParameterUpdate.bind(this);
        this.renderFrame = this.renderFrame.bind(this);
        
        console.log('🎛️ SystemController initialized');
    }

    /**
     * Initialize the entire VIB34D system
     */
    async initialize(containerSelector = '#vib34d-app') {
        if (this.isInitialized || this.isBooting) {
            console.warn('⚠️ SystemController already initialized or booting');
            return;
        }
        
        this.isBooting = true;
        const bootStartTime = performance.now();
        
        try {
            console.log('🚀 SystemController boot sequence initiated...');
            
            // Step 1: Initialize application container
            await this.initializeContainer(containerSelector);
            
            // Step 2: Initialize JsonConfigSystem and load all configurations
            await this.initializeConfigSystem();
            
            // Step 3: Initialize core modules (Phase 2+)
            await this.initializeCoreModules();
            
            // Step 4: Set up event listeners
            this.setupEventListeners();
            
            // Step 5: Start render loop
            this.startRenderLoop();
            
            // Boot complete
            this.performanceMetrics.bootTime = performance.now() - bootStartTime;
            this.isBooting = false;
            this.isInitialized = true;
            
            console.log(`✅ SystemController boot complete in ${this.performanceMetrics.bootTime.toFixed(2)}ms`);
            
            // Emit boot complete event
            this.eventBus.dispatchEvent(new CustomEvent('systemBooted', {
                detail: {
                    bootTime: this.performanceMetrics.bootTime,
                    version: this.version
                }
            }));
            
            return this;
            
        } catch (error) {
            console.error('❌ SystemController boot failed:', error);
            this.isBooting = false;
            throw error;
        }
    }
    
    /**
     * Initialize the main application container
     */
    async initializeContainer(containerSelector) {
        console.log('📦 Initializing application container...');
        
        // Find or create the main container
        this.applicationContainer = document.querySelector(containerSelector);
        
        if (!this.applicationContainer) {
            // Create container if it doesn't exist
            this.applicationContainer = document.createElement('div');
            this.applicationContainer.id = 'vib34d-app';
            document.body.appendChild(this.applicationContainer);
        }
        
        // Add base classes and setup
        this.applicationContainer.classList.add('vib34d-system', 'initializing');
        
        // Add loading indicator
        this.applicationContainer.innerHTML = `
            <div class="vib34d-boot-loader">
                <div class="loader-content">
                    <h2>VIB34D System</h2>
                    <div class="loader-bar"></div>
                    <p>Initializing Polytonal Visualizer...</p>
                </div>
            </div>
        `;
        
        console.log('✅ Application container initialized');
    }
    
    /**
     * Initialize JsonConfigSystem and load configurations
     */
    async initializeConfigSystem() {
        console.log('📋 Initializing configuration system...');
        
        try {
            // Create JsonConfigSystem instance
            this.jsonConfigSystem = new JsonConfigSystem();
            
            // Set up event listeners for config system
            this.jsonConfigSystem.eventBus.addEventListener('configLoaded', this.handleConfigLoaded);
            this.jsonConfigSystem.eventBus.addEventListener('configUpdated', this.handleConfigUpdated);
            
            // Load all configurations
            const configs = await this.jsonConfigSystem.loadAllConfigs();
            
            console.log('✅ Configuration system initialized with configs:', Object.keys(configs));
            
        } catch (error) {
            console.error('❌ Failed to initialize configuration system:', error);
            throw error;
        }
    }
    
    /**
     * Initialize core modules (Phase 2+ implementation)
     */
    async initializeCoreModules() {
        console.log('🔧 Initializing core modules...');
        
        try {
            // Phase 2 - Initialize GeometryRegistry
            if (typeof GeometryRegistry !== 'undefined') {
                console.log('📐 Initializing GeometryRegistry...');
                this.geometryRegistry = new GeometryRegistry();
                await this.geometryRegistry.initialize(this.jsonConfigSystem);
            } else {
                console.warn('⚠️ GeometryRegistry not loaded, skipping...');
            }
            
            // Phase 3 - Initialize HomeMaster FIRST (needed for VisualizerPool)
            if (typeof HomeMaster !== 'undefined') {
                console.log('🏠 Initializing HomeMaster...');
                this.homeMaster = new HomeMaster();
                await this.homeMaster.initialize(this.jsonConfigSystem);
            } else {
                console.warn('⚠️ HomeMaster not loaded, skipping...');
            }
            
            // Phase 2 - Initialize VisualizerPool with HomeMaster
            if (typeof VisualizerPool !== 'undefined' && this.geometryRegistry) {
                console.log('🎮 Initializing VisualizerPool...');
                this.visualizerPool = new VisualizerPool();
                
                // Phase 4: Pass HomeMaster for real-time parameter synchronization
                await this.visualizerPool.initialize(this.geometryRegistry, this.homeMaster);
                
                // Start render loop for WebGL visualizers
                this.visualizerPool.startRenderLoop();
            } else {
                console.warn('⚠️ VisualizerPool not loaded or GeometryRegistry missing, skipping...');
            }
            
            // Phase 3 - Initialize InteractionCoordinator
            if (typeof InteractionCoordinator !== 'undefined' && this.homeMaster) {
                console.log('🎯 Initializing InteractionCoordinator...');
                this.interactionCoordinator = new InteractionCoordinator();
                await this.interactionCoordinator.initialize(this.jsonConfigSystem, this.homeMaster);
            } else {
                console.warn('⚠️ InteractionCoordinator not loaded or HomeMaster missing, skipping...');
            }
            
            // Phase 5 - Initialize AgentAPI
            if (typeof AgentAPI !== 'undefined') {
                console.log('🤖 Initializing AgentAPI...');
                this.agentAPI = new AgentAPI();
                await this.agentAPI.initialize(this);
            } else {
                console.warn('⚠️ AgentAPI not loaded, skipping...');
            }
            
            console.log('✅ Core modules initialization complete');
            
        } catch (error) {
            console.error('❌ Failed to initialize core modules:', error);
            // Don't throw - continue with partial initialization
        }
    }
    
    /**
     * Handle configuration loaded event
     */
    handleConfigLoaded(event) {
        console.log('📋 Configuration loaded event received');
        const { allConfigs } = event.detail;
        
        // Initialize static layout based on loaded configurations
        this.initializeStaticLayout(allConfigs);
        
        // Apply basic theming
        this.applyBasicTheming(allConfigs);
        
        // Set initial state from state-map.json
        if (allConfigs.stateMap && allConfigs.stateMap.initialState) {
            this.currentState = allConfigs.stateMap.initialState;
            console.log(`🎯 Initial state set to: ${this.currentState}`);
        }
    }
    
    /**
     * Handle configuration updated event (hot-reload)
     */
    handleConfigUpdated(event) {
        console.log('🔄 Configuration updated event received');
        const { configType, newConfig } = event.detail;
        
        // Handle different config types
        switch (configType) {
            case 'layout':
                this.reinitializeLayout(newConfig);
                break;
            case 'visuals':
                this.reapplyTheming(newConfig);
                break;
            case 'behavior':
                // TODO: Phase 4 - Update interaction blueprints
                break;
            case 'stateMap':
                // TODO: Phase 3 - Update state definitions
                break;
        }
    }
    
    /**
     * Initialize static layout from layout-content.json (Phase 1.3)
     */
    initializeStaticLayout(configs) {
        console.log('🏗️ Initializing static layout...');
        
        const layoutConfig = configs.layout;
        if (!layoutConfig) {
            console.error('❌ No layout configuration found');
            return;
        }
        
        // Clear loading screen
        this.applicationContainer.innerHTML = '';
        this.applicationContainer.classList.remove('initializing');
        this.applicationContainer.classList.add('layout-initialized');
        
        // Apply CSS Grid layout
        if (layoutConfig.layout && layoutConfig.layout.grid) {
            this.applicationContainer.style.display = 'grid';
            this.applicationContainer.style.gridTemplateColumns = layoutConfig.layout.grid.columns;
            this.applicationContainer.style.gridTemplateRows = layoutConfig.layout.grid.rows;
            this.applicationContainer.style.height = '100vh';
            this.applicationContainer.style.width = '100vw';
        }
        
        // Create components
        if (layoutConfig.components) {
            layoutConfig.components.forEach(component => {
                this.createComponent(component);
            });
        }
        
        // Create adaptive cards
        if (layoutConfig.cards) {
            layoutConfig.cards.forEach(card => {
                this.createAdaptiveCard(card);
            });
        }
        
        console.log('✅ Static layout initialized');
    }
    
    /**
     * Create a UI component from layout configuration
     */
    createComponent(componentConfig) {
        const element = document.createElement('div');
        element.id = componentConfig.id;
        element.classList.add('vib34d-component', `component-${componentConfig.type}`);
        
        // Apply layout area if specified
        if (componentConfig.layoutArea) {
            element.style.gridArea = componentConfig.layoutArea;
        }
        
        // Apply position if specified
        if (componentConfig.position) {
            element.style.left = `${componentConfig.position.x}px`;
            element.style.top = `${componentConfig.position.y}px`;
            if (componentConfig.position.absolute) {
                element.style.position = 'absolute';
            }
        }
        
        // Add component-specific content
        switch (componentConfig.type) {
            case 'NavContainer':
                element.innerHTML = '<nav class="vib34d-nav">Navigation</nav>';
                break;
            case 'ControlPanel':
                element.innerHTML = '<div class="vib34d-controls">Controls</div>';
                break;
            default:
                element.innerHTML = `<div class="component-placeholder">${componentConfig.type}</div>`;
        }
        
        this.applicationContainer.appendChild(element);
        console.log(`📦 Created component: ${componentConfig.id} (${componentConfig.type})`);
    }
    
    /**
     * Create an adaptive card from layout configuration
     */
    createAdaptiveCard(cardConfig) {
        const cardElement = document.createElement('div');
        cardElement.id = cardConfig.id;
        cardElement.classList.add('vib34d-card', 'adaptive-card');
        
        // Apply position
        if (cardConfig.position) {
            cardElement.style.left = `${cardConfig.position.x}px`;
            cardElement.style.top = `${cardConfig.position.y}px`;
            cardElement.style.position = 'absolute';
        }
        
        // Create card content
        cardElement.innerHTML = `
            <div class="card-background">
                <canvas class="card-visualizer" data-geometry="${cardConfig.geometry || 'hypercube'}"></canvas>
            </div>
            <div class="card-content">
                <h3 class="card-title">${cardConfig.title || 'Untitled'}</h3>
                <div class="card-body">
                    ${cardConfig.content || '<p>Card content</p>'}
                </div>
            </div>
        `;
        
        this.applicationContainer.appendChild(cardElement);
        console.log(`🃏 Created adaptive card: ${cardConfig.id} with geometry: ${cardConfig.geometry}`);
    }
    
    /**
     * Apply basic theming from visuals.json (Phase 1.4)
     */
    applyBasicTheming(configs) {
        console.log('🎨 Applying basic theming...');
        
        const visualsConfig = configs.visuals;
        if (!visualsConfig || !visualsConfig.themes) {
            console.warn('⚠️ No visual themes found in configuration');
            return;
        }
        
        // Get default theme (first theme or one named 'default')
        const themeNames = Object.keys(visualsConfig.themes);
        const defaultThemeName = themeNames.includes('default') ? 'default' : themeNames[0];
        const defaultTheme = visualsConfig.themes[defaultThemeName];
        
        if (!defaultTheme) {
            console.warn('⚠️ No default theme found');
            return;
        }
        
        // Apply theme as CSS custom properties
        const root = document.documentElement;
        
        Object.entries(defaultTheme).forEach(([property, value]) => {
            const cssProperty = `--vib34d-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssProperty, value);
        });
        
        // Add theme class to application container
        this.applicationContainer.classList.add(`theme-${defaultThemeName}`);
        
        console.log(`✅ Applied theme: ${defaultThemeName}`);
    }
    
    /**
     * Set up event listeners for system events
     */
    setupEventListeners() {
        // Phase 3 - HomeMaster event listeners
        if (this.homeMaster) {
            this.homeMaster.addEventListener('stateChanged', (event) => {
                console.log('🏠 State changed:', event.detail);
                this.handleStateChange(event.detail);
            });
            
            this.homeMaster.addEventListener('stateWillChange', (event) => {
                console.log('🏠 State will change:', event.detail);
            });
        }
        
        // TODO: Phase 4 - Parameter update listeners
        // this.eventBus.addEventListener('parameterUpdated', this.handleParameterUpdate);
        
        console.log('👂 Event listeners set up');
    }
    
    /**
     * Handle state change events from HomeMaster
     */
    handleStateChange(stateChangeData) {
        const { newState, stateDefinition } = stateChangeData;
        
        console.log(`🎯 SystemController processing state change to: ${newState}`);
        
        // Update current state
        this.currentState = newState;
        
        // Update card visibility and positions based on state
        this.updateCardStatesFromHomeMaster();
        
        // Apply state-specific theming if needed
        if (stateDefinition.activeTheme) {
            this.applyStateTheme(stateDefinition.activeTheme);
        }
        
        // Emit system-level state change event
        this.eventBus.dispatchEvent(new CustomEvent('systemStateChanged', {
            detail: { newState, stateDefinition }
        }));
    }
    
    /**
     * Update card states based on HomeMaster active cards
     */
    updateCardStatesFromHomeMaster() {
        if (!this.homeMaster) return;
        
        const activeCards = this.homeMaster.getActiveCards();
        
        // Update all cards based on HomeMaster state
        const allCards = this.applicationContainer.querySelectorAll('.adaptive-card');
        allCards.forEach(cardElement => {
            const cardId = cardElement.id;
            const cardState = activeCards.get(cardId);
            
            if (cardState) {
                // Card is active - apply position and visibility
                cardElement.style.display = cardState.visible ? 'block' : 'none';
                cardElement.style.left = `${cardState.x}px`;
                cardElement.style.top = `${cardState.y}px`;
                cardElement.style.transform = `scale(${cardState.scale})`;
                cardElement.style.opacity = cardState.opacity;
                cardElement.classList.add('active');
            } else {
                // Card is not in current state - hide it
                cardElement.style.display = 'none';
                cardElement.classList.remove('active');
            }
        });
        
        console.log(`🃏 Updated ${allCards.length} cards based on HomeMaster state`);
    }
    
    /**
     * Apply theme from state
     */
    applyStateTheme(themeName) {
        const visualsConfig = this.jsonConfigSystem.getConfig('visuals');
        if (!visualsConfig || !visualsConfig.themes || !visualsConfig.themes[themeName]) {
            console.warn(`⚠️ Theme '${themeName}' not found`);
            return;
        }
        
        const theme = visualsConfig.themes[themeName];
        const root = document.documentElement;
        
        // Remove old theme classes
        this.applicationContainer.classList.forEach(className => {
            if (className.startsWith('theme-')) {
                this.applicationContainer.classList.remove(className);
            }
        });
        
        // Apply new theme
        Object.entries(theme).forEach(([property, value]) => {
            const cssProperty = `--vib34d-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssProperty, value);
        });
        
        this.applicationContainer.classList.add(`theme-${themeName}`);
        
        console.log(`🎨 Applied state theme: ${themeName}`);
    }
    
    /**
     * Handle navigation requests (Phase 3)
     */
    handleNavigationRequest(event) {
        // This method is now handled by InteractionCoordinator
        console.log('🧭 Navigation request (deprecated - use HomeMaster):', event);
    }
    
    /**
     * Handle parameter updates (Phase 4)
     */
    handleParameterUpdate(event) {
        // TODO: Phase 4 implementation
        console.log('🎛️ Parameter update:', event);
    }
    
    /**
     * Start the main render loop
     */
    startRenderLoop() {
        console.log('🔄 Starting render loop...');
        
        this.renderFrame();
    }
    
    /**
     * Main render loop function
     */
    renderFrame(timestamp = performance.now()) {
        // Calculate frame timing
        const deltaTime = timestamp - this.performanceMetrics.lastFrameTime;
        this.performanceMetrics.lastFrameTime = timestamp;
        this.performanceMetrics.frameCount++;
        
        // Calculate average FPS every 60 frames
        if (this.performanceMetrics.frameCount % 60 === 0) {
            this.performanceMetrics.averageFPS = 1000 / deltaTime;
        }
        
        // Emit render frame event for modules to hook into
        this.eventBus.dispatchEvent(new CustomEvent('renderFrame', {
            detail: {
                time: timestamp,
                deltaTime: deltaTime,
                frameCount: this.performanceMetrics.frameCount
            }
        }));
        
        // Phase 2+ - Visualizer pool handles its own render loop
        // The VisualizerPool now manages its own render loop independently
        
        // Continue the loop
        requestAnimationFrame(this.renderFrame);
    }
    
    /**
     * Navigate to a new state (Phase 3)
     */
    async navigateTo(stateId) {
        console.log(`🧭 SystemController navigating to state: ${stateId}`);
        
        if (!this.homeMaster) {
            console.warn('⚠️ HomeMaster not available for navigation');
            return false;
        }
        
        if (this.isTransitioning) {
            console.warn('⚠️ Already transitioning, ignoring navigation request');
            return false;
        }
        
        // Delegate to HomeMaster
        return await this.homeMaster.navigateTo(stateId);
    }
    
    /**
     * Get current system state
     */
    getSystemState() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            currentState: this.currentState,
            isTransitioning: this.isTransitioning,
            performanceMetrics: { ...this.performanceMetrics },
            moduleStatus: {
                jsonConfigSystem: !!this.jsonConfigSystem?.isInitialized,
                homeMaster: !!this.homeMaster?.isInitialized,
                visualizerPool: !!this.visualizerPool?.isInitialized,
                interactionCoordinator: !!this.interactionCoordinator?.isInitialized,
                geometryRegistry: !!this.geometryRegistry?.isInitialized,
                agentAPI: !!this.agentAPI?.isInitialized
            }
        };
    }
    
    /**
     * Hot-reload a configuration
     */
    async hotReloadConfig(configType, newConfig) {
        if (!this.jsonConfigSystem) {
            throw new Error('JsonConfigSystem not initialized');
        }
        
        return await this.jsonConfigSystem.updateConfig(configType, newConfig);
    }
    
    /**
     * Shutdown the system
     */
    shutdown() {
        console.log('⏹️ SystemController shutdown initiated...');
        
        // Cleanup modules
        if (this.agentAPI) {
            // Clear global reference
            window.agentAPI = null;
            this.agentAPI.isReady = false;
        }
        if (this.interactionCoordinator) {
            this.interactionCoordinator.shutdown();
        }
        if (this.homeMaster) {
            this.homeMaster.shutdown();
        }
        if (this.visualizerPool) {
            this.visualizerPool.shutdown();
        }
        if (this.geometryRegistry) {
            // GeometryRegistry doesn't need explicit shutdown
        }
        
        // Clear event listeners
        this.eventBus.removeEventListener('configLoaded', this.handleConfigLoaded);
        this.eventBus.removeEventListener('configUpdated', this.handleConfigUpdated);
        
        this.isInitialized = false;
        console.log('✅ SystemController shutdown complete');
    }
    
    /**
     * Reapply theming after visuals config update
     */
    reapplyTheming(visualsConfig) {
        console.log('🔄 Reapplying theming...');
        this.applyBasicTheming({ visuals: visualsConfig });
    }
    
    /**
     * Reinitialize layout after layout config update
     */
    reinitializeLayout(layoutConfig) {
        console.log('🔄 Reinitializing layout...');
        this.initializeStaticLayout({ layout: layoutConfig });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystemController;
} else {
    window.SystemController = SystemController;
}

console.log('🎛️ SystemController loaded - Main orchestrator ready');