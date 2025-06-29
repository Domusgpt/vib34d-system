/**
 * agentAPI.js - Global Agent Control Interface
 * 
 * Exposes system controls to the outside world for agent-based manipulation.
 * Provides a clean, documented API for external agents to control the VIB34D system.
 * 
 * Part of Phase 5: Agent API & Finalization
 */

class AgentAPI {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Core system references
        this.systemController = null;
        this.homeMaster = null;
        this.interactionCoordinator = null;
        this.visualizerPool = null;
        this.jsonConfigSystem = null;
        
        // API state
        this.isReady = false;
        this.lastError = null;
        
        // API call metrics
        this.metrics = {
            apiCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            navigationCalls: 0,
            parameterUpdates: 0,
            configUpdates: 0
        };
        
        console.log('🤖 AgentAPI initialized');
    }

    /**
     * Initialize AgentAPI with system references
     */
    async initialize(systemController) {
        if (this.isInitialized) {
            console.warn('⚠️ AgentAPI already initialized');
            return;
        }

        try {
            console.log('🤖 Initializing AgentAPI...');
            
            this.systemController = systemController;
            
            // Extract system module references
            this.homeMaster = systemController.homeMaster;
            this.interactionCoordinator = systemController.interactionCoordinator;
            this.visualizerPool = systemController.visualizerPool;
            this.jsonConfigSystem = systemController.jsonConfigSystem;
            
            // Validate core dependencies
            if (!this.homeMaster) {
                throw new Error('HomeMaster not available');
            }
            
            if (!this.jsonConfigSystem) {
                throw new Error('JsonConfigSystem not available');
            }
            
            this.isInitialized = true;
            this.isReady = true;
            
            console.log('✅ AgentAPI initialized and ready');
            
            // Expose to global window
            window.agentAPI = this;
            
            return this;
            
        } catch (error) {
            console.error('❌ Failed to initialize AgentAPI:', error);
            this.lastError = error.message;
            throw error;
        }
    }

    /**
     * Navigate to a specific state
     * @param {string} stateId - Target state ID
     * @param {Object} options - Navigation options
     * @returns {Promise<boolean>} Success status
     */
    async navigateTo(stateId, options = {}) {
        return this._apiCall('navigateTo', async () => {
            if (!this.homeMaster) {
                throw new Error('HomeMaster not available');
            }
            
            const result = await this.homeMaster.navigateTo(stateId, options);
            this.metrics.navigationCalls++;
            
            return result;
        }, [stateId, options]);
    }

    /**
     * Set a master parameter value
     * @param {string} parameterName - Parameter name (e.g., 'u_dimension')
     * @param {number} value - New parameter value
     * @returns {boolean} Success status
     */
    setMasterParameter(parameterName, value) {
        return this._apiCall('setMasterParameter', () => {
            if (!this.homeMaster) {
                throw new Error('HomeMaster not available');
            }
            
            const result = this.homeMaster.updateParameter(parameterName, value);
            this.metrics.parameterUpdates++;
            
            return result;
        }, [parameterName, value]);
    }

    /**
     * Get current master parameters
     * @returns {Object} Current global parameters
     */
    getMasterParameters() {
        return this._apiCall('getMasterParameters', () => {
            if (!this.homeMaster) {
                throw new Error('HomeMaster not available');
            }
            
            return this.homeMaster.getGlobalParameters();
        });
    }

    /**
     * Get current system state information
     * @returns {Object} State information
     */
    getSystemState() {
        return this._apiCall('getSystemState', () => {
            const systemState = this.systemController ? this.systemController.getSystemState() : {};
            const homeState = this.homeMaster ? this.homeMaster.getStateInfo() : {};
            
            return {
                ...systemState,
                currentState: homeState.currentState,
                availableStates: homeState.availableStates,
                isTransitioning: homeState.isTransitioning
            };
        });
    }

    /**
     * Execute interaction blueprint programmatically
     * @param {string} blueprintName - Name of interaction blueprint
     * @param {HTMLElement} targetElement - Target DOM element
     * @param {Object} eventData - Event data
     * @returns {boolean} Success status
     */
    executeInteraction(blueprintName, targetElement, eventData = {}) {
        return this._apiCall('executeInteraction', () => {
            if (!this.interactionCoordinator) {
                throw new Error('InteractionCoordinator not available');
            }
            
            this.interactionCoordinator.executeInteractionBlueprint(blueprintName, targetElement, eventData);
            return true;
        }, [blueprintName, targetElement, eventData]);
    }

    /**
     * Update configuration and hot-reload (Phase 5.2)
     * @param {string} configType - Type of config (layout, visuals, behavior, stateMap)
     * @param {Object} newConfig - New configuration object
     * @returns {Promise<boolean>} Success status
     */
    async updateConfig(configType, newConfig) {
        return this._apiCall('updateConfig', async () => {
            if (!this.jsonConfigSystem) {
                throw new Error('JsonConfigSystem not available');
            }
            
            if (!this.systemController) {
                throw new Error('SystemController not available');
            }
            
            console.log(`🔄 Hot-reloading config: ${configType}`);
            
            // Update the configuration
            await this.jsonConfigSystem.updateConfig(configType, newConfig);
            
            // Trigger system hot-restart based on config type
            await this._performHotRestart(configType);
            
            this.metrics.configUpdates++;
            
            return true;
        }, [configType, newConfig]);
    }

    /**
     * Get performance metrics for all system components
     * @returns {Object} Comprehensive performance metrics
     */
    getPerformanceMetrics() {
        return this._apiCall('getPerformanceMetrics', () => {
            const metrics = {
                agentAPI: { ...this.metrics },
                system: this.systemController?.getSystemState()?.performanceMetrics || {},
                homeMaster: this.homeMaster?.getMetrics() || {},
                visualizerPool: this.visualizerPool?.getMetrics() || {},
                interactionCoordinator: this.interactionCoordinator?.getMetrics() || {}
            };
            
            return metrics;
        });
    }

    /**
     * Control animation engine
     * @param {string} action - Action: 'start', 'stop', 'pause', 'resume'
     * @returns {boolean} Success status
     */
    controlAnimations(action) {
        return this._apiCall('controlAnimations', () => {
            if (!this.interactionCoordinator) {
                throw new Error('InteractionCoordinator not available');
            }
            
            switch (action) {
                case 'stop':
                    this.interactionCoordinator.animationQueue = [];
                    this.interactionCoordinator.activeAnimations.clear();
                    break;
                case 'pause':
                    this.interactionCoordinator.isProcessingAnimations = true;
                    break;
                case 'resume':
                    this.interactionCoordinator.isProcessingAnimations = false;
                    break;
                default:
                    console.warn(`⚠️ Unknown animation action: ${action}`);
                    return false;
            }
            
            return true;
        }, [action]);
    }

    /**
     * Get system diagnostics
     * @returns {Object} Comprehensive system diagnostics
     */
    getDiagnostics() {
        return this._apiCall('getDiagnostics', () => {
            return {
                version: this.version,
                isReady: this.isReady,
                lastError: this.lastError,
                systemModules: {
                    systemController: !!this.systemController?.isInitialized,
                    homeMaster: !!this.homeMaster?.isInitialized,
                    interactionCoordinator: !!this.interactionCoordinator?.isInitialized,
                    visualizerPool: !!this.visualizerPool?.isInitialized,
                    jsonConfigSystem: !!this.jsonConfigSystem?.isLoaded
                },
                webglStatus: {
                    supported: this.visualizerPool?.webglSupported || false,
                    webgl2: this.visualizerPool?.webgl2Supported || false,
                    activeVisualizers: this.visualizerPool?.visualizers?.size || 0
                },
                performance: this.getPerformanceMetrics()
            };
        });
    }

    /**
     * Restart the entire VIB34D system
     * @returns {Promise<boolean>} Success status
     */
    async restartSystem() {
        return this._apiCall('restartSystem', async () => {
            console.log('🔄 Restarting VIB34D system...');
            
            if (!this.systemController) {
                throw new Error('SystemController not available');
            }
            
            // Shutdown current system
            this.systemController.shutdown();
            
            // Wait a moment for cleanup
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Reinitialize system
            await this.systemController.initialize();
            
            // Update references
            this.homeMaster = this.systemController.homeMaster;
            this.interactionCoordinator = this.systemController.interactionCoordinator;
            this.visualizerPool = this.systemController.visualizerPool;
            this.jsonConfigSystem = this.systemController.jsonConfigSystem;
            
            console.log('✅ VIB34D system restarted');
            
            return true;
        });
    }

    /**
     * Export current system configuration
     * @returns {Object} Complete system configuration
     */
    exportConfiguration() {
        return this._apiCall('exportConfiguration', () => {
            if (!this.jsonConfigSystem) {
                throw new Error('JsonConfigSystem not available');
            }
            
            return {
                layout: this.jsonConfigSystem.getConfig('layout'),
                visuals: this.jsonConfigSystem.getConfig('visuals'),
                behavior: this.jsonConfigSystem.getConfig('behavior'),
                stateMap: this.jsonConfigSystem.getConfig('stateMap')
            };
        });
    }

    /**
     * Register custom interaction blueprint
     * @param {string} blueprintName - Name for the blueprint
     * @param {Object} blueprint - Blueprint configuration
     * @returns {boolean} Success status
     */
    registerInteractionBlueprint(blueprintName, blueprint) {
        return this._apiCall('registerInteractionBlueprint', () => {
            if (!this.interactionCoordinator) {
                throw new Error('InteractionCoordinator not available');
            }
            
            this.interactionCoordinator.interactionBlueprints[blueprintName] = blueprint;
            
            // Re-setup event listeners to include new blueprint
            this.interactionCoordinator.setupInteractionEventListeners();
            
            return true;
        }, [blueprintName, blueprint]);
    }

    /**
     * Private method: Perform hot restart based on config type
     */
    async _performHotRestart(configType) {
        switch (configType) {
            case 'layout':
                // Reinitialize layout
                const layoutConfig = this.jsonConfigSystem.getConfig('layout');
                this.systemController.reinitializeLayout(layoutConfig);
                break;
                
            case 'visuals':
                // Reapply theming and reinitialize visualizers
                const visualsConfig = this.jsonConfigSystem.getConfig('visuals');
                this.systemController.reapplyTheming(visualsConfig);
                if (this.visualizerPool) {
                    // Reload geometry registry
                    await this.visualizerPool.geometryRegistry.initialize(this.jsonConfigSystem);
                }
                break;
                
            case 'behavior':
                // Reload interaction blueprints
                if (this.interactionCoordinator) {
                    await this.interactionCoordinator.loadInteractionBlueprints();
                }
                break;
                
            case 'stateMap':
                // Reload state definitions
                if (this.homeMaster) {
                    await this.homeMaster.loadStateDefinitions();
                }
                if (this.interactionCoordinator) {
                    await this.interactionCoordinator.loadNavigationConfiguration();
                }
                break;
                
            default:
                console.warn(`⚠️ Unknown config type for hot reload: ${configType}`);
        }
    }

    /**
     * Private method: Wrap API calls with error handling and metrics
     */
    _apiCall(methodName, fn, args = []) {
        this.metrics.apiCalls++;
        
        try {
            if (!this.isReady) {
                throw new Error('AgentAPI not ready');
            }
            
            console.log(`🤖 AgentAPI.${methodName}(${args.map(a => typeof a).join(', ')})`);
            
            const result = fn();
            this.metrics.successfulCalls++;
            this.lastError = null;
            
            return result;
            
        } catch (error) {
            console.error(`❌ AgentAPI.${methodName} failed:`, error);
            this.metrics.failedCalls++;
            this.lastError = error.message;
            
            return { error: error.message };
        }
    }
}

// Create global instance
window.AgentAPI = AgentAPI;

console.log('🤖 AgentAPI class loaded - Ready for initialization');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentAPI;
}