/**
 * VIB3EditorDashboard.js - Real-Time Configuration Interface
 * 
 * Builds and manages the JSON-driven editor interface for real-time
 * parameter manipulation, adaptive card creation, and system monitoring.
 */

class VIB3EditorDashboard {
    constructor(configSystem, homeMaster, reactivityBridge, adaptiveCardSystem, interactionEngine) {
        this.version = '3.0.0';
        this.configSystem = configSystem;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        this.adaptiveCardSystem = adaptiveCardSystem;
        this.interactionEngine = interactionEngine;
        
        // Dashboard state
        this.isInitialized = false;
        this.panels = new Map();
        this.controls = new Map();
        this.isVisible = true;
        
        // Real-time monitoring
        this.monitoringInterval = null;
        this.updateFrequency = 60; // 60fps for smooth real-time updates
        
        // Panel configuration
        this.panelConfig = null;
        this.masterControls = null;
        
        // UI state management
        this.uiState = {
            selectedCard: null,
            activePanel: 'masterControls',
            collapsedPanels: new Set(),
            dragState: null
        };
        
        console.log('🎛️ VIB3EditorDashboard initialized');
    }
    
    /**
     * Initialize editor dashboard with JSON configuration
     */
    async initialize() {
        // Load dashboard configuration
        const dashboardConfig = this.configSystem.getConfig('dashboard', 'editorDashboard');
        if (!dashboardConfig) {
            throw new Error('Dashboard configuration not found');
        }
        
        this.panelConfig = dashboardConfig.editorInterface;
        this.masterControls = dashboardConfig.masterControls;
        
        // Create dashboard container
        this.createDashboardContainer();
        
        // Build all panels from configuration
        await this.buildPanelsFromConfig();
        
        // Setup real-time monitoring
        this.startRealTimeMonitoring();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Subscribe to system events
        this.setupSystemSubscriptions();
        
        this.isInitialized = true;
        console.log('✅ VIB3EditorDashboard fully initialized');
        
        return this;
    }
    
    /**
     * Create main dashboard container
     */
    createDashboardContainer() {
        // Remove existing dashboard if present
        const existing = document.getElementById('vib3-editor-dashboard');
        if (existing) {
            existing.remove();
        }
        
        this.container = document.createElement('div');
        this.container.id = 'vib3-editor-dashboard';
        this.container.className = 'vib3-editor-dashboard';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10000;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            color: #ffffff;
        `;
        
        document.body.appendChild(this.container);
        
        console.log('📦 Dashboard container created');
    }
    
    /**
     * Build all panels from JSON configuration
     */
    async buildPanelsFromConfig() {
        const panels = this.panelConfig.panels;
        
        // Build master controls panel
        await this.buildMasterControlsPanel(panels.masterControls);
        
        // Build geometry selector panel
        await this.buildGeometrySelectorPanel(panels.geometrySelector);
        
        // Build property editor panel
        await this.buildPropertyEditorPanel(panels.propertyEditor);
        
        // Build visual workspace overlay
        await this.buildVisualWorkspaceOverlay(panels.visualWorkspace);
        
        console.log(`🏗️ Built ${this.panels.size} dashboard panels`);
    }
    
    /**
     * Build master controls panel
     */
    async buildMasterControlsPanel(panelConfig) {
        const panel = this.createPanel('masterControls', panelConfig);
        
        // Panel header
        const header = this.createPanelHeader('Master Controls', true);
        panel.appendChild(header);
        
        // Controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'master-controls-container';
        controlsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            padding: 16px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border-radius: 0 0 12px 12px;
        `;
        
        // Create controls from JSON configuration
        Object.entries(this.masterControls).forEach(([controlId, controlConfig]) => {
            const control = this.createMasterControl(controlId, controlConfig);
            controlsContainer.appendChild(control);
            this.controls.set(controlId, control);
        });
        
        panel.appendChild(controlsContainer);
        this.panels.set('masterControls', panel);
        
        console.log(`🎛️ Master controls panel built with ${Object.keys(this.masterControls).length} controls`);
    }
    
