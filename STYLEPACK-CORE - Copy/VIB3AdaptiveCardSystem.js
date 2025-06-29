/**
 * VIB3AdaptiveCardSystem.js - JSON-Driven Adaptive Card Management
 * 
 * Modular system for creating and managing adaptive 4D visualization cards
 * based on JSON configuration. Integrates with VIB3HomeMaster parameter web
 * and supports real-time editor functionality.
 */

class VIB3AdaptiveCardSystem {
    constructor(configSystem, homeMaster, reactivityBridge) {
        this.version = '3.0.0';
        this.configSystem = configSystem;
        this.homeMaster = homeMaster;
        this.reactivityBridge = reactivityBridge;
        
        // Card management
        this.cardInstances = new Map();
        this.cardConfigurations = new Map();
        this.activeCards = new Set();
        
        // Master-derivative calculation engine
        this.parameterDerivationEngine = new VIB3ParameterDerivationEngine();
        
        // Card creation templates
        this.cardTemplates = new Map();
        
        // Performance tracking
        this.performanceMetrics = {
            cardsCreated: 0,
            cardsActive: 0,
            parameterUpdatesPerSecond: 0,
            memoryUsage: 0
        };
        
        console.log('🎴 VIB3AdaptiveCardSystem initialized');
    }
    
    /**
     * Initialize adaptive card system
     */
    async initialize() {
        // Load dashboard configuration
        const dashboardConfig = this.configSystem.getConfig('dashboard', 'editorDashboard');
        if (!dashboardConfig) {
            throw new Error('Dashboard configuration not found');
        }
        
        // Initialize card templates from configuration
        this.initializeCardTemplates(dashboardConfig.adaptiveCardConfig);
        
        // Setup parameter derivation engine
        this.initializeParameterDerivation(dashboardConfig.pageRelations);
        
        // Initialize workspace management
        this.initializeWorkspace(dashboardConfig.editorInterface);
        
        console.log('✅ VIB3AdaptiveCardSystem fully initialized');
        return this;
    }
    
    /**
     * Initialize card templates from JSON configuration
     */
    initializeCardTemplates(adaptiveCardConfig) {
        const { defaultSettings, geometrySpecificSettings } = adaptiveCardConfig;
        
        // Create default template
        this.cardTemplates.set('default', {
            ...defaultSettings,
            type: 'default',
            geometryType: 'adaptive'
        });
        
        // Create geometry-specific templates
        Object.entries(geometrySpecificSettings).forEach(([geometry, settings]) => {
            this.cardTemplates.set(geometry, {
                ...defaultSettings,
                ...settings,
                type: 'geometry-specific',
                geometryType: geometry
            });
        });
        
        console.log(`📋 Initialized ${this.cardTemplates.size} card templates`);
    }
    
    /**
     * Initialize parameter derivation engine
     */
    initializeParameterDerivation(pageRelations) {
        this.parameterDerivationEngine.configure(pageRelations);
        
        // Setup master-derivative relationships
        Object.entries(pageRelations).forEach(([pageId, pageConfig]) => {
            if (pageConfig.role === 'derivative') {
                this.parameterDerivationEngine.addDerivativeRelation(pageId, pageConfig);
            } else if (pageConfig.role === 'emergent') {
                this.parameterDerivationEngine.addEmergentRelation(pageId, pageConfig);
            }
        });
        
        console.log('🔗 Parameter derivation engine configured');
    }
    
    /**
     * Initialize workspace management
     */
    initializeWorkspace(editorInterface) {
        this.workspace = {
            container: null,
            panels: editorInterface.panels,
            shortcuts: editorInterface.keyboardShortcuts,
            contextMenus: editorInterface.contextMenus,
            activeSelections: new Set(),
            clipboard: null
        };
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup context menus
        this.setupContextMenus();
        
        console.log('🖥️ Workspace management initialized');
    }
    
    /**
     * Create adaptive card with specified configuration
     */
    createAdaptiveCard(cardConfig) {
        const cardId = cardConfig.id || `adaptive-card-${Date.now()}`;
        
        // Get appropriate template
        const template = this.getCardTemplate(cardConfig.geometry || 'default');
        
        // Create card configuration
        const fullConfig = this.mergeCardConfiguration(template, cardConfig);
        
        // Create visualizer instance
        const visualizer = new AdaptiveCardVisualizer(fullConfig.container, {
            id: cardId,
            geometry: fullConfig.geometryType,
            parameters: fullConfig.preferredParameters || {},
            visualStyle: fullConfig.visualStyle || {},
            editorMode: true,
            onParameterChange: (param, value) => this.handleParameterChange(cardId, param, value),
            onSelect: () => this.selectCard(cardId),
            onDelete: () => this.deleteCard(cardId)
        });
        
        // Register with parameter web
        this.homeMaster.registerElement(cardId, 'adaptive-card', fullConfig);
        
        // Store card instance and configuration
        this.cardInstances.set(cardId, visualizer);
        this.cardConfigurations.set(cardId, fullConfig);
        this.activeCards.add(cardId);
        
        // Apply master-derivative relationships if applicable
        this.applyParameterDerivation(cardId, fullConfig);
        
        // Update performance metrics
        this.performanceMetrics.cardsCreated++;
        this.performanceMetrics.cardsActive = this.activeCards.size;
        
        console.log(`🎴 Created adaptive card: ${cardId} (${fullConfig.geometryType})`);
        return visualizer;
    }
    
