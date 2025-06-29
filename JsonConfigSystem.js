/**
 * JsonConfigSystem.js - Configuration Management Core
 * 
 * Responsible for loading, parsing, validating, and providing access
 * to the four core JSON configuration files that drive the VIB34D system.
 */

class JsonConfigSystem {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        
        // Configuration storage
        this.configs = {
            layout: null,
            visuals: null,
            behavior: null,
            stateMap: null
        };
        
        // Configuration file paths
        this.configFiles = {
            layout: 'layout-content.json',
            visuals: 'visuals.json', 
            behavior: 'behavior.json',
            stateMap: 'state-map.json'
        };
        
        // Event system for configuration updates
        this.eventBus = new EventTarget();
        
        // Validation schemas for each config type
        this.validationSchemas = {
            layout: this.createLayoutSchema(),
            visuals: this.createVisualsSchema(),
            behavior: this.createBehaviorSchema(),
            stateMap: this.createStateMapSchema()
        };
        
        console.log('📋 JsonConfigSystem initialized');
    }

    /**
     * Load all configuration files
     */
    async loadAllConfigs() {
        console.log('📋 Loading all configuration files...');
        
        try {
            // Load all configs in parallel for better performance
            const loadPromises = Object.entries(this.configFiles).map(([key, filename]) => 
                this.loadConfig(key, filename)
            );
            
            await Promise.all(loadPromises);
            
            // Validate cross-references between configs
            this.validateCrossReferences();
            
            this.isInitialized = true;
            console.log('✅ All configurations loaded successfully');
            
            // Emit event that configs are ready
            this.eventBus.dispatchEvent(new CustomEvent('configLoaded', {
                detail: { allConfigs: this.configs }
            }));
            
            return this.configs;
            
        } catch (error) {
            console.error('❌ Failed to load configurations:', error);
            throw error;
        }
    }

    /**
     * Load a single configuration file
     */
    async loadConfig(configType, filename) {
        try {
            console.log(`📄 Loading ${configType} from ${filename}...`);
            
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
            }
            
            const configData = await response.json();
            
            // Validate the configuration
            this.validateConfig(configType, configData);
            
            // Store the configuration
            this.configs[configType] = configData;
            
            console.log(`✅ ${configType} configuration loaded`);
            
            // Emit specific config loaded event
            this.eventBus.dispatchEvent(new CustomEvent(`${configType}ConfigLoaded`, {
                detail: { configType, config: configData }
            }));
            
            return configData;
            
        } catch (error) {
            console.error(`❌ Failed to load ${configType} config:`, error);
            throw error;
        }
    }

    /**
     * Validate a configuration against its schema
     */
    validateConfig(configType, configData) {
        const schema = this.validationSchemas[configType];
        if (!schema) {
            console.warn(`⚠️ No validation schema found for ${configType}`);
            return;
        }
        
        // Basic validation - check required top-level properties
        for (const requiredField of schema.required) {
            if (!configData.hasOwnProperty(requiredField)) {
                throw new Error(`Missing required field '${requiredField}' in ${configType} config`);
            }
        }
        
        console.log(`✓ ${configType} configuration validated`);
    }

    /**
     * Validate cross-references between configurations
     */
    validateCrossReferences() {
        console.log('🔗 Validating cross-references between configurations...');
        
        // Validate that state-map references valid themes from visuals
        const states = this.configs.stateMap?.states || {};
        const themes = Object.keys(this.configs.visuals?.themes || {});
        
        for (const [stateId, stateConfig] of Object.entries(states)) {
            if (stateConfig.activeTheme && !themes.includes(stateConfig.activeTheme)) {
                console.warn(`⚠️ State '${stateId}' references unknown theme '${stateConfig.activeTheme}'`);
            }
        }
        
        // Validate that state-map references valid cards from layout-content
        const cardIds = (this.configs.layout?.cards || []).map(card => card.id);
        
        for (const [stateId, stateConfig] of Object.entries(states)) {
            const activeCards = stateConfig.activeCards || [];
            for (const cardId of activeCards) {
                if (!cardIds.includes(cardId)) {
                    console.warn(`⚠️ State '${stateId}' references unknown card '${cardId}'`);
                }
            }
        }
        
        // Validate that layout-content cards reference valid geometries from visuals
        const geometryNames = (this.configs.visuals?.geometries || []).map(geo => geo.name);
        
        for (const card of this.configs.layout?.cards || []) {
            if (card.geometry && !geometryNames.includes(card.geometry)) {
                console.warn(`⚠️ Card '${card.id}' references unknown geometry '${card.geometry}'`);
            }
        }
        
        console.log('✓ Cross-reference validation completed');
    }

    /**
     * Hot-reload a specific configuration file
     */
    async updateConfig(configType, newConfig) {
        try {
            console.log(`🔄 Hot-reloading ${configType} configuration...`);
            
            // Validate the new configuration
            this.validateConfig(configType, newConfig);
            
            // Store the old config for rollback if needed
            const oldConfig = this.configs[configType];
            
            // Update the configuration
            this.configs[configType] = newConfig;
            
            // Re-validate cross-references
            this.validateCrossReferences();
            
            // Emit update event
            this.eventBus.dispatchEvent(new CustomEvent('configUpdated', {
                detail: { 
                    configType, 
                    newConfig, 
                    oldConfig,
                    timestamp: Date.now()
                }
            }));
            
            console.log(`✅ ${configType} configuration updated successfully`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to update ${configType} config:`, error);
            throw error;
        }
    }

    /**
     * Get a specific configuration
     */
    getConfig(configType) {
        if (!this.isInitialized) {
            console.warn('⚠️ JsonConfigSystem not yet initialized');
            return null;
        }
        
        return this.configs[configType];
    }

    /**
     * Get all configurations
     */
    getAllConfigs() {
        return { ...this.configs };
    }

    /**
     * Get a specific value from a configuration using dot notation
     */
    getConfigValue(configType, path) {
        const config = this.getConfig(configType);
        if (!config) return null;
        
        // Simple dot notation parser
        const keys = path.split('.');
        let value = config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Validation Schema Definitions
    createLayoutSchema() {
        return {
            required: ['layout', 'components', 'cards'],
            properties: {
                layout: { type: 'object', required: ['grid'] },
                components: { type: 'array' },
                cards: { type: 'array' }
            }
        };
    }

    createVisualsSchema() {
        return {
            required: ['themes', 'geometries', 'parameters'],
            properties: {
                themes: { type: 'object' },
                geometries: { type: 'array' },
                parameters: { type: 'object' }
            }
        };
    }

    createBehaviorSchema() {
        return {
            required: ['interactionBlueprints'],
            properties: {
                interactionBlueprints: { type: 'object' },
                stateModifiers: { type: 'object' },
                masterParameterMaps: { type: 'object' }
            }
        };
    }

    createStateMapSchema() {
        return {
            required: ['states', 'navigation', 'initialState'],
            properties: {
                states: { type: 'object' },
                navigation: { type: 'object' },
                initialState: { type: 'string' }
            }
        };
    }

    /**
     * Export current configuration state as JSON
     */
    exportConfigs() {
        return {
            timestamp: new Date().toISOString(),
            version: this.version,
            configs: this.getAllConfigs()
        };
    }

    /**
     * Import configuration state from JSON
     */
    async importConfigs(configData) {
        try {
            console.log('📥 Importing configuration data...');
            
            if (configData.configs) {
                // Update each configuration
                for (const [configType, config] of Object.entries(configData.configs)) {
                    if (this.configs.hasOwnProperty(configType)) {
                        await this.updateConfig(configType, config);
                    }
                }
            }
            
            console.log('✅ Configuration import completed');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to import configurations:', error);
            throw error;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JsonConfigSystem;
} else {
    window.JsonConfigSystem = JsonConfigSystem;
}