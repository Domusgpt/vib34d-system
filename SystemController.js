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
            
            // Step 3: Set up event listeners
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
            this.jsonConfigSystem.eventBus.addEventListener('configLoaded', this.handleConfigLoaded.bind(this));
            this.jsonConfigSystem.eventBus.addEventListener('configUpdated', this.handleConfigUpdated.bind(this));
            
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
        
        // NOW initialize core modules after layout is created
        this.initializeCoreModules();
        
        // Register Enhanced Geometries if available
        if (this.geometryRegistry) {
            if (this.geometryRegistry.registerElegantGeometry) {
                console.log('✨ Registering Elegant Visual Core...');
                this.geometryRegistry.registerElegantGeometry();
            }
            if (this.geometryRegistry.registerMVEPGeometry) {
                console.log('🚀 Registering MVEP Enhanced Geometry...');
                this.geometryRegistry.registerMVEPGeometry();
            }
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
                this.createNavContainer(element, componentConfig.content);
                break;
            case 'ParamPanel':
                this.createParamPanel(element, componentConfig.content);
                break;
            case 'VisualizerPanel':
                this.createVisualizerPanel(element, componentConfig.content);
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
     * Create navigation container with buttons
     */
    createNavContainer(element, content) {
        const nav = document.createElement('nav');
        nav.className = 'vib34d-nav';
        
        const title = document.createElement('h2');
        title.textContent = content.title || 'Navigation';
        title.className = 'nav-title';
        nav.appendChild(title);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'nav-buttons';
        
        if (content.buttons) {
            content.buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.id = buttonConfig.id;
                button.className = 'nav-button';
                button.textContent = buttonConfig.label;
                button.setAttribute('data-action', buttonConfig.action);
                
                // Add click handler for navigation
                button.addEventListener('click', () => {
                    if (buttonConfig.action.includes('navigateTo')) {
                        const state = buttonConfig.action.match(/navigateTo\('(.+)'\)/)?.[1];
                        if (state && this.homeMaster) {
                            this.homeMaster.navigateTo(state);
                        }
                    }
                });
                
                buttonContainer.appendChild(button);
            });
        }
        
        nav.appendChild(buttonContainer);
        element.appendChild(nav);
    }
    
    /**
     * Create parameter panel with sliders
     */
    createParamPanel(element, content) {
        const panel = document.createElement('div');
        panel.className = 'param-panel';
        
        const title = document.createElement('h3');
        title.textContent = content.title || 'Parameters';
        title.className = 'panel-title';
        panel.appendChild(title);
        
        if (content.sliders) {
            content.sliders.forEach(sliderConfig => {
                const sliderContainer = document.createElement('div');
                sliderContainer.className = 'param-control';
                
                const label = document.createElement('label');
                label.textContent = sliderConfig.label;
                label.className = 'param-label';
                sliderContainer.appendChild(label);
                
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.className = 'param-slider';
                slider.min = sliderConfig.min;
                slider.max = sliderConfig.max;
                slider.step = sliderConfig.step;
                slider.value = sliderConfig.min + (sliderConfig.max - sliderConfig.min) / 2;
                slider.setAttribute('data-param', sliderConfig.param);
                
                const valueDisplay = document.createElement('span');
                valueDisplay.className = 'param-value';
                valueDisplay.textContent = slider.value;
                
                // Add input handler
                slider.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    valueDisplay.textContent = value.toFixed(2);
                    
                    // Update parameter via HomeMaster
                    if (this.homeMaster) {
                        this.homeMaster.updateGlobalParameter(sliderConfig.param, value);
                    }
                });
                
                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(valueDisplay);
                panel.appendChild(sliderContainer);
            });
        }
        
        element.appendChild(panel);
    }
    
    /**
     * Create visualizer panel with geometry selector
     */
    createVisualizerPanel(element, content) {
        const panel = document.createElement('div');
        panel.className = 'visualizer-panel';
        
        const title = document.createElement('h3');
        title.textContent = content.title || 'Visualizer';
        title.className = 'panel-title';
        panel.appendChild(title);
        
        if (content.geometrySelector) {
            const selectorContainer = document.createElement('div');
            selectorContainer.className = 'geometry-selector-container';
            
            const label = document.createElement('label');
            label.textContent = 'Geometry:';
            label.className = 'selector-label';
            selectorContainer.appendChild(label);
            
            const selector = document.createElement('select');
            selector.className = 'geometry-selector';
            
            const geometries = ['hypercube', 'tetrahedron', 'sphere', 'torus', 'klein', 'fractal', 'wave', 'crystal'];
            geometries.forEach(geometry => {
                const option = document.createElement('option');
                option.value = geometry;
                option.textContent = geometry.charAt(0).toUpperCase() + geometry.slice(1);
                selector.appendChild(option);
            });
            
            // Add change handler
            selector.addEventListener('change', (e) => {
                console.log(`🎮 Geometry changed to: ${e.target.value}`);
                // TODO: Update active card geometry
            });
            
            selectorContainer.appendChild(selector);
            panel.appendChild(selectorContainer);
        }
        
        element.appendChild(panel);
    }
    
    /**
     * Create an adaptive card from layout configuration with holographic effects
     */
    createAdaptiveCard(cardConfig) {
        const cardElement = document.createElement('div');
        cardElement.id = cardConfig.id;
        cardElement.classList.add('vib34d-card', 'adaptive-card');
        
        // Apply role-based visual effects
        this.applyCardRole(cardElement, cardConfig.role || 'content');
        
        // Apply position
        if (cardConfig.position) {
            cardElement.style.left = `${cardConfig.position.x}px`;
            cardElement.style.top = `${cardConfig.position.y}px`;
            cardElement.style.position = 'absolute';
        }
        
        // Apply size
        if (cardConfig.size) {
            cardElement.style.width = `${cardConfig.size.width}px`;
            cardElement.style.height = `${cardConfig.size.height}px`;
        }
        
        // Add holographic and glitch effects
        this.addHolographicEffects(cardElement);
        this.addRGBGlitchBorder(cardElement);
        this.addSiliconGlassShadow(cardElement);
        
        // Create enhanced content with media support
        cardElement.innerHTML = this.createEnhancedContent(cardConfig);
        
        // Add universal accent geometry
        this.addUniversalAccent(cardElement, cardConfig.role);
        
        // Setup interaction choreography
        this.setupCardChoreography(cardElement);
        
        this.applicationContainer.appendChild(cardElement);
        console.log(`🃏 Created adaptive card: ${cardConfig.id} with geometry: ${cardConfig.geometry}`);
    }
    
    /**
     * Apply role-based visual styling
     */
    applyCardRole(card, role) {
        const roleClasses = {
            content: 'grid-density-stage-2',
            shadow: 'grid-density-stage-1', 
            background: 'grid-density-stage-1',
            highlight: 'grid-density-stage-3',
            accent: 'grid-density-stage-4',
            bezel: 'grid-density-stage-5'
        };
        
        if (roleClasses[role]) {
            card.classList.add(roleClasses[role]);
        }
        
        console.log(`🎭 Applied role '${role}' to card`);
    }
    
    /**
     * Add holographic parallax effects
     */
    addHolographicEffects(card) {
        const holographicLayer = document.createElement('div');
        holographicLayer.className = 'holographic-layer';
        card.appendChild(holographicLayer);
        
        // Mouse tracking for parallax
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            holographicLayer.style.setProperty('--mouse-x', `${x}%`);
            holographicLayer.style.setProperty('--mouse-y', `${y}%`);
        });
    }
    
    /**
     * Add RGB glitch border effects
     */
    addRGBGlitchBorder(card) {
        card.classList.add('rgb-glitch-border');
    }
    
    /**
     * Add silicon glass shadow effects  
     */
    addSiliconGlassShadow(card) {
        card.classList.add('silicon-glass-shadow');
    }
    
    /**
     * Add universal accent geometry
     */
    addUniversalAccent(card, role) {
        if (role === 'accent' || role === 'highlight') {
            const accent = document.createElement('div');
            accent.className = 'universal-accent';
            
            // Random positioning for organic feel
            const size = 20 + Math.random() * 40;
            const x = Math.random() * 80;
            const y = Math.random() * 80;
            
            accent.style.width = `${size}px`;
            accent.style.height = `${size}px`;
            accent.style.left = `${x}%`;
            accent.style.top = `${y}%`;
            
            card.appendChild(accent);
        }
    }
    
    /**
     * Create enhanced content with media support
     */
    createEnhancedContent(cardConfig) {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="card-background">
                <canvas class="card-visualizer" data-geometry="${cardConfig.geometry || 'hypercube'}"></canvas>
            </div>
            <div class="card-content enhanced-content">
                <h3 class="card-title">${cardConfig.title || 'Untitled'}</h3>
                <div class="card-body content-text-reader">
                    ${cardConfig.content || '<p>Card content</p>'}
                </div>
            </div>
        `;
        
        const content = container.querySelector('.card-content');
        
        // Add media elements based on card type
        this.addMediaElements(content, cardConfig);
        
        return container.innerHTML;
    }
    
    /**
     * Add media elements to content
     */
    addMediaElements(content, cardConfig) {
        const cardType = cardConfig.geometry;
        
        // Add different media types based on geometry
        switch (cardType) {
            case 'mvep-enhanced':
                this.addVideoPlayer(content, 'demo-hypercube.mp4');
                this.addAudioPlayer(content, 'ambient-4d.mp3');
                break;
            case 'sphere':
                this.addAudioPlayer(content, 'quantum-harmonics.mp3');
                break;
            case 'torus':
                this.addVideoPlayer(content, 'toroidal-flow.mp4');
                break;
            case 'fractal':
                this.addAudioPlayer(content, 'fractal-patterns.mp3');
                break;
        }
    }
    
    /**
     * Add video player
     */
    addVideoPlayer(content, src) {
        const video = document.createElement('video');
        video.className = 'content-video-player';
        video.controls = true;
        video.muted = true;
        video.loop = true;
        video.poster = 'placeholder-video.jpg';
        
        // Placeholder source
        video.innerHTML = `<source src="${src}" type="video/mp4">Your browser does not support video.`;
        
        content.appendChild(video);
        
        // Add unique reaction
        video.addEventListener('play', () => {
            content.parentElement.style.filter = 'hue-rotate(30deg) brightness(1.2)';
        });
        
        video.addEventListener('pause', () => {
            content.parentElement.style.filter = '';
        });
    }
    
    /**
     * Add audio player
     */
    addAudioPlayer(content, src) {
        const audio = document.createElement('audio');
        audio.className = 'content-audio-player';
        audio.controls = true;
        audio.loop = true;
        
        // Placeholder source
        audio.innerHTML = `<source src="${src}" type="audio/mp3">Your browser does not support audio.`;
        
        content.appendChild(audio);
        
        // Add unique reaction
        audio.addEventListener('play', () => {
            content.parentElement.style.animation = 'accentPulse 2s ease-in-out infinite';
        });
        
        audio.addEventListener('pause', () => {
            content.parentElement.style.animation = '';
        });
    }
    
    /**
     * Setup interaction choreography
     */
    setupCardChoreography(card) {
        // Add cards container class to parent for CSS selectors
        if (!this.applicationContainer.classList.contains('cards-container')) {
            this.applicationContainer.classList.add('cards-container');
        }
        
        // Release choreography
        card.addEventListener('mouseup', () => {
            card.classList.add('releasing');
            setTimeout(() => {
                card.classList.remove('releasing');
            }, 1200);
        });
        
        card.addEventListener('touchend', () => {
            card.classList.add('releasing');
            setTimeout(() => {
                card.classList.remove('releasing');
            }, 1200);
        });
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