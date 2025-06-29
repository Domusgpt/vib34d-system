/**
 * VIB34D System Automated Testing with Puppeteer
 * 
 * Comprehensive testing suite for Phase 3 state management and navigation
 */

const puppeteer = require('puppeteer');

class VIB34DSystemTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            moduleLoading: {},
            configSystem: {},
            stateManagement: {},
            navigation: {},
            webglRendering: {},
            errors: []
        };
    }

    async initialize() {
        console.log('🚀 Initializing VIB34D System Testing...');
        
        this.browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            devtools: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--allow-running-insecure-content'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set up console logging
        this.page.on('console', msg => {
            console.log(`🖥️  Browser Console [${msg.type()}]:`, msg.text());
        });

        // Set up error handling
        this.page.on('pageerror', error => {
            console.error('💥 Page Error:', error.message);
            this.testResults.errors.push({
                type: 'pageerror',
                message: error.message,
                stack: error.stack
            });
        });

        // Set up request monitoring
        await this.page.setRequestInterception(true);
        this.page.on('request', request => {
            console.log(`📡 Request: ${request.method()} ${request.url()}`);
            request.continue();
        });

        this.page.on('response', response => {
            if (!response.ok()) {
                console.error(`❌ Failed Request: ${response.status()} ${response.url()}`);
            }
        });

        await this.page.setViewport({ width: 1920, height: 1080 });
    }

    async testModuleLoading() {
        console.log('\n📦 Testing Module Loading...');
        
        try {
            await this.page.goto('http://localhost:3000', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });

            // Wait for modules to load
            await this.page.waitForTimeout(2000);

            // Check if main modules are loaded
            const moduleChecks = await this.page.evaluate(() => {
                return {
                    JsonConfigSystem: typeof JsonConfigSystem !== 'undefined',
                    SystemController: typeof SystemController !== 'undefined',
                    HomeMaster: typeof HomeMaster !== 'undefined',
                    InteractionCoordinator: typeof InteractionCoordinator !== 'undefined',
                    GeometryRegistry: typeof GeometryRegistry !== 'undefined',
                    VisualizerPool: typeof VisualizerPool !== 'undefined'
                };
            });

            this.testResults.moduleLoading = moduleChecks;
            
            Object.entries(moduleChecks).forEach(([module, loaded]) => {
                console.log(`  ${loaded ? '✅' : '❌'} ${module}: ${loaded ? 'Loaded' : 'Not Loaded'}`);
            });

            return Object.values(moduleChecks).every(loaded => loaded);

        } catch (error) {
            console.error('❌ Module loading test failed:', error.message);
            this.testResults.errors.push({ type: 'moduleLoading', error: error.message });
            return false;
        }
    }

    async testConfigSystem() {
        console.log('\n📋 Testing Configuration System...');
        
        try {
            // Wait for system initialization
            await this.page.waitForSelector('#vib34d-app', { timeout: 10000 });
            
            const configStatus = await this.page.evaluate(async () => {
                // Wait for system to boot
                if (!window.vib34dSystem) {
                    return { error: 'SystemController not found in window.vib34dSystem' };
                }

                const system = window.vib34dSystem;
                const configSystem = system.jsonConfigSystem;
                
                if (!configSystem) {
                    return { error: 'JsonConfigSystem not initialized' };
                }

                return {
                    isLoaded: configSystem.isLoaded,
                    configCount: Object.keys(configSystem.configs).length,
                    hasLayout: !!configSystem.configs.layout,
                    hasVisuals: !!configSystem.configs.visuals,
                    hasBehavior: !!configSystem.configs.behavior,
                    hasStateMap: !!configSystem.configs.stateMap,
                    configs: Object.keys(configSystem.configs)
                };
            });

            this.testResults.configSystem = configStatus;
            
            if (configStatus.error) {
                console.log(`  ❌ ${configStatus.error}`);
                return false;
            }

            console.log(`  ✅ Config System Loaded: ${configStatus.isLoaded}`);
            console.log(`  ✅ Config Count: ${configStatus.configCount}`);
            console.log(`  ✅ Available Configs: ${configStatus.configs.join(', ')}`);

            return configStatus.isLoaded && configStatus.configCount >= 4;

        } catch (error) {
            console.error('❌ Config system test failed:', error.message);
            this.testResults.errors.push({ type: 'configSystem', error: error.message });
            return false;
        }
    }

    async testStateManagement() {
        console.log('\n🏠 Testing State Management (HomeMaster)...');
        
        try {
            const stateInfo = await this.page.evaluate(() => {
                const system = window.vib34dSystem;
                if (!system || !system.homeMaster) {
                    return { error: 'HomeMaster not available' };
                }

                const homeMaster = system.homeMaster;
                const stateInfo = homeMaster.getStateInfo();
                const globalParams = homeMaster.getGlobalParameters();
                
                return {
                    isInitialized: homeMaster.isInitialized,
                    currentState: stateInfo.currentState,
                    availableStates: stateInfo.availableStates,
                    stateSequence: stateInfo.stateSequence,
                    isTransitioning: stateInfo.isTransitioning,
                    globalParameters: Object.keys(globalParams),
                    parameterCount: Object.keys(globalParams).length
                };
            });

            this.testResults.stateManagement = stateInfo;

            if (stateInfo.error) {
                console.log(`  ❌ ${stateInfo.error}`);
                return false;
            }

            console.log(`  ✅ HomeMaster Initialized: ${stateInfo.isInitialized}`);
            console.log(`  ✅ Current State: ${stateInfo.currentState}`);
            console.log(`  ✅ Available States: ${stateInfo.availableStates.join(', ')}`);
            console.log(`  ✅ State Sequence: ${stateInfo.stateSequence.join(' → ')}`);
            console.log(`  ✅ Global Parameters: ${stateInfo.parameterCount} parameters`);

            return stateInfo.isInitialized && stateInfo.availableStates.length > 0;

        } catch (error) {
            console.error('❌ State management test failed:', error.message);
            this.testResults.errors.push({ type: 'stateManagement', error: error.message });
            return false;
        }
    }

    async testNavigation() {
        console.log('\n🎯 Testing Navigation System...');
        
        try {
            // Test keyboard navigation
            const navigationResults = await this.page.evaluate(async () => {
                const system = window.vib34dSystem;
                if (!system || !system.homeMaster || !system.interactionCoordinator) {
                    return { error: 'Navigation system not available' };
                }

                const results = {
                    initialState: system.homeMaster.getStateInfo().currentState,
                    navigationTests: []
                };

                // Test navigation to different states
                const testStates = ['tech', 'media', 'innovation', 'context', 'home'];
                
                for (const targetState of testStates) {
                    try {
                        const success = await system.homeMaster.navigateTo(targetState);
                        const newState = system.homeMaster.getStateInfo().currentState;
                        
                        results.navigationTests.push({
                            targetState,
                            success,
                            resultState: newState,
                            correct: newState === targetState
                        });
                        
                        // Wait for transition
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                    } catch (error) {
                        results.navigationTests.push({
                            targetState,
                            success: false,
                            error: error.message
                        });
                    }
                }

                return results;
            });

            this.testResults.navigation = navigationResults;

            if (navigationResults.error) {
                console.log(`  ❌ ${navigationResults.error}`);
                return false;
            }

            console.log(`  ✅ Initial State: ${navigationResults.initialState}`);
            
            let successCount = 0;
            navigationResults.navigationTests.forEach(test => {
                const status = test.correct ? '✅' : '❌';
                console.log(`  ${status} Navigate to ${test.targetState}: ${test.correct ? 'Success' : 'Failed'} (${test.resultState})`);
                if (test.correct) successCount++;
            });

            console.log(`  📊 Navigation Success Rate: ${successCount}/${navigationResults.navigationTests.length}`);

            return successCount > 0;

        } catch (error) {
            console.error('❌ Navigation test failed:', error.message);
            this.testResults.errors.push({ type: 'navigation', error: error.message });
            return false;
        }
    }

    async testKeyboardNavigation() {
        console.log('\n⌨️  Testing Keyboard Navigation...');
        
        try {
            // Test various keyboard inputs
            const keyboardTests = [
                { key: 'Digit1', expected: 'home', description: 'Number 1 key' },
                { key: 'Digit2', expected: 'tech', description: 'Number 2 key' },
                { key: 'Digit3', expected: 'media', description: 'Number 3 key' },
                { key: 'KeyH', expected: 'home', description: 'H key' },
                { key: 'KeyT', expected: 'tech', description: 'T key' }
            ];

            const results = [];

            for (const test of keyboardTests) {
                try {
                    // Get initial state
                    const initialState = await this.page.evaluate(() => {
                        return window.vib34dSystem?.homeMaster?.getStateInfo().currentState;
                    });

                    // Send keydown event
                    await this.page.keyboard.press(test.key);
                    
                    // Wait for state change
                    await this.page.waitForTimeout(200);
                    
                    // Check final state
                    const finalState = await this.page.evaluate(() => {
                        return window.vib34dSystem?.homeMaster?.getStateInfo().currentState;
                    });

                    const success = finalState === test.expected;
                    results.push({
                        key: test.key,
                        description: test.description,
                        expected: test.expected,
                        actual: finalState,
                        success
                    });

                    console.log(`  ${success ? '✅' : '❌'} ${test.description}: ${finalState} (expected: ${test.expected})`);

                } catch (error) {
                    console.log(`  ❌ ${test.description}: Error - ${error.message}`);
                    results.push({
                        key: test.key,
                        description: test.description,
                        error: error.message,
                        success: false
                    });
                }
            }

            this.testResults.navigation.keyboardTests = results;
            const successCount = results.filter(r => r.success).length;
            console.log(`  📊 Keyboard Navigation Success Rate: ${successCount}/${results.length}`);

            return successCount > 0;

        } catch (error) {
            console.error('❌ Keyboard navigation test failed:', error.message);
            this.testResults.errors.push({ type: 'keyboardNavigation', error: error.message });
            return false;
        }
    }

    async testWebGLRendering() {
        console.log('\n🎮 Testing WebGL Rendering...');
        
        try {
            const webglStatus = await this.page.evaluate(() => {
                // Check for canvas elements
                const canvases = document.querySelectorAll('.card-visualizer');
                
                if (canvases.length === 0) {
                    return { error: 'No WebGL canvases found' };
                }

                const results = {
                    canvasCount: canvases.length,
                    webglContexts: 0,
                    activeVisualizers: 0,
                    renderingCanvases: []
                };

                // Check each canvas
                canvases.forEach((canvas, index) => {
                    try {
                        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                        if (gl) {
                            results.webglContexts++;
                            
                            // Check if there are shaders compiled
                            const hasProgram = gl.getParameter(gl.CURRENT_PROGRAM) !== null;
                            
                            results.renderingCanvases.push({
                                index,
                                id: canvas.id || `canvas-${index}`,
                                geometry: canvas.dataset.geometry,
                                width: canvas.width,
                                height: canvas.height,
                                hasContext: !!gl,
                                hasProgram,
                                error: null
                            });
                            
                            if (hasProgram) {
                                results.activeVisualizers++;
                            }
                        }
                    } catch (error) {
                        results.renderingCanvases.push({
                            index,
                            error: error.message,
                            hasContext: false
                        });
                    }
                });

                return results;
            });

            this.testResults.webglRendering = webglStatus;

            if (webglStatus.error) {
                console.log(`  ❌ ${webglStatus.error}`);
                return false;
            }

            console.log(`  ✅ WebGL Canvases Found: ${webglStatus.canvasCount}`);
            console.log(`  ✅ WebGL Contexts Created: ${webglStatus.webglContexts}`);
            console.log(`  ✅ Active Visualizers: ${webglStatus.activeVisualizers}`);

            webglStatus.renderingCanvases.forEach(canvas => {
                const status = canvas.hasContext ? '✅' : '❌';
                console.log(`    ${status} Canvas ${canvas.index}: ${canvas.geometry || 'unknown'} (${canvas.width}x${canvas.height})`);
            });

            return webglStatus.webglContexts > 0;

        } catch (error) {
            console.error('❌ WebGL rendering test failed:', error.message);
            this.testResults.errors.push({ type: 'webglRendering', error: error.message });
            return false;
        }
    }

    async takeScreenshot(filename) {
        try {
            await this.page.screenshot({ 
                path: `${filename}.png`, 
                fullPage: true 
            });
            console.log(`📸 Screenshot saved: ${filename}.png`);
        } catch (error) {
            console.error('❌ Screenshot failed:', error.message);
        }
    }

    async generateReport() {
        console.log('\n📊 Generating Test Report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                moduleLoading: Object.values(this.testResults.moduleLoading).every(loaded => loaded),
                configSystem: this.testResults.configSystem.isLoaded,
                stateManagement: this.testResults.stateManagement.isInitialized,
                navigation: this.testResults.navigation.navigationTests?.filter(t => t.correct).length > 0,
                webglRendering: this.testResults.webglRendering.webglContexts > 0
            },
            details: this.testResults,
            errors: this.testResults.errors
        };

        // Calculate overall success
        const successCount = Object.values(report.summary).filter(success => success).length;
        const totalTests = Object.keys(report.summary).length;
        
        console.log('\n🎯 TEST SUMMARY:');
        Object.entries(report.summary).forEach(([test, success]) => {
            console.log(`  ${success ? '✅' : '❌'} ${test}: ${success ? 'PASS' : 'FAIL'}`);
        });
        
        console.log(`\n📈 Overall Success Rate: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n⚠️  ERRORS ENCOUNTERED:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. [${error.type}] ${error.message || error.error}`);
            });
        }

        return report;
    }

    async runAllTests() {
        try {
            await this.initialize();
            
            console.log('🧪 Starting VIB34D System Testing Suite...\n');
            
            const results = {
                moduleLoading: await this.testModuleLoading(),
                configSystem: await this.testConfigSystem(), 
                stateManagement: await this.testStateManagement(),
                navigation: await this.testNavigation(),
                keyboardNavigation: await this.testKeyboardNavigation(),
                webglRendering: await this.testWebGLRendering()
            };

            // Take screenshot of final state
            await this.takeScreenshot('vib34d-test-results');

            const report = await this.generateReport();
            
            return report;

        } catch (error) {
            console.error('💥 Test suite failed:', error);
            return { error: error.message };
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new VIB34DSystemTester();
    tester.runAllTests().then(report => {
        console.log('\n✅ Testing Complete!');
        process.exit(report.error ? 1 : 0);
    }).catch(error => {
        console.error('💥 Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = VIB34DSystemTester;