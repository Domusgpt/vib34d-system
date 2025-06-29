/**
 * VIB3LayerManager.js - Comprehensive Layer and Z-Index Management
 * 
 * Handles all layer management, z-ordering, and card positioning to ensure
 * consistent behavior across the entire VIB3STYLEPACK system. Integrates
 * with the event-reaction manifest for proper layer reactions.
 */

class VIB3LayerManager {
    constructor(configSystem) {
        this.version = '3.0.0';
        this.configSystem = configSystem;
        
        // Layer configuration from event-reaction manifest
        this.layerHierarchy = null;
        this.layerRules = null;
        
        // Active layer state
        this.activeLayers = new Map();
        this.elementLayerMap = new Map(); // elementId -> layerInfo
        this.layerElementMap = new Map(); // layerId -> Set of elementIds
        
        // Z-index management
        this.baseZIndices = new Map();
        this.dynamicZIndexCounter = new Map();
        this.maxZIndexPerLayer = new Map();
        
        // Layer state tracking
        this.layerStates = new Map();
        this.disabledLayers = new Set();
        this.temporaryElevations = new Map();
        
        // Performance optimization
        this.batchedUpdates = new Set();
        this.updateScheduled = false;
        
        console.log('🎚️ VIB3LayerManager initialized');
    }
    
    /**
     * Initialize layer manager with manifest configuration
     */
    async initialize() {
        // Load event-reaction manifest
        const manifest = await this.loadEventReactionManifest();
        if (manifest) {
            this.layerHierarchy = manifest.layerManagement.layerHierarchy;
            this.layerRules = manifest.layerManagement.layerRules;
        }
        
        // Initialize layer structure
        this.initializeLayerStructure();
        
        // Setup event listeners for layer management
        this.setupEventListeners();
        
        // Create layer container elements
        this.createLayerContainers();
        
        console.log('✅ VIB3LayerManager fully initialized');
        return this;
    }
    
    /**
     * Load event-reaction manifest
     */
    async loadEventReactionManifest() {
        try {
            const response = await fetch('./config/event-reaction-manifest.json');
            if (!response.ok) {
                throw new Error(`Failed to load event-reaction manifest: ${response.status}`);
            }
            const manifest = await response.json();
            console.log('📋 Event-reaction manifest loaded');
            return manifest.eventReactionManifest;
        } catch (error) {
            console.error('❌ Failed to load event-reaction manifest:', error);
            return this.getDefaultManifest();
        }
    }
    
    /**
     * Initialize layer structure from configuration
     */
    initializeLayerStructure() {
        // Initialize base z-indices and layer maps
        Object.entries(this.layerHierarchy).forEach(([layerId, layerConfig]) => {
            this.baseZIndices.set(layerId, layerConfig.zIndex);
            this.dynamicZIndexCounter.set(layerId, layerConfig.zIndex);
            this.maxZIndexPerLayer.set(layerId, layerConfig.zIndex + 100); // Reserve 100 z-indices per layer
            this.layerElementMap.set(layerId, new Set());
            this.layerStates.set(layerId, {
                enabled: true,
                visible: layerConfig.alwaysVisible || true,
                interactive: layerConfig.interactive !== false
            });
        });
        
        console.log(`🎚️ Initialized ${this.activeLayers.size} layer hierarchies`);
    }
    