    /**
     * Get appropriate card template
     */
    getCardTemplate(geometryType) {
        return this.cardTemplates.get(geometryType) || this.cardTemplates.get('default');
    }
    
    /**
     * Merge card configuration with template
     */
    mergeCardConfiguration(template, userConfig) {
        return {
            ...template,
            ...userConfig,
            id: userConfig.id || `card-${Date.now()}`,
            preferredParameters: {
                ...template.preferredParameters,
                ...userConfig.parameters
            },
            visualStyle: {
                ...template.visualStyle,
                ...userConfig.visualStyle
            }
        };
    }
    
    /**
     * Apply parameter derivation based on master-derivative relationships
     */
    applyParameterDerivation(cardId, cardConfig) {
        const derivedParameters = this.parameterDerivationEngine.calculateDerivedParameters(
            cardConfig,
            this.homeMaster.globalParameters
        );
        
        if (derivedParameters && Object.keys(derivedParameters).length > 0) {
            const visualizer = this.cardInstances.get(cardId);
            if (visualizer) {
                visualizer.updateParameters(derivedParameters);
            }
            
            console.log(`🔗 Applied parameter derivation to ${cardId}:`, derivedParameters);
        }
    }
    
    /**
     * Handle parameter change from card
     */
    handleParameterChange(cardId, parameter, value) {
        const cardConfig = this.cardConfigurations.get(cardId);
        if (!cardConfig) return;
        
        // Update local configuration
        if (!cardConfig.currentParameters) {
            cardConfig.currentParameters = {};
        }
        cardConfig.currentParameters[parameter] = value;
        
        // Propagate through parameter web if applicable
        if (cardConfig.parameterLinking) {
            this.homeMaster.registerInteraction('parameterChange', cardId, 0.8, {
                parameter: parameter,
                value: value,
                source: 'adaptive-card'
            });
        }
        
        // Update derived parameters for other cards
        this.updateDerivedCards(cardId, parameter, value);
        
        // Trigger reactivity bridge updates
        if (this.reactivityBridge) {
            this.reactivityBridge.triggerReaction('parameterCascade', {
                source: cardId,
                parameter: parameter,
                value: value,
                cardType: 'adaptive'
            });
        }
        
        console.log(`🎛️ Parameter changed in ${cardId}: ${parameter} = ${value}`);
    }
    
    /**
     * Update derived cards when master parameters change
     */
    updateDerivedCards(masterCardId, parameter, value) {
        const masterConfig = this.cardConfigurations.get(masterCardId);
        if (!masterConfig || masterConfig.role !== 'master') return;
        
        // Find derivative cards
        this.cardConfigurations.forEach((config, cardId) => {
            if (config.role === 'derivative' && cardId !== masterCardId) {
                const derivedValue = this.parameterDerivationEngine.calculateSingleDerivation(
                    parameter,
                    value,
                    config.derivationFormula
                );
                
                if (derivedValue !== null) {
                    const visualizer = this.cardInstances.get(cardId);
                    if (visualizer) {
                        visualizer.updateParameter(parameter, derivedValue);
                    }
                }
            }
        });
    }
    
    /**
     * Select card(s) for editing
     */
    selectCard(cardId, multiSelect = false) {
        if (!multiSelect) {
            this.workspace.activeSelections.clear();
        }
        
        this.workspace.activeSelections.add(cardId);
        
        // Update visual selection indicators
        this.updateSelectionVisuals();
        
        // Update property editor
        this.updatePropertyEditor();
        
        console.log(`🎯 Selected card: ${cardId}`);
    }
    
    /**
     * Delete card
     */
    deleteCard(cardId) {
        const visualizer = this.cardInstances.get(cardId);
        if (visualizer) {
            // Cleanup visualizer
            visualizer.destroy();
            
            // Remove from parameter web
            if (this.homeMaster.elementRegistry) {
                this.homeMaster.elementRegistry.delete(cardId);
            }
            
            // Remove from internal tracking
            this.cardInstances.delete(cardId);
            this.cardConfigurations.delete(cardId);
            this.activeCards.delete(cardId);
            this.workspace.activeSelections.delete(cardId);
            
            // Update performance metrics
            this.performanceMetrics.cardsActive = this.activeCards.size;
            
            console.log(`🗑️ Deleted adaptive card: ${cardId}`);
        }
    }
    
