/**
 * Debug script to test GeometryRegistry shader loading
 */

// Simulate the browser environment
if (typeof window === 'undefined') {
    global.window = {};
    global.document = {
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => ({ getContext: () => null })
    };
    global.console = console;
    global.performance = { now: () => Date.now() };
}

// Load JsonConfigSystem
const JsonConfigSystem = require('./JsonConfigSystem.js');

// Load GeometryRegistry
const GeometryRegistry = require('./GeometryRegistry.js');

async function debugGeometryLoading() {
    console.log('🔍 Debug: Testing GeometryRegistry initialization...');
    
    try {
        // Initialize JsonConfigSystem
        const jsonConfigSystem = new JsonConfigSystem();
        await jsonConfigSystem.loadAllConfigs();
        
        // Initialize GeometryRegistry
        const geometryRegistry = new GeometryRegistry();
        await geometryRegistry.initialize(jsonConfigSystem);
        
        // Test hypercube geometry
        console.log('\n🔍 Testing hypercube geometry:');
        const hypercube = geometryRegistry.getGeometry('hypercube');
        console.log('Hypercube object:', {
            name: hypercube?.name,
            isLoaded: hypercube?.isLoaded,
            hasVertexShader: !!hypercube?.vertexShader,
            hasFragmentShader: !!hypercube?.fragmentShader,
            vertexShaderLength: hypercube?.vertexShader?.length,
            fragmentShaderLength: hypercube?.fragmentShader?.length
        });
        
        if (hypercube?.vertexShader) {
            console.log('✅ Vertex shader found:', hypercube.vertexShader.substring(0, 100) + '...');
        } else {
            console.log('❌ No vertex shader found');
        }
        
        if (hypercube?.fragmentShader) {
            console.log('✅ Fragment shader found:', hypercube.fragmentShader.substring(0, 100) + '...');
        } else {
            console.log('❌ No fragment shader found');
        }
        
        // Test other geometries
        console.log('\n🔍 Testing all geometries:');
        const geometryNames = geometryRegistry.getGeometryNames();
        console.log('Available geometries:', geometryNames);
        
        geometryNames.forEach(name => {
            const geom = geometryRegistry.getGeometry(name);
            console.log(`${name}: loaded=${geom?.isLoaded}, hasShaders=${!!(geom?.vertexShader && geom?.fragmentShader)}`);
        });
        
        // Test validation
        console.log('\n🔍 Testing geometry validation:');
        const isValid = geometryRegistry.validateGeometry('hypercube');
        console.log('Hypercube validation result:', isValid);
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

// Run debug
debugGeometryLoading();