    /**
     * Create individual master control
     */
    createMasterControl(controlId, config) {
        const container = document.createElement('div');
        container.className = 'master-control';
        container.dataset.controlId = controlId;
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
        `;
        
        // Label
        const label = document.createElement('label');
        label.textContent = config.label;
        label.style.cssText = `
            font-weight: 600;
            font-size: 12px;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;
        container.appendChild(label);
        
        // Description
        if (config.description) {
            const description = document.createElement('div');
            description.textContent = config.description;
            description.style.cssText = `
                font-size: 11px;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.4;
                margin-bottom: 4px;
            `;
            container.appendChild(description);
        }
        
        // Control input
        const input = this.createControlInput(controlId, config);
        container.appendChild(input);
        
        // Value display
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'control-value-display';
        valueDisplay.style.cssText = `
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 11px;
            color: #00ffff;
            text-align: center;
            padding: 4px;
            background: rgba(0, 255, 255, 0.1);
            border-radius: 4px;
        `;
        valueDisplay.textContent = config.default.toFixed(3);
        container.appendChild(valueDisplay);
        
        // Hover effects
        container.addEventListener('mouseenter', () => {
            container.style.background = 'rgba(255, 0, 255, 0.1)';
            container.style.borderColor = 'rgba(255, 0, 255, 0.3)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.background = 'rgba(255, 255, 255, 0.05)';
            container.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        return container;
    }
    
    /**
     * Create control input based on type
     */
    createControlInput(controlId, config) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        
        if (config.type === 'slider') {
            // Custom slider with advanced styling
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = config.min;
            slider.max = config.max;
            slider.step = config.step || 0.01;
            slider.value = config.default;
            slider.className = 'master-control-slider';
            
            // Advanced slider styling
            slider.style.cssText = `
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(to right, 
                    rgba(255, 0, 255, 0.3) 0%, 
                    rgba(0, 255, 255, 0.3) 100%);
                outline: none;
                transition: all 0.3s ease;
                cursor: pointer;
            `;
            
            // Real-time value updates
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.updateMasterControl(controlId, value);
                
                // Update value display
                const valueDisplay = container.parentNode.querySelector('.control-value-display');
                if (valueDisplay) {
                    valueDisplay.textContent = value.toFixed(3);
                }
            });
            
            // Visual feedback
            slider.addEventListener('mousedown', () => {
                slider.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.5)';
            });
            
            slider.addEventListener('mouseup', () => {
                slider.style.boxShadow = 'none';
            });
            
            container.appendChild(slider);
        }
        
        return container;
    }
    
    /**
     * Build geometry selector panel
     */
    async buildGeometrySelectorPanel(panelConfig) {
        const panel = this.createPanel('geometrySelector', panelConfig);
        
        // Panel header
        const header = this.createPanelHeader('Sacred Geometries', true);
        panel.appendChild(header);
        
        // Geometry options container
        const geometryContainer = document.createElement('div');
        geometryContainer.className = 'geometry-selector-container';
        geometryContainer.style.cssText = `
            padding: 16px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            max-height: calc(100vh - 200px);
            overflow-y: auto;
        `;
        
        // Get geometry options from configuration
        const pageRelations = this.configSystem.getConfig('dashboard', 'editorDashboard.pageRelations');
        const visualizersConfig = pageRelations?.visualizers;
        
        if (visualizersConfig?.geometryOptions) {
            visualizersConfig.geometryOptions.forEach(geometry => {
                const geometryButton = this.createGeometryButton(geometry);
                geometryContainer.appendChild(geometryButton);
            });
        }
        
        panel.appendChild(geometryContainer);
        this.panels.set('geometrySelector', panel);
        
        console.log('📐 Geometry selector panel built');
    }
    
    /**
     * Create geometry selection button
     */
    createGeometryButton(geometry) {
        const button = document.createElement('button');
        button.className = 'geometry-button';
        button.dataset.geometry = geometry;
        button.textContent = geometry.charAt(0).toUpperCase() + geometry.slice(1);
        
        button.style.cssText = `
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: capitalize;
        `;
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(0, 255, 255, 0.2)';
            button.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            button.style.transform = 'translateX(4px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.05)';
            button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            button.style.transform = 'translateX(0)';
        });
        
        // Click handler - create new adaptive card
        button.addEventListener('click', () => {
            this.createAdaptiveCard(geometry);
        });
        
        return button;
    }
    
    /**
     * Build property editor panel
     */
    async buildPropertyEditorPanel(panelConfig) {
        const panel = this.createPanel('propertyEditor', panelConfig);
        
        // Panel header
        const header = this.createPanelHeader('Properties', true);
        panel.appendChild(header);
        
        // Properties container
        const propertiesContainer = document.createElement('div');
        propertiesContainer.className = 'properties-container';
        propertiesContainer.id = 'properties-container';
        propertiesContainer.style.cssText = `
            padding: 16px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            max-height: calc(100vh - 200px);
            overflow-y: auto;
        `;
        
        // Initially show "No selection" message
        const noSelectionMessage = document.createElement('div');
        noSelectionMessage.textContent = 'Select an element to edit properties';
        noSelectionMessage.style.cssText = `
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            padding: 40px 20px;
            font-style: italic;
        `;
        propertiesContainer.appendChild(noSelectionMessage);
        
        panel.appendChild(propertiesContainer);
        this.panels.set('propertyEditor', panel);
        
        console.log('🔧 Property editor panel built');
    }
    
    /**
     * Build visual workspace overlay
     */
    async buildVisualWorkspaceOverlay(panelConfig) {
        const overlay = document.createElement('div');
        overlay.className = 'visual-workspace-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 140px;
            left: 300px;
            right: 340px;
            bottom: 20px;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Grid overlay for snap-to-grid functionality
        const gridOverlay = this.createGridOverlay();
        overlay.appendChild(gridOverlay);
        
        // Selection indicators
        const selectionOverlay = this.createSelectionOverlay();
        overlay.appendChild(selectionOverlay);
        
        this.container.appendChild(overlay);
        this.panels.set('visualWorkspace', overlay);
        
        console.log('🖼️ Visual workspace overlay built');
    }
    
    /**
     * Create panel with positioning
     */
    createPanel(panelId, config) {
        const panel = document.createElement('div');
        panel.className = `vib3-panel vib3-panel-${panelId}`;
        panel.id = `vib3-panel-${panelId}`;
        panel.dataset.panelId = panelId;
        
        // Position based on configuration
        const position = this.calculatePanelPosition(config);
        panel.style.cssText = `
            position: absolute;
            ${position.css}
            pointer-events: auto;
            z-index: 100;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px 12px 0 0;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        this.container.appendChild(panel);
        return panel;
    }
    
    /**
     * Calculate panel position from configuration
     */
    calculatePanelPosition(config) {
        const { position, size } = config;
        
        switch (position) {
            case 'top-center':
                return {
                    css: `
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: ${size.width}px;
                        height: ${size.height}px;
                    `
                };
            case 'left-side':
                return {
                    css: `
                        top: 140px;
                        left: 20px;
                        width: ${size.width}px;
                        height: calc(100vh - 160px);
                    `
                };
            case 'right-side':
                return {
                    css: `
                        top: 140px;
                        right: 20px;
                        width: ${size.width}px;
                        height: calc(100vh - 160px);
                    `
                };
            default:
                return { css: 'top: 20px; left: 20px; width: 300px; height: 200px;' };
        }
    }
    
    /**
     * Create panel header with collapse functionality
     */
    createPanelHeader(title, collapsible = false) {
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2));
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: ${collapsible ? 'pointer' : 'default'};
        `;
        
        const titleElement = document.createElement('span');
        titleElement.textContent = title;
        header.appendChild(titleElement);
        
        if (collapsible) {
            const collapseIcon = document.createElement('span');
            collapseIcon.textContent = '−';
            collapseIcon.style.cssText = `
                font-size: 16px;
                font-weight: bold;
                transition: transform 0.3s ease;
            `;
            
            header.addEventListener('click', () => {
                this.togglePanelCollapse(header.parentNode);
            });
            
            header.appendChild(collapseIcon);
        }
        
        return header;
    }
    
    /**
     * Update master control value
     */
    async updateMasterControl(controlId, value) {
        try {
            await this.configSystem.updateMasterControl(controlId, value, 'editor-dashboard');
            
            // Visual feedback
            const control = this.controls.get(controlId);
            if (control) {
                control.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
                setTimeout(() => {
                    control.style.boxShadow = 'none';
                }, 300);
            }
            
            console.log(`🎛️ Master control ${controlId} updated: ${value}`);
            
        } catch (error) {
            console.error(`❌ Failed to update master control ${controlId}:`, error);
        }
    }
    
    /**
     * Create new adaptive card from geometry selection
     */
    createAdaptiveCard(geometry) {
        const cardConfig = {
            geometry: geometry,
            position: {
                x: Math.random() * 400 + 200,
                y: Math.random() * 300 + 150
            },
            id: `${geometry}-card-${Date.now()}`
        };
        
        if (this.adaptiveCardSystem) {
            const card = this.adaptiveCardSystem.createAdaptiveCard(cardConfig);
            
            // Visual feedback
            const button = document.querySelector(`[data-geometry="${geometry}"]`);
            if (button) {
                button.style.background = 'rgba(0, 255, 0, 0.3)';
                setTimeout(() => {
                    button.style.background = 'rgba(255, 255, 255, 0.05)';
                }, 500);
            }
            
            console.log(`🎴 Created adaptive card: ${geometry}`);
        }
    }
    
    /**
     * Start real-time monitoring and updates
     */
    startRealTimeMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 1000 / this.updateFrequency);
        
        console.log('📊 Real-time monitoring started');
    }
    
    /**
     * Update real-time data displays
     */
    updateRealTimeData() {
        // Update system statistics
        this.updateSystemStats();
        
        // Update parameter values from master controls
        this.updateMasterControlDisplays();
        
        // Update consciousness monitoring
        this.updateConsciousnessMonitor();
    }
    
    /**
     * Update system statistics displays
     */
    updateSystemStats() {
        const stats = {
            activeCards: this.adaptiveCardSystem?.getSystemStatistics()?.cardsActive || 0,
            systemLoad: this.homeMaster?.globalParameters?.systemLoad || 0,
            frameRate: this.homeMaster?.globalParameters?.frameRate || 0,
            interactions: this.interactionEngine?.getInteractionStatistics()?.eventsProcessed || 0
        };
        
        // Update stats in UI if stats panel exists
        this.updateStatsDisplay(stats);
    }
    
    /**
     * Setup event listeners for dashboard interactions
     */
    setupEventListeners() {
        // Listen for property editor updates
        document.addEventListener('vib3-property-editor-update', (event) => {
            this.updatePropertyEditor(event.detail);
        });
        
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        // Keyboard shortcuts for dashboard
        document.addEventListener('keydown', (event) => {
            this.handleDashboardKeyboard(event);
        });
    }
    
    /**
     * Setup system subscriptions
     */
    setupSystemSubscriptions() {
        // Subscribe to master control changes
        this.configSystem.subscribe('masterControlUpdated', (data) => {
            this.onMasterControlUpdated(data);
        });
        
        // Subscribe to card selection changes
        this.configSystem.subscribe('adaptiveCardCreated', (data) => {
            this.onCardCreated(data);
        });
        
        // Subscribe to interaction events
        this.configSystem.subscribe('interactionPresetChanged', (data) => {
            this.onInteractionPresetChanged(data);
        });
    }
    
    /**
     * Handle master control updates
     */
    onMasterControlUpdated(data) {
        const { controlId, value } = data;
        
        // Update control display
        const control = this.controls.get(controlId);
        if (control) {
            const slider = control.querySelector('input[type="range"]');
            const display = control.querySelector('.control-value-display');
            
            if (slider) slider.value = value;
            if (display) display.textContent = value.toFixed(3);
        }
    }
    
    /**
     * Toggle dashboard visibility
     */
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
        
        console.log(`👁️ Dashboard ${this.isVisible ? 'shown' : 'hidden'}`);
    }
    
    /**
     * Get dashboard state for export
     */
    getDashboardState() {
        return {
            version: this.version,
            isVisible: this.isVisible,
            uiState: this.uiState,
            panelStates: Array.from(this.panels.keys()).map(panelId => ({
                id: panelId,
                collapsed: this.uiState.collapsedPanels.has(panelId)
            })),
            controlValues: Array.from(this.controls.keys()).map(controlId => {
                const control = this.controls.get(controlId);
                const slider = control?.querySelector('input[type="range"]');
                return {
                    id: controlId,
                    value: slider ? parseFloat(slider.value) : null
                };
            })
        };
    }
    
    /**
     * Create grid overlay for workspace
     */
    createGridOverlay() {
        const grid = document.createElement('div');
        grid.className = 'grid-overlay';
        grid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
        `;
        return grid;
    }
    
    /**
     * Create selection overlay
     */
    createSelectionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'selection-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        `;
        return overlay;
    }
}

// Export for global access
window.VIB3EditorDashboard = VIB3EditorDashboard;

console.log('🎛️ VIB3EditorDashboard loaded - Real-time configuration interface ready');