    /**
     * Duplicate selected card(s)
     */
    duplicateSelectedCards() {
        const duplicated = [];
        
        this.workspace.activeSelections.forEach(cardId => {
            const config = this.cardConfigurations.get(cardId);
            if (config) {
                const duplicateConfig = {
                    ...config,
                    id: `${cardId}-copy-${Date.now()}`,
                    position: {
                        x: (config.position?.x || 0) + 50,
                        y: (config.position?.y || 0) + 50
                    }
                };
                
                const newCard = this.createAdaptiveCard(duplicateConfig);
                duplicated.push(duplicateConfig.id);
            }
        });
        
        // Select duplicated cards
        this.workspace.activeSelections.clear();
        duplicated.forEach(cardId => this.workspace.activeSelections.add(cardId));
        this.updateSelectionVisuals();
        
        console.log(`📋 Duplicated ${duplicated.length} cards`);
        return duplicated;
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const shortcut = this.getKeyboardShortcut(e);
            const action = this.workspace.shortcuts[shortcut];
            
            if (action && this.workspace.activeSelections.size > 0) {
                e.preventDefault();
                this.executeShortcutAction(action);
            }
        });
    }
    
    /**
     * Get keyboard shortcut string from event
     */
    getKeyboardShortcut(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.shiftKey) parts.push('Shift');
        if (event.altKey) parts.push('Alt');
        parts.push(event.key);
        return parts.join('+');
    }
    
    /**
     * Execute shortcut action
     */
    executeShortcutAction(action) {
        switch (action) {
            case 'duplicateElement':
                this.duplicateSelectedCards();
                break;
            case 'deleteElement':
                this.workspace.activeSelections.forEach(cardId => this.deleteCard(cardId));
                break;
            case 'undo':
                this.performUndo();
                break;
            case 'redo':
                this.performRedo();
                break;
            case 'saveConfiguration':
                this.saveConfiguration();
                break;
            case 'loadConfiguration':
                this.loadConfiguration();
                break;
            default:
                console.log(`🎹 Shortcut action: ${action}`);
        }
    }
    
    /**
     * Setup context menus
     */
    setupContextMenus() {
        // Context menu for canvas elements
        document.addEventListener('contextmenu', (e) => {
            const cardElement = e.target.closest('.adaptive-card-container');
            if (cardElement) {
                e.preventDefault();
                this.showContextMenu(e, 'canvasElement', cardElement.dataset.cardId);
            }
        });
    }
    
    /**
     * Show context menu
     */
    showContextMenu(event, menuType, cardId = null) {
        const menuConfig = this.workspace.contextMenus[menuType];
        if (!menuConfig) return;
        
        // Create context menu element
        const menu = this.createContextMenuElement(menuConfig, cardId);
        
        // Position menu
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        
        // Add to document
        document.body.appendChild(menu);
        
        // Setup close handlers
        const closeMenu = () => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        };
        
        document.addEventListener('click', closeMenu, { once: true });
        document.addEventListener('contextmenu', closeMenu, { once: true });
    }
    
    /**
     * Create context menu element
     */
    createContextMenuElement(menuConfig, cardId) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 200px;
            backdrop-filter: blur(10px);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        `;
        
        menuConfig.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 4px 0;
                `;
                menu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                menuItem.textContent = item.label;
                menuItem.style.cssText = `
                    padding: 8px 16px;
                    cursor: pointer;
                    color: #ffffff;
                    transition: background-color 0.2s;
                `;
                
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.backgroundColor = 'rgba(255, 0, 255, 0.2)';
                });
                
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.backgroundColor = '';
                });
                
                menuItem.addEventListener('click', () => {
                    this.executeContextMenuAction(item.action, cardId);
                });
                
                menu.appendChild(menuItem);
            }
        });
        
        return menu;
    }
    
    /**
     * Execute context menu action
     */
    executeContextMenuAction(action, cardId) {
        switch (action) {
            case 'duplicateElement':
                if (cardId) {
                    this.selectCard(cardId);
                    this.duplicateSelectedCards();
                }
                break;
            case 'deleteElement':
                if (cardId) {
                    this.deleteCard(cardId);
                }
                break;
            case 'openPropertyEditor':
                if (cardId) {
                    this.selectCard(cardId);
                    this.openPropertyEditor(cardId);
                }
                break;
            default:
                console.log(`📋 Context menu action: ${action} for card: ${cardId}`);
        }
    }
    
    /**
     * Update selection visuals
     */
    updateSelectionVisuals() {
        // Clear all selection indicators
        document.querySelectorAll('.adaptive-card-container').forEach(element => {
            element.classList.remove('selected');
        });
        
        // Add selection indicators to active selections
        this.workspace.activeSelections.forEach(cardId => {
            const element = document.querySelector(`[data-card-id="${cardId}"]`);
            if (element) {
                element.classList.add('selected');
            }
        });
    }
    
    /**
     * Update property editor with selected card properties
     */
    updatePropertyEditor() {
        if (this.workspace.activeSelections.size === 1) {
            const cardId = Array.from(this.workspace.activeSelections)[0];
            const config = this.cardConfigurations.get(cardId);
            if (config) {
                this.openPropertyEditor(cardId);
            }
        }
    }
    
    /**
     * Open property editor for specific card
     */
    openPropertyEditor(cardId) {
        const config = this.cardConfigurations.get(cardId);
        const visualizer = this.cardInstances.get(cardId);
        
        if (config && visualizer) {
            // Trigger property editor update event
            document.dispatchEvent(new CustomEvent('vib3-property-editor-update', {
                detail: {
                    cardId: cardId,
                    config: config,
                    visualizer: visualizer,
                    currentParameters: config.currentParameters || {}
                }
            }));
        }
    }
    
    /**
     * Get system statistics
     */
    getSystemStatistics() {
        return {
            cardsActive: this.activeCards.size,
            cardsSelected: this.workspace.activeSelections.size,
            templatesLoaded: this.cardTemplates.size,
            memoryUsage: this.performanceMetrics.memoryUsage,
            parameterWebConnections: this.homeMaster ? this.homeMaster.elementRegistry.size : 0,
            derivativeRelations: this.parameterDerivationEngine.getRelationCount()
        };
    }
}

