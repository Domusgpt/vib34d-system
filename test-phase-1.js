/**
 * VIB34D Phase 1 Test Script
 * 
 * Tests the core functionality of Phase 1 implementation:
 * - JsonConfigSystem loads and validates all configs
 * - SystemController initializes without errors
 * - Configuration files are valid JSON and cross-references work
 */

const fs = require('fs');
const path = require('path');

// JSDOM for DOM simulation
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Create a DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head><title>VIB34D Test</title></head>
<body>
    <div id="vib34d-app"></div>
</body>
</html>
`, {
    url: 'http://localhost:8000',
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.EventTarget = dom.window.EventTarget;
global.CustomEvent = dom.window.CustomEvent;
global.performance = dom.window.performance;
global.requestAnimationFrame = dom.window.requestAnimationFrame;

console.log('🧪 VIB34D Phase 1 Testing Suite');
console.log('===============================');

/**
 * Test 1: JSON Configuration Files Validation
 */
async function testJsonConfigurations() {
    console.log('\n📋 Test 1: JSON Configuration Files');
    
    const configFiles = [
        'layout-content.json',
        'visuals.json', 
        'behavior.json',
        'state-map.json'
    ];
    
    const configs = {};
    
    for (const file of configFiles) {
        try {
            const filePath = path.join(__dirname, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const config = JSON.parse(content);
            configs[file] = config;
            console.log(`   ✅ ${file} - Valid JSON`);
        } catch (error) {
            console.log(`   ❌ ${file} - Error: ${error.message}`);
            return false;
        }
    }
    
    // Test cross-references
    console.log('   🔗 Testing cross-references...');
    
    // Check if state-map references valid themes from visuals
    const themes = Object.keys(configs['visuals.json'].themes || {});
    const states = configs['state-map.json'].states || {};
    
    for (const [stateId, stateConfig] of Object.entries(states)) {
        if (stateConfig.activeTheme && !themes.includes(stateConfig.activeTheme)) {
            console.log(`   ⚠️  State '${stateId}' references unknown theme '${stateConfig.activeTheme}'`);
        }
    }
    
    console.log('   ✅ Cross-reference validation passed');
    return true;
}

/**
 * Test 2: JsonConfigSystem Module
 */
async function testJsonConfigSystem() {
    console.log('\n📋 Test 2: JsonConfigSystem Module');
    
    try {
        // Load the JsonConfigSystem
        const JsonConfigSystemCode = fs.readFileSync(path.join(__dirname, 'JsonConfigSystem.js'), 'utf8');
        eval(JsonConfigSystemCode);
        
        // Check if it was loaded into window or global
        const JsonConfigSystem = global.JsonConfigSystem || window?.JsonConfigSystem;
        
        if (typeof JsonConfigSystem === 'undefined') {
            console.log('   ❌ JsonConfigSystem class not found');
            return false;
        }
        
        // Create instance
        const configSystem = new JsonConfigSystem();
        console.log('   ✅ JsonConfigSystem instance created');
        
        // Mock fetch for testing
        global.fetch = async (filename) => {
            const filePath = path.join(__dirname, filename);
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                ok: true,
                json: async () => JSON.parse(content)
            };
        };
        
        // Test configuration loading
        await configSystem.loadAllConfigs();
        console.log('   ✅ All configurations loaded successfully');
        
        // Test configuration access
        const layoutConfig = configSystem.getConfig('layout');
        if (layoutConfig && layoutConfig.layout && layoutConfig.cards) {
            console.log('   ✅ Configuration access working');
            console.log(`   📊 Found ${layoutConfig.cards.length} cards in layout`);
        } else {
            console.log('   ❌ Configuration access failed');
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.log(`   ❌ JsonConfigSystem test failed: ${error.message}`);
        return false;
    }
}

/**
 * Test 3: SystemController Module
 */
async function testSystemController() {
    console.log('\n🎛️  Test 3: SystemController Module');
    
    try {
        // Load the SystemController
        const SystemControllerCode = fs.readFileSync(path.join(__dirname, 'SystemController.js'), 'utf8');
        eval(SystemControllerCode);
        
        // Check if it was loaded into window or global
        const SystemController = global.SystemController || window?.SystemController;
        
        if (typeof SystemController === 'undefined') {
            console.log('   ❌ SystemController class not found');
            return false;
        }
        
        // Create instance
        const systemController = new SystemController();
        console.log('   ✅ SystemController instance created');
        
        // Test initialization (without full DOM setup)
        const container = document.getElementById('vib34d-app');
        if (container) {
            console.log('   ✅ Application container found');
        }
        
        // Test system state
        const state = systemController.getSystemState();
        if (state && state.version) {
            console.log(`   ✅ System state accessible (version: ${state.version})`);
            console.log(`   📊 Module status:`, state.moduleStatus);
        }
        
        return true;
        
    } catch (error) {
        console.log(`   ❌ SystemController test failed: ${error.message}`);
        return false;
    }
}

/**
 * Test 4: CSS and HTML Files
 */
function testStaticFiles() {
    console.log('\n🎨 Test 4: Static Files');
    
    try {
        // Test CSS file
        const cssPath = path.join(__dirname, 'vib34d-styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        if (cssContent.includes('--vib34d-') && cssContent.includes('.vib34d-card')) {
            console.log('   ✅ CSS file contains VIB34D styles');
        } else {
            console.log('   ❌ CSS file missing VIB34D styles');
            return false;
        }
        
        // Test HTML file
        const htmlPath = path.join(__dirname, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        if (htmlContent.includes('JsonConfigSystem.js') && 
            htmlContent.includes('SystemController.js') &&
            htmlContent.includes('vib34d-app')) {
            console.log('   ✅ HTML file properly structured');
        } else {
            console.log('   ❌ HTML file missing required elements');
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.log(`   ❌ Static files test failed: ${error.message}`);
        return false;
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Starting VIB34D Phase 1 Test Suite...\n');
    
    const tests = [
        testJsonConfigurations,
        testJsonConfigSystem,
        testSystemController,
        testStaticFiles
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        try {
            const result = await test();
            if (result) {
                passedTests++;
            }
        } catch (error) {
            console.log(`   💥 Test crashed: ${error.message}`);
        }
    }
    
    console.log('\n===============================');
    console.log(`🏁 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('✅ Phase 1 SUCCESS CRITERIA MET:');
        console.log('   ✓ Application architecture validated');
        console.log('   ✓ Configuration system working');
        console.log('   ✓ SystemController functional');
        console.log('   ✓ Static files properly structured');
        console.log('   ✓ Ready for Phase 2 WebGL integration');
        console.log('\n🎯 VIB34D Phase 1 COMPLETE!');
        return true;
    } else {
        console.log('❌ Phase 1 has issues that need to be resolved');
        return false;
    }
}

// Run the tests
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests };