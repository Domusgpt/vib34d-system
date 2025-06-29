/**
 * Simple Agent Test - Focused VIB34D System Testing
 * 
 * A streamlined test that focuses on core functionality
 * without complex browser automation setup issues.
 */

const puppeteer = require('puppeteer');

class SimpleAgentTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {};
    }

    async initialize() {
        console.log('🤖 Simple Agent Test: Initializing...');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1600, height: 1000 }
        });

        this.page = await this.browser.newPage();
        
        // Monitor console for errors
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`🚨 ${msg.text()}`);
            } else if (msg.text().includes('✅') || msg.text().includes('VIB34D')) {
                console.log(`📟 ${msg.text()}`);
            }
        });

        this.page.on('pageerror', error => {
            console.error(`💥 Page Error: ${error.message}`);
        });
    }

    async testSystemLoad() {
        console.log('\n📋 Testing System Load...');
        
        try {
            console.log('🌐 Loading VIB34D at http://localhost:8080...');
            await this.page.goto('http://localhost:8080', { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });

            // Wait for system initialization
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Take screenshot
            await this.page.screenshot({ path: 'vib34d-loaded.png', fullPage: false });
            console.log('📸 Screenshot saved: vib34d-loaded.png');

            // Check if system loaded
            const systemCheck = await this.page.evaluate(() => {
                const checks = {
                    vib34dSystem: !!window.vib34dSystem,
                    agentAPI: !!window.agentAPI,
                    systemReady: !!(window.vib34dSystem && window.vib34dSystem.isInitialized),
                    agentReady: !!(window.agentAPI && window.agentAPI.isReady)
                };
                
                if (window.agentAPI && window.agentAPI.isReady) {
                    checks.systemState = window.agentAPI.getSystemState();
                    checks.diagnostics = window.agentAPI.getDiagnostics();
                }
                
                return checks;
            });

            console.log('🔍 System Check Results:');
            console.log(`  VIB34D System: ${systemCheck.vib34dSystem ? '✅' : '❌'}`);
            console.log(`  Agent API: ${systemCheck.agentAPI ? '✅' : '❌'}`);
            console.log(`  System Ready: ${systemCheck.systemReady ? '✅' : '❌'}`);
            console.log(`  Agent Ready: ${systemCheck.agentReady ? '✅' : '❌'}`);

            if (systemCheck.systemState) {
                console.log(`  Current State: ${systemCheck.systemState.currentState}`);
                console.log(`  Modules Loaded: ${Object.values(systemCheck.systemState.moduleStatus).filter(Boolean).length}/6`);
            }

            this.results.systemLoad = systemCheck.agentReady;
            return systemCheck.agentReady;

        } catch (error) {
            console.error(`❌ System load failed: ${error.message}`);
            this.results.systemLoad = false;
            return false;
        }
    }

    async testAgentAPIBasics() {
        console.log('\n🤖 Testing Agent API Basics...');
        
        try {
            const apiTest = await this.page.evaluate(() => {
                if (!window.agentAPI) return { error: 'AgentAPI not found' };
                
                const results = {};
                
                try {
                    // Test basic methods
                    results.getSystemState = typeof window.agentAPI.getSystemState === 'function';
                    results.getMasterParameters = typeof window.agentAPI.getMasterParameters === 'function';
                    results.navigateTo = typeof window.agentAPI.navigateTo === 'function';
                    results.setMasterParameter = typeof window.agentAPI.setMasterParameter === 'function';
                    results.getDiagnostics = typeof window.agentAPI.getDiagnostics === 'function';
                    
                    // Test actual calls
                    const systemState = window.agentAPI.getSystemState();
                    results.systemStateCall = !!systemState.currentState;
                    
                    const params = window.agentAPI.getMasterParameters();
                    results.parametersCall = !!params && typeof params === 'object';
                    
                    const diagnostics = window.agentAPI.getDiagnostics();
                    results.diagnosticsCall = !!diagnostics.isReady;
                    
                    return results;
                } catch (error) {
                    return { error: error.message };
                }
            });

            if (apiTest.error) {
                console.log(`❌ API Test Error: ${apiTest.error}`);
                this.results.agentAPI = false;
                return false;
            }

            console.log('🔧 API Method Availability:');
            Object.entries(apiTest).forEach(([method, available]) => {
                if (typeof available === 'boolean') {
                    console.log(`  ${available ? '✅' : '❌'} ${method}`);
                }
            });

            const allWorking = Object.values(apiTest).every(val => val === true);
            this.results.agentAPI = allWorking;
            
            if (allWorking) {
                console.log('✅ All Agent API basics working');
            } else {
                console.log('❌ Some Agent API issues detected');
            }

            return allWorking;

        } catch (error) {
            console.error(`❌ Agent API test failed: ${error.message}`);
            this.results.agentAPI = false;
            return false;
        }
    }

    async testNavigation() {
        console.log('\n🧭 Testing Navigation...');
        
        try {
            const navTest = await this.page.evaluate(async () => {
                if (!window.agentAPI) return { error: 'AgentAPI not found' };
                
                const results = { states: [] };
                const testStates = ['tech', 'media', 'innovation', 'home'];
                
                for (const state of testStates) {
                    try {
                        const success = await window.agentAPI.navigateTo(state);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        const currentState = window.agentAPI.getSystemState().currentState;
                        
                        results.states.push({
                            target: state,
                            success: success,
                            actual: currentState,
                            correct: currentState === state
                        });
                    } catch (error) {
                        results.states.push({
                            target: state,
                            success: false,
                            error: error.message
                        });
                    }
                }
                
                return results;
            });

            if (navTest.error) {
                console.log(`❌ Navigation Error: ${navTest.error}`);
                this.results.navigation = false;
                return false;
            }

            console.log('🎯 Navigation Test Results:');
            let successCount = 0;
            navTest.states.forEach(test => {
                if (test.correct) {
                    console.log(`  ✅ ${test.target}: ${test.actual}`);
                    successCount++;
                } else {
                    console.log(`  ❌ ${test.target}: ${test.error || `Expected ${test.target}, got ${test.actual}`}`);
                }
            });

            // Take screenshot of final state
            await this.page.screenshot({ path: 'vib34d-navigation.png', fullPage: false });
            console.log('📸 Screenshot saved: vib34d-navigation.png');

            const navSuccess = successCount >= 3; // 75% pass rate
            this.results.navigation = navSuccess;
            
            console.log(`📊 Navigation: ${successCount}/${navTest.states.length} states worked`);
            return navSuccess;

        } catch (error) {
            console.error(`❌ Navigation test failed: ${error.message}`);
            this.results.navigation = false;
            return false;
        }
    }

    async testParameters() {
        console.log('\n🎛️ Testing Parameter Control...');
        
        try {
            const paramTest = await this.page.evaluate(() => {
                if (!window.agentAPI) return { error: 'AgentAPI not found' };
                
                const results = { parameters: [] };
                const testParams = [
                    { name: 'u_dimension', value: 4.2 },
                    { name: 'u_morphFactor', value: 0.7 }
                ];
                
                for (const param of testParams) {
                    try {
                        const initialParams = window.agentAPI.getMasterParameters();
                        const initialValue = initialParams[param.name];
                        
                        const success = window.agentAPI.setMasterParameter(param.name, param.value);
                        
                        // Wait for update
                        setTimeout(() => {}, 100);
                        
                        const updatedParams = window.agentAPI.getMasterParameters();
                        const updatedValue = updatedParams[param.name];
                        
                        results.parameters.push({
                            name: param.name,
                            targetValue: param.value,
                            initialValue: initialValue,
                            updatedValue: updatedValue,
                            success: success,
                            changed: Math.abs(updatedValue - initialValue) > 0.01
                        });
                    } catch (error) {
                        results.parameters.push({
                            name: param.name,
                            success: false,
                            error: error.message
                        });
                    }
                }
                
                return results;
            });

            if (paramTest.error) {
                console.log(`❌ Parameter Error: ${paramTest.error}`);
                this.results.parameters = false;
                return false;
            }

            console.log('🔧 Parameter Test Results:');
            let successCount = 0;
            paramTest.parameters.forEach(test => {
                if (test.success && test.changed) {
                    console.log(`  ✅ ${test.name}: ${test.initialValue} → ${test.updatedValue}`);
                    successCount++;
                } else {
                    console.log(`  ❌ ${test.name}: ${test.error || 'No change detected'}`);
                }
            });

            // Take screenshot showing parameter effects
            await this.page.screenshot({ path: 'vib34d-parameters.png', fullPage: false });
            console.log('📸 Screenshot saved: vib34d-parameters.png');

            const paramSuccess = successCount >= 1; // At least one parameter worked
            this.results.parameters = paramSuccess;
            
            console.log(`📊 Parameters: ${successCount}/${paramTest.parameters.length} parameters worked`);
            return paramSuccess;

        } catch (error) {
            console.error(`❌ Parameter test failed: ${error.message}`);
            this.results.parameters = false;
            return false;
        }
    }

    async testInteractions() {
        console.log('\n🌊 Testing Interactions...');
        
        try {
            // Test if we can find adaptive cards and trigger interactions
            const cards = await this.page.$$('.adaptive-card');
            console.log(`🃏 Found ${cards.length} adaptive cards`);

            if (cards.length > 0) {
                // Hover over first card
                console.log('🖱️ Testing hover interaction...');
                await cards[0].hover();
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Click on card
                console.log('🖱️ Testing click interaction...');
                await cards[0].click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Take screenshot
                await this.page.screenshot({ path: 'vib34d-interactions.png', fullPage: false });
                console.log('📸 Screenshot saved: vib34d-interactions.png');

                this.results.interactions = true;
                console.log('✅ Interaction testing completed');
                return true;
            } else {
                console.log('❌ No adaptive cards found for interaction testing');
                this.results.interactions = false;
                return false;
            }

        } catch (error) {
            console.error(`❌ Interaction test failed: ${error.message}`);
            this.results.interactions = false;
            return false;
        }
    }

    async generateReport() {
        console.log('\n📋 SIMPLE AGENT TEST REPORT');
        console.log('============================');
        
        const tests = [
            { name: 'System Load', result: this.results.systemLoad },
            { name: 'Agent API', result: this.results.agentAPI },
            { name: 'Navigation', result: this.results.navigation },
            { name: 'Parameters', result: this.results.parameters },
            { name: 'Interactions', result: this.results.interactions }
        ];

        const passed = tests.filter(test => test.result).length;
        const total = tests.length;
        const successRate = (passed / total * 100).toFixed(1);

        console.log('\n🎯 TEST RESULTS:');
        tests.forEach(test => {
            console.log(`  ${test.result ? '✅' : '❌'} ${test.name}`);
        });

        console.log(`\n📊 SUCCESS RATE: ${passed}/${total} (${successRate}%)`);
        
        const overallSuccess = passed >= (total * 0.8); // 80% pass rate
        
        console.log(`\n${overallSuccess ? '🎉 AGENT TEST PASSED!' : '💥 AGENT TEST FAILED!'}`);
        console.log(`VIB34D system is ${overallSuccess ? 'READY' : 'NOT READY'} for agent use.`);
        
        console.log('\n🔍 Browser left open for manual inspection...');
        console.log('📸 Screenshots captured: vib34d-loaded.png, vib34d-navigation.png, vib34d-parameters.png, vib34d-interactions.png');
        
        return { success: overallSuccess, passed, total, successRate };
    }

    async runTest() {
        try {
            await this.initialize();
            
            console.log('🤖 SIMPLE AGENT TEST: VIB34D System');
            console.log('Testing core functionality from agent perspective...\n');
            
            await this.testSystemLoad();
            await this.testAgentAPIBasics();
            await this.testNavigation();
            await this.testParameters();
            await this.testInteractions();

            const report = await this.generateReport();
            
            return report;

        } catch (error) {
            console.error('💥 Agent test crashed:', error);
            return { success: false, error: error.message };
        }
        // Keep browser open for inspection
    }
}

// Run the test
const tester = new SimpleAgentTest();
tester.runTest().then(report => {
    console.log('\n✅ Simple Agent Test Complete!');
    // Don't exit - keep browser open
}).catch(error => {
    console.error('💥 Test failed:', error);
});