/**
 * VIB3ParameterDerivationEngine - Handles master-derivative parameter calculations
 */
class VIB3ParameterDerivationEngine {
    constructor() {
        this.masterPage = null;
        this.derivativeRelations = new Map();
        this.emergentRelations = new Map();
    }
    
    /**
     * Configure derivation engine with page relations
     */
    configure(pageRelations) {
        Object.entries(pageRelations).forEach(([pageId, pageConfig]) => {
            if (pageConfig.role === 'master') {
                this.masterPage = { id: pageId, config: pageConfig };
            }
        });
    }
    
    /**
     * Add derivative relation
     */
    addDerivativeRelation(pageId, pageConfig) {
        this.derivativeRelations.set(pageId, pageConfig);
    }
    
    /**
     * Add emergent relation
     */
    addEmergentRelation(pageId, pageConfig) {
        this.emergentRelations.set(pageId, pageConfig);
    }
    
    /**
     * Calculate derived parameters based on master
     */
    calculateDerivedParameters(cardConfig, masterParameters) {
        if (!cardConfig.derivationFormula) return null;
        
        const derived = {};
        const formula = cardConfig.derivationFormula;
        
        Object.entries(formula).forEach(([param, expression]) => {
            try {
                const value = this.evaluateDerivationExpression(expression, masterParameters);
                derived[param] = value;
            } catch (error) {
                console.warn(`Failed to derive ${param}:`, error);
            }
        });
        
        return derived;
    }
    
    /**
     * Calculate single parameter derivation
     */
    calculateSingleDerivation(parameter, masterValue, derivationFormula) {
        if (!derivationFormula || !derivationFormula[parameter]) return null;
        
        try {
            return this.evaluateDerivationExpression(
                derivationFormula[parameter], 
                { [parameter]: masterValue }
            );
        } catch (error) {
            console.warn(`Failed to derive ${parameter}:`, error);
            return null;
        }
    }
    
    /**
     * Evaluate derivation expression
     */
    evaluateDerivationExpression(expression, masterParameters) {
        // Simple expression evaluator for mathematical relationships
        // Replace with more sophisticated parser if needed
        
        if (typeof expression === 'string') {
            // Handle simple mathematical expressions
            let result = expression;
            
            // Replace master parameter references
            Object.entries(masterParameters).forEach(([param, value]) => {
                const regex = new RegExp(`master\\.${param}`, 'g');
                result = result.replace(regex, value.toString());
            });
            
            // Evaluate mathematical expression
            try {
                return Function(`"use strict"; return (${result})`)();
            } catch (error) {
                console.warn(`Expression evaluation failed: ${result}`, error);
                return 0;
            }
        }
        
        return expression;
    }
    
    /**
     * Get relation count
     */
    getRelationCount() {
        return this.derivativeRelations.size + this.emergentRelations.size;
    }
}

// Export for global access
window.VIB3AdaptiveCardSystem = VIB3AdaptiveCardSystem;
window.VIB3ParameterDerivationEngine = VIB3ParameterDerivationEngine;

console.log('🎴 VIB3AdaptiveCardSystem loaded - JSON-driven adaptive cards ready');