    /**
     * Create layer container elements in DOM
     */
    createLayerContainers() {
        const mainContainer = document.body;
        
        // Create layer containers in z-index order
        const sortedLayers = Object.entries(this.layerHierarchy)
            .sort(([,a], [,b]) => a.zIndex - b.zIndex);
        
        sortedLayers.forEach(([layerId, layerConfig]) => {
            const layerContainer = document.createElement('div');
            layerContainer.id = `vib3-layer-${layerId}`;
            layerContainer.className = `vib3-layer vib3-layer-${layerId}`;
            layerContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: ${layerConfig.zIndex};
                pointer-events: ${layerConfig.interactive === false ? 'none' : 'auto'};
                visibility: ${layerConfig.alwaysVisible === false ? 'hidden' : 'visible'};
            `;
            
            // Store layer metadata
            layerContainer.dataset.layerType = layerConfig.type;
            layerContainer.dataset.layerId = layerId;
            
            mainContainer.appendChild(layerContainer);
            this.activeLayers.set(layerId, {
                container: layerContainer,
                config: layerConfig,
                elements: new Set()
            });
        });
        
        console.log(`📦 Created ${sortedLayers.length} layer containers`);
    }
    
    /**
     * Register element in specific layer
     */
    registerElement(elementId, layerId = 'cardContent', element = null, options = {}) {
        if (!this.layerHierarchy[layerId]) {
            console.warn(`Layer not found: ${layerId}, using default`);
            layerId = 'cardContent';
        }
        
        // Remove from previous layer if exists
        this.unregisterElement(elementId);
        
        // Calculate z-index for element
        const zIndex = this.calculateElementZIndex(layerId, options.priority || 0);
        
        // Store element information
        const elementInfo = {
            elementId: elementId,
            layerId: layerId,
            zIndex: zIndex,
            element: element,
            priority: options.priority || 0,
            temporary: options.temporary || false,
            registeredAt: Date.now(),
            lastUpdate: Date.now()
        };
        
        this.elementLayerMap.set(elementId, elementInfo);
        this.layerElementMap.get(layerId).add(elementId);
        
        // Apply z-index to DOM element if provided
        if (element) {
            element.style.zIndex = zIndex;
            element.dataset.layerId = layerId;
            element.dataset.elementId = elementId;
            
            // Move to appropriate layer container
            const layerContainer = this.activeLayers.get(layerId).container;
            if (element.parentNode !== layerContainer) {
                layerContainer.appendChild(element);
            }
        }
        
        console.log(`🎚️ Registered element ${elementId} in layer ${layerId} (z-index: ${zIndex})`);
        return elementInfo;
    }
    
    /**
     * Unregister element from all layers
     */
    unregisterElement(elementId) {
        const elementInfo = this.elementLayerMap.get(elementId);
        if (elementInfo) {
            // Remove from layer element map
            const layerElements = this.layerElementMap.get(elementInfo.layerId);
            if (layerElements) {
                layerElements.delete(elementId);
            }
            
            // Remove from element layer map
            this.elementLayerMap.delete(elementId);
            
            // Clean up temporary elevations
            this.temporaryElevations.delete(elementId);
            
            console.log(`🗑️ Unregistered element ${elementId} from layer ${elementInfo.layerId}`);
        }
    }
    
    /**
     * Calculate z-index for element within layer
     */
    calculateElementZIndex(layerId, priority = 0) {
        const baseZIndex = this.baseZIndices.get(layerId);
        const currentCounter = this.dynamicZIndexCounter.get(layerId);
        const maxAllowed = this.maxZIndexPerLayer.get(layerId);
        
        // Calculate z-index based on priority and current counter
        let zIndex = baseZIndex + priority + 1;
        
        // Ensure we don't exceed layer maximum
        if (zIndex >= maxAllowed) {
            zIndex = maxAllowed - 1;
            console.warn(`Z-index capped at ${zIndex} for layer ${layerId}`);
        }
        
        // Update counter for next element
        this.dynamicZIndexCounter.set(layerId, Math.max(currentCounter, zIndex) + 1);
        
        return zIndex;
    }
    
    /**
     * Bring element to front of its layer
     */
    bringToFront(elementId) {
        const elementInfo = this.elementLayerMap.get(elementId);
        if (!elementInfo) {
            console.warn(`Element not found in layer manager: ${elementId}`);
            return false;
        }
        
        const layerId = elementInfo.layerId;
        const newZIndex = this.calculateElementZIndex(layerId, 50); // High priority
        
        // Update element info
        elementInfo.zIndex = newZIndex;
        elementInfo.lastUpdate = Date.now();
        
        // Apply to DOM element
        if (elementInfo.element) {
            elementInfo.element.style.zIndex = newZIndex;
        }
        
        console.log(`⬆️ Brought element ${elementId} to front (z-index: ${newZIndex})`);
        return true;
    }
    
    /**
     * Send element to back of its layer
     */
    sendToBack(elementId) {
        const elementInfo = this.elementLayerMap.get(elementId);
        if (!elementInfo) return false;
        
        const layerId = elementInfo.layerId;
        const baseZIndex = this.baseZIndices.get(layerId);
        const newZIndex = baseZIndex + 1; // Just above layer base
        
        // Update element info
        elementInfo.zIndex = newZIndex;
        elementInfo.lastUpdate = Date.now();
        
        // Apply to DOM element
        if (elementInfo.element) {
            elementInfo.element.style.zIndex = newZIndex;
        }
        
        console.log(`⬇️ Sent element ${elementId} to back (z-index: ${newZIndex})`);
        return true;
    }
    
    /**
     * Move element to different layer
     */
    moveElementToLayer(elementId, newLayerId) {
        const elementInfo = this.elementLayerMap.get(elementId);
        if (!elementInfo) return false;
        
        if (!this.layerHierarchy[newLayerId]) {
            console.warn(`Target layer not found: ${newLayerId}`);
            return false;
        }
        
        const oldLayerId = elementInfo.layerId;
        
        // Remove from old layer
        this.layerElementMap.get(oldLayerId).delete(elementId);
        
        // Add to new layer
        elementInfo.layerId = newLayerId;
        elementInfo.zIndex = this.calculateElementZIndex(newLayerId, elementInfo.priority);
        elementInfo.lastUpdate = Date.now();
        this.layerElementMap.get(newLayerId).add(elementId);
        
        // Move DOM element to new layer container
        if (elementInfo.element) {
            const newLayerContainer = this.activeLayers.get(newLayerId).container;
            elementInfo.element.style.zIndex = elementInfo.zIndex;
            elementInfo.element.dataset.layerId = newLayerId;
            newLayerContainer.appendChild(elementInfo.element);
        }
        
        console.log(`↔️ Moved element ${elementId}: ${oldLayerId} → ${newLayerId}`);
        return true;
    }
    
    /**
     * Apply temporary elevation (for hover, drag, etc.)
     */
    applyTemporaryElevation(elementId, zIndexBoost, duration = 0) {
        const elementInfo = this.elementLayerMap.get(elementId);
        if (!elementInfo) return false;
        
        const originalZIndex = elementInfo.zIndex;
        const elevatedZIndex = originalZIndex + zIndexBoost;
        
        // Store temporary elevation info
        this.temporaryElevations.set(elementId, {
            originalZIndex: originalZIndex,
            elevatedZIndex: elevatedZIndex,
            startTime: Date.now(),
            duration: duration
        });
        
        // Apply elevation
        if (elementInfo.element) {
            elementInfo.element.style.zIndex = elevatedZIndex;
        }
        
        // Auto-restore if duration specified
        if (duration > 0) {
            setTimeout(() => {
                this.restoreOriginalElevation(elementId);
            }, duration);
        }
        
        console.log(`⬆️ Applied temporary elevation to ${elementId}: +${zIndexBoost}`);
        return true;
    }
    
    /**
     * Restore original elevation
     */
    restoreOriginalElevation(elementId) {
        const elevation = this.temporaryElevations.get(elementId);
        const elementInfo = this.elementLayerMap.get(elementId);
        
        if (elevation && elementInfo) {
            // Restore original z-index
            if (elementInfo.element) {
                elementInfo.element.style.zIndex = elevation.originalZIndex;
            }
            
            // Clean up temporary elevation
            this.temporaryElevations.delete(elementId);
            
            console.log(`⬇️ Restored original elevation for ${elementId}`);
        }
    }
    
    /**
     * Enable/disable layer
     */
    setLayerEnabled(layerId, enabled) {
        const layerState = this.layerStates.get(layerId);
        const layerInfo = this.activeLayers.get(layerId);
        
        if (layerState && layerInfo) {
            layerState.enabled = enabled;
            
            if (enabled) {
                this.disabledLayers.delete(layerId);
                layerInfo.container.style.pointerEvents = 'auto';
                layerInfo.container.style.visibility = 'visible';
            } else {
                this.disabledLayers.add(layerId);
                layerInfo.container.style.pointerEvents = 'none';
                layerInfo.container.style.visibility = 'hidden';
            }
            
            console.log(`🎚️ Layer ${layerId} ${enabled ? 'enabled' : 'disabled'}`);
        }
    }
    
    /**
     * Setup event listeners for layer management reactions
     */
    setupEventListeners() {
        // Listen for layer management events from event system
        document.addEventListener('vib3-layer-action', (e) => {
            this.handleLayerAction(e.detail);
        });
        
        // Listen for card focus events
        document.addEventListener('vib3-card-focus', (e) => {
            this.handleCardFocus(e.detail.cardId);
        });
        
        // Listen for card hover events
        document.addEventListener('vib3-card-hover', (e) => {
            this.handleCardHover(e.detail.cardId, e.detail.hovering);
        });
        
        // Listen for drag events
        document.addEventListener('vib3-card-drag-start', (e) => {
            this.handleDragStart(e.detail.cardId);
        });
        
        document.addEventListener('vib3-card-drag-end', (e) => {
            this.handleDragEnd(e.detail.cardId);
        });
        
        // Listen for modal events
        document.addEventListener('vib3-modal-open', (e) => {
            this.handleModalOpen();
        });
        
        document.addEventListener('vib3-modal-close', (e) => {
            this.handleModalClose();
        });
    }
    
    /**
     * Handle layer action from event system
     */
    handleLayerAction(actionData) {
        const { action, elementId, targetLayer, zIndexBoost, duration } = actionData;
        
        switch (action) {
            case 'elevateToLayerFront':
                this.bringToFront(elementId);
                break;
            case 'temporaryElevation':
                this.applyTemporaryElevation(elementId, zIndexBoost, duration);
                break;
            case 'dragElevation':
                this.moveElementToLayer(elementId, targetLayer);
                break;
            case 'disableLowerLayers':
                this.disableLowerLayers(targetLayer);
                break;
            default:
                console.log(`🎚️ Unknown layer action: ${action}`);
        }
    }
    
    /**
     * Handle card focus event
     */
    handleCardFocus(cardId) {
        // Apply layer rule: cardFocus
        const rule = this.layerRules?.cardFocus;
        if (rule) {
            this.applyTemporaryElevation(cardId, rule.zIndexBoost);
        }
    }
    
    /**
     * Handle card hover event
     */
    handleCardHover(cardId, hovering) {
        const rule = this.layerRules?.cardHover;
        if (rule) {
            if (hovering) {
                this.applyTemporaryElevation(cardId, rule.zIndexBoost, rule.duration);
            } else {
                this.restoreOriginalElevation(cardId);
            }
        }
    }
    
    /**
     * Handle drag start event
     */
    handleDragStart(cardId) {
        const rule = this.layerRules?.cardDrag;
        if (rule) {
            this.moveElementToLayer(cardId, rule.targetLayer);
        }
    }
    
    /**
     * Handle drag end event
     */
    handleDragEnd(cardId) {
        const rule = this.layerRules?.cardDrag;
        if (rule && rule.restoreOnDrop) {
            this.moveElementToLayer(cardId, 'cardContent');
        }
    }
    
    /**
     * Handle modal open event
     */
    handleModalOpen() {
        const rule = this.layerRules?.modalOpen;
        if (rule) {
            rule.affectedLayers.forEach(layerId => {
                this.setLayerEnabled(layerId, false);
            });
        }
    }
    
    /**
     * Handle modal close event
     */
    handleModalClose() {
        const rule = this.layerRules?.modalOpen;
        if (rule) {
            rule.affectedLayers.forEach(layerId => {
                this.setLayerEnabled(layerId, true);
            });
        }
    }
    
    /**
     * Disable layers below specified layer
     */
    disableLowerLayers(targetLayerId) {
        const targetZIndex = this.baseZIndices.get(targetLayerId);
        
        this.layerStates.forEach((state, layerId) => {
            const layerZIndex = this.baseZIndices.get(layerId);
            if (layerZIndex < targetZIndex) {
                this.setLayerEnabled(layerId, false);
            }
        });
    }
    
    /**
     * Get layer statistics
     */
    getLayerStatistics() {
        const stats = {
            totalLayers: this.activeLayers.size,
            enabledLayers: this.activeLayers.size - this.disabledLayers.size,
            totalElements: this.elementLayerMap.size,
            temporaryElevations: this.temporaryElevations.size,
            layerBreakdown: {}
        };
        
        this.layerElementMap.forEach((elements, layerId) => {
            stats.layerBreakdown[layerId] = {
                elementCount: elements.size,
                enabled: !this.disabledLayers.has(layerId),
                baseZIndex: this.baseZIndices.get(layerId),
                currentMaxZIndex: this.dynamicZIndexCounter.get(layerId)
            };
        });
        
        return stats;
    }
    
    /**
     * Get default manifest if loading fails
     */
    getDefaultManifest() {
        return {
            layerManagement: {
                layerHierarchy: {
                    background: { zIndex: -1000, type: "global", alwaysVisible: true },
                    cardContent: { zIndex: 100, type: "content", interactive: true },
                    interfaceElements: { zIndex: 500, type: "ui", persistent: true }
                },
                layerRules: {
                    cardFocus: { zIndexBoost: 50 },
                    cardHover: { zIndexBoost: 10, duration: 300 }
                }
            }
        };
    }
}

// Export for global access
window.VIB3LayerManager = VIB3LayerManager;

console.log('🎚️ VIB3LayerManager loaded - Layer management ready');