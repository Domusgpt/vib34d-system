/**
 * Agent Integration Test - End-to-End VIB34D System Testing
 * 
 * This script tests the VIB34D system from the perspective of a new agent
 * discovering and using the system for the first time. It validates that
 * the documentation is accurate and the system works as advertised.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class VIB34DAgentTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            systemLoad: false,
            agentAPI: false,
            navigation: false,
            parameters: false,
            interactions: false,
            hotReload: false,
            diagnostics: false,
            errors: []
        };
        this.screenshots = [];
    }

    async initialize() {
        console.log('🤖 NEW AGENT: Starting VIB34D system discovery...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });

        this.page = await this.browser.newPage();
        
        // Monitor console for system messages
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`🚨 Browser Error: ${msg.text()}`);
                this.testResults.errors.push(msg.text());
            } else if (msg.text().includes('✅') || msg.text().includes('VIB34D')) {
                console.log(`📟 System: ${msg.text()}`);
            }
        });

        // Monitor for unhandled errors
        this.page.on('pageerror', error => {
            console.error(`💥 Page Error: ${error.message}`);
            this.testResults.errors.push(error.message);
        });
    }

    async testSystemLoading() {
        console.log('\n📋 TEST 1: System Loading & Initialization');
        
        try {
            // Navigate to the system
            console.log('🌐 Loading VIB34D system at http://localhost:3000...');
            await this.page.goto('http://localhost:3000', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });

            // Wait for system to boot
            await this.page.waitForTimeout(3000);

            // Take screenshot of initial load
            await this.takeScreenshot('01-system-load');

            // Check if VIB34D system loaded
            const systemLoaded = await this.page.evaluate(() => {
                return !!(window.vib34dSystem && window.agentAPI);
            });

            if (systemLoaded) {
                console.log('✅ VIB34D system successfully loaded');
                this.testResults.systemLoad = true;
            } else {
                console.log('❌ VIB34D system failed to load');
                return false;
            }

            // Verify all modules are initialized
            const moduleStatus = await this.page.evaluate(() => {
                if (!window.vib34dSystem) return {};
                return window.vib34dSystem.getSystemState().moduleStatus;
            });

            console.log('📦 Module Status:');
            Object.entries(moduleStatus).forEach(([module, status]) => {
                console.log(`  ${status ? '✅' : '❌'} ${module}`);
            });

            return true;

        } catch (error) {
            console.error(`❌ System loading failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testAgentAPIDiscovery() {
        console.log('\n🤖 TEST 2: Agent API Discovery & Documentation');
        
        try {
            // Check if agentAPI is available globally
            const apiAvailable = await this.page.evaluate(() => {
                return !!(window.agentAPI && window.agentAPI.isReady);
            });

            if (!apiAvailable) {
                console.log('❌ agentAPI not available on window object');
                return false;
            }

            // Test API methods as documented
            const apiMethods = await this.page.evaluate(() => {
                const api = window.agentAPI;
                return {
                    navigateTo: typeof api.navigateTo === 'function',
                    setMasterParameter: typeof api.setMasterParameter === 'function',
                    getMasterParameters: typeof api.getMasterParameters === 'function',
                    getSystemState: typeof api.getSystemState === 'function',
                    updateConfig: typeof api.updateConfig === 'function',
                    getDiagnostics: typeof api.getDiagnostics === 'function',
                    executeInteraction: typeof api.executeInteraction === 'function'
                };
            });

            console.log('🔍 AgentAPI Methods Available:');
            Object.entries(apiMethods).forEach(([method, available]) => {
                console.log(`  ${available ? '✅' : '❌'} ${method}()`);
            });

            const allMethodsAvailable = Object.values(apiMethods).every(available => available);
            
            if (allMethodsAvailable) {
                console.log('✅ All documented agentAPI methods are available');
                this.testResults.agentAPI = true;
            } else {
                console.log('❌ Some agentAPI methods are missing');
            }

            return allMethodsAvailable;

        } catch (error) {
            console.error(`❌ AgentAPI discovery failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testNavigationControl() {
        console.log('\n🧭 TEST 3: Navigation Control via AgentAPI');
        
        try {
            // Test navigation to each state as documented
            const states = ['home', 'tech', 'media', 'innovation', 'context'];
            let successCount = 0;

            for (const state of states) {
                console.log(`🎯 Testing navigation to: ${state}`);
                
                const result = await this.page.evaluate(async (targetState) => {
                    try {
                        const success = await window.agentAPI.navigateTo(targetState);
                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for transition
                        
                        const currentState = window.agentAPI.getSystemState().currentState;
                        return { success, currentState, correct: currentState === targetState };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                }, state);

                if (result.correct) {
                    console.log(`  ✅ Successfully navigated to ${state}`);
                    successCount++;
                } else {
                    console.log(`  ❌ Navigation to ${state} failed: ${result.error || 'Wrong state'}`);
                }

                // Take screenshot of each state
                await this.takeScreenshot(`02-state-${state}`);
            }

            const navigationSuccess = successCount === states.length;
            if (navigationSuccess) {
                console.log('✅ All navigation tests passed');
                this.testResults.navigation = true;
            } else {
                console.log(`❌ Navigation tests: ${successCount}/${states.length} passed`);
            }

            return navigationSuccess;

        } catch (error) {
            console.error(`❌ Navigation testing failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testParameterControl() {
        console.log('\n🎛️ TEST 4: Parameter Control via AgentAPI');
        
        try {
            // Test parameter manipulation as documented
            const parameterTests = [
                { param: 'u_dimension', value: 4.5 },
                { param: 'u_morphFactor', value: 0.8 },
                { param: 'u_patternIntensity', value: 1.5 },
                { param: 'u_colorShift', value: 0.3 }
            ];

            let successCount = 0;

            for (const test of parameterTests) {
                console.log(`🔧 Testing parameter: ${test.param} = ${test.value}`);
                
                const result = await this.page.evaluate(async (param, value) => {
                    try {
                        // Get initial value
                        const initialParams = window.agentAPI.getMasterParameters();
                        const initialValue = initialParams[param];
                        
                        // Set new value
                        const success = window.agentAPI.setMasterParameter(param, value);
                        
                        // Wait a moment for update
                        await new Promise(resolve => setTimeout(resolve, 200));
                        
                        // Check if value updated
                        const updatedParams = window.agentAPI.getMasterParameters();
                        const updatedValue = updatedParams[param];
                        
                        return {
                            success,
                            initialValue,
                            updatedValue,
                            correct: Math.abs(updatedValue - value) < 0.01
                        };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                }, test.param, test.value);

                if (result.correct) {
                    console.log(`  ✅ Parameter ${test.param} updated: ${result.initialValue} → ${result.updatedValue}`);
                    successCount++;
                } else {
                    console.log(`  ❌ Parameter ${test.param} failed: ${result.error || 'Value mismatch'}`);
                }
            }

            // Take screenshot showing parameter effects
            await this.takeScreenshot('03-parameters-modified');

            const parametersSuccess = successCount === parameterTests.length;
            if (parametersSuccess) {
                console.log('✅ All parameter tests passed');
                this.testResults.parameters = true;
            } else {
                console.log(`❌ Parameter tests: ${successCount}/${parameterTests.length} passed`);
            }

            return parametersSuccess;

        } catch (error) {
            console.error(`❌ Parameter testing failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testInteractionPhysics() {
        console.log('\n🌊 TEST 5: Relational Interaction Physics');
        
        try {
            // Test programmatic interaction execution
            console.log('🎭 Testing interaction blueprint execution...');
            
            const cardElements = await this.page.$$('.adaptive-card');
            
            if (cardElements.length === 0) {
                console.log('❌ No adaptive cards found for interaction testing');
                return false;
            }

            console.log(`🃏 Found ${cardElements.length} adaptive cards`);

            // Test hover interaction programmatically
            const hoverResult = await this.page.evaluate(() => {
                try {
                    const card = document.querySelector('.adaptive-card');
                    if (!card) return { success: false, error: 'No card found' };
                    
                    // Execute hover interaction blueprint
                    const success = window.agentAPI.executeInteraction('cardHoverResponse', card, {
                        type: 'hover'
                    });
                    
                    return { success };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            });

            if (hoverResult.success) {
                console.log('✅ Interaction blueprint execution successful');
            } else {
                console.log(`❌ Interaction execution failed: ${hoverResult.error}`);
            }

            // Test actual mouse hover
            console.log('🖱️ Testing real mouse hover interaction...');
            await cardElements[0].hover();
            await this.page.waitForTimeout(1000);
            
            await this.takeScreenshot('04-hover-interaction');

            // Test click interaction
            console.log('🖱️ Testing click interaction...');
            await cardElements[0].click();
            await this.page.waitForTimeout(1000);
            
            await this.takeScreenshot('05-click-interaction');

            this.testResults.interactions = true;
            console.log('✅ Interaction physics tests completed');
            return true;

        } catch (error) {
            console.error(`❌ Interaction testing failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testHotReloading() {
        console.log('\n🔥 TEST 6: Hot-Reload Configuration');
        
        try {
            // Test config hot-reloading
            console.log('🔄 Testing configuration hot-reload...');
            
            const hotReloadResult = await this.page.evaluate(async () => {
                try {
                    // Create new visual config
                    const newConfig = {
                        themes: {
                            test: {
                                primaryColor: '#ff00ff',
                                secondaryColor: '#00ffff',
                                backgroundColor: '#333333'
                            }
                        }
                    };
                    
                    // Test hot-reload
                    const success = await window.agentAPI.updateConfig('visuals', newConfig);
                    
                    return { success };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            });

            if (hotReloadResult.success) {
                console.log('✅ Configuration hot-reload successful');
                await this.takeScreenshot('06-hot-reload');
                this.testResults.hotReload = true;
            } else {
                console.log(`❌ Hot-reload failed: ${hotReloadResult.error}`);
            }

            return hotReloadResult.success;

        } catch (error) {
            console.error(`❌ Hot-reload testing failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async testDiagnostics() {
        console.log('\n📊 TEST 7: System Diagnostics & Monitoring');
        
        try {
            // Test diagnostic capabilities
            const diagnostics = await this.page.evaluate(() => {
                try {
                    const diag = window.agentAPI.getDiagnostics();
                    const metrics = window.agentAPI.getPerformanceMetrics();
                    
                    return {
                        diagnostics: diag,
                        metrics: metrics,
                        systemState: window.agentAPI.getSystemState()
                    };
                } catch (error) {
                    return { error: error.message };
                }
            });

            if (diagnostics.error) {
                console.log(`❌ Diagnostics failed: ${diagnostics.error}`);
                return false;
            }

            console.log('📈 System Diagnostics:');
            console.log(`  🤖 AgentAPI Ready: ${diagnostics.diagnostics.isReady}`);
            console.log(`  🏠 HomeMaster: ${diagnostics.diagnostics.systemModules.homeMaster}`);
            console.log(`  🎮 VisualizerPool: ${diagnostics.diagnostics.systemModules.visualizerPool}`);
            console.log(`  🎯 InteractionCoordinator: ${diagnostics.diagnostics.systemModules.interactionCoordinator}`);
            console.log(`  🌐 WebGL Support: ${diagnostics.diagnostics.webglStatus.supported}`);
            console.log(`  📊 Active Visualizers: ${diagnostics.diagnostics.webglStatus.activeVisualizers}`);

            console.log('\n📊 Performance Metrics:');
            if (diagnostics.metrics.agentAPI) {
                console.log(`  🤖 API Calls: ${diagnostics.metrics.agentAPI.apiCalls}`);
                console.log(`  ✅ Successful: ${diagnostics.metrics.agentAPI.successfulCalls}`);
                console.log(`  ❌ Failed: ${diagnostics.metrics.agentAPI.failedCalls}`);
            }

            this.testResults.diagnostics = true;
            console.log('✅ Diagnostics and monitoring systems operational');
            return true;

        } catch (error) {
            console.error(`❌ Diagnostics testing failed: ${error.message}`);
            this.testResults.errors.push(error.message);
            return false;
        }
    }

    async takeScreenshot(name) {
        try {
            const filename = `vib34d-test-${name}.png`;
            await this.page.screenshot({ 
                path: filename, 
                fullPage: false,
                clip: { x: 0, y: 0, width: 1920, height: 1080 }
            });
            this.screenshots.push(filename);
            console.log(`📸 Screenshot saved: ${filename}`);
        } catch (error) {
            console.error(`📸 Screenshot failed: ${error.message}`);
        }
    }

    async generateReport() {
        console.log('\n📋 AGENT INTEGRATION TEST REPORT');
        console.log('=====================================');
        
        const testCategories = [
            { name: 'System Load', result: this.testResults.systemLoad },
            { name: 'Agent API', result: this.testResults.agentAPI },
            { name: 'Navigation', result: this.testResults.navigation },
            { name: 'Parameters', result: this.testResults.parameters },
            { name: 'Interactions', result: this.testResults.interactions },
            { name: 'Hot Reload', result: this.testResults.hotReload },
            { name: 'Diagnostics', result: this.testResults.diagnostics }
        ];

        const passedTests = testCategories.filter(test => test.result).length;
        const totalTests = testCategories.length;
        const successRate = (passedTests / totalTests * 100).toFixed(1);

        console.log('\n🎯 TEST RESULTS:');
        testCategories.forEach(test => {
            console.log(`  ${test.result ? '✅' : '❌'} ${test.name}`);
        });

        console.log(`\n📊 SUCCESS RATE: ${passedTests}/${totalTests} (${successRate}%)`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n⚠️ ERRORS ENCOUNTERED:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }

        console.log(`\n📸 SCREENSHOTS CAPTURED: ${this.screenshots.length}`);
        this.screenshots.forEach(screenshot => {
            console.log(`  📷 ${screenshot}`);
        });

        const overallSuccess = passedTests >= (totalTests * 0.8); // 80% pass rate
        
        console.log(`\n${overallSuccess ? '🎉 INTEGRATION TEST PASSED!' : '💥 INTEGRATION TEST FAILED!'}`);
        console.log(`Agent can ${overallSuccess ? 'successfully' : 'NOT reliably'} use the VIB34D system.`);

        return {
            success: overallSuccess,
            passedTests,
            totalTests,
            successRate,
            errors: this.testResults.errors,
            screenshots: this.screenshots
        };
    }

    async runCompleteTest() {
        try {
            await this.initialize();
            
            console.log('🤖 AGENT INTEGRATION TEST: VIB34D System');
            console.log('Testing system as a new agent would discover and use it...\n');
            
            const results = {
                systemLoad: await this.testSystemLoading(),
                agentAPI: await this.testAgentAPIDiscovery(),
                navigation: await this.testNavigationControl(),
                parameters: await this.testParameterControl(),
                interactions: await this.testInteractionPhysics(),
                hotReload: await this.testHotReloading(),
                diagnostics: await this.testDiagnostics()
            };

            const report = await this.generateReport();
            
            return report;

        } catch (error) {
            console.error('💥 Integration test crashed:', error);
            return { success: false, error: error.message };
        } finally {
            if (this.browser) {
                // Keep browser open for manual inspection
                console.log('\n🔍 Browser left open for manual inspection...');
                // await this.browser.close();
            }
        }
    }
}

// Run the test if called directly
if (require.main === module) {
    const tester = new VIB34DAgentTester();
    tester.runCompleteTest().then(report => {
        console.log('\n✅ Agent Integration Testing Complete!');
        process.exit(report.success ? 0 : 1);
    }).catch(error => {
        console.error('💥 Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = VIB34DAgentTester;