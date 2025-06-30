/**
 * Final comprehensive system test
 * Tests all critical functionality as requested by the user
 */

const puppeteer = require('puppeteer');

async function finalSystemTest() {
    let browser = null;
    
    try {
        console.log('🚀 Final VIB34D System Test - End-to-End Validation');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Track console messages
        const messages = [];
        page.on('console', msg => {
            const text = msg.text();
            messages.push(text);
            
            if (text.includes('WebGL') || text.includes('shader') || text.includes('navigation') || text.includes('✅') || text.includes('❌')) {
                console.log(`📄 ${text}`);
            }
        });
        
        console.log('📄 Loading VIB34D system at http://localhost:8080...');
        await page.goto('http://localhost:8080');
        
        // Wait for system initialization
        console.log('⏳ Waiting for system initialization...');
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Test 1: Check if system loaded
        console.log('\n🧪 Test 1: System Loading');
        const systemLoaded = await page.evaluate(() => {
            return typeof window.vib34dSystem !== 'undefined' && typeof window.agentAPI !== 'undefined';
        });
        console.log(`Result: ${systemLoaded ? '✅ PASS' : '❌ FAIL'} - System loaded: ${systemLoaded}`);
        
        if (!systemLoaded) {
            console.log('❌ System failed to load - aborting tests');
            return;
        }
        
        // Test 2: Check WebGL shader compilation
        console.log('\n🧪 Test 2: WebGL Shader Compilation');
        const webglStatus = await page.evaluate(() => {
            const visualizerPool = window.vib34dSystem.visualizerPool;
            return {
                isInitialized: visualizerPool?.isInitialized,
                webglSupported: visualizerPool?.webglSupported,
                activeVisualizers: visualizerPool?.metrics?.activeVisualizers,
                webglErrors: visualizerPool?.metrics?.webglErrors,
                totalVisualizers: visualizerPool?.getVisualizerIds()?.length
            };
        });
        
        const webglSuccess = webglStatus.webglSupported && webglStatus.webglErrors === 0;
        console.log(`Result: ${webglSuccess ? '✅ PASS' : '❌ FAIL'} - WebGL Status:`, webglStatus);
        
        // Test 3: Test navigation
        console.log('\n🧪 Test 3: Navigation System');
        const navigationTests = [];
        
        for (const state of ['tech', 'media', 'innovation', 'context', 'home']) {
            const result = await page.evaluate((targetState) => {
                try {
                    const api = window.agentAPI;
                    if (!api) return { success: false, error: 'AgentAPI not available' };
                    
                    // Navigate to state
                    const navResult = api.navigateTo(targetState);
                    
                    // Check current state after a brief delay
                    setTimeout(() => {
                        const currentState = api.getSystemState()?.currentState;
                        return { 
                            success: navResult,
                            currentState: currentState,
                            targetState: targetState,
                            match: currentState === targetState
                        };
                    }, 100);
                    
                    // Return immediate result
                    return { success: navResult, targetState: targetState };
                } catch (error) {
                    return { success: false, error: error.message, targetState: targetState };
                }
            }, state);
            
            navigationTests.push(result);
            console.log(`  - Navigate to ${state}: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
            
            // Small delay between navigation tests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const navigationSuccess = navigationTests.every(test => test.success);
        console.log(`Result: ${navigationSuccess ? '✅ PASS' : '❌ FAIL'} - Navigation working`);
        
        // Test 4: Test agentAPI functionality
        console.log('\n🧪 Test 4: Agent API Functionality');
        const apiTests = await page.evaluate(() => {
            const api = window.agentAPI;
            if (!api) return { available: false };
            
            try {
                return {
                    available: true,
                    hasNavigateTo: typeof api.navigateTo === 'function',
                    hasSetParameter: typeof api.setMasterParameter === 'function',
                    hasGetDiagnostics: typeof api.getDiagnostics === 'function',
                    hasUpdateConfig: typeof api.updateConfig === 'function',
                    diagnostics: api.getDiagnostics()
                };
            } catch (error) {
                return { available: true, error: error.message };
            }
        });
        
        const apiSuccess = apiTests.available && apiTests.hasNavigateTo && apiTests.hasSetParameter;
        console.log(`Result: ${apiSuccess ? '✅ PASS' : '❌ FAIL'} - Agent API functional:`, {
            available: apiTests.available,
            methods: `${apiTests.hasNavigateTo ? '✓' : '✗'}nav ${apiTests.hasSetParameter ? '✓' : '✗'}param ${apiTests.hasGetDiagnostics ? '✓' : '✗'}diag`
        });
        
        // Test 5: System Diagnostics
        console.log('\n🧪 Test 5: System Diagnostics');
        const diagnostics = await page.evaluate(() => {
            return window.agentAPI?.getDiagnostics();
        });
        
        console.log('System Diagnostics:', {
            modules: diagnostics?.modules ? Object.keys(diagnostics.modules).length : 0,
            initialized: diagnostics?.systemStatus?.initialized,
            errors: diagnostics?.errorLog?.length || 0
        });
        
        // Summary
        console.log('\n📊 FINAL TEST SUMMARY');
        console.log('======================');
        console.log(`🏗️  System Loading: ${systemLoaded ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`🎮 WebGL Rendering: ${webglSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`🧭 Navigation: ${navigationSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`🤖 Agent API: ${apiSuccess ? '✅ PASS' : '❌ FAIL'}`);
        
        const overallSuccess = systemLoaded && webglSuccess && navigationSuccess && apiSuccess;
        console.log(`\n🎯 OVERALL: ${overallSuccess ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
        
        if (overallSuccess) {
            console.log('\n🎉 VIB34D System is fully operational and ready for use!');
        } else {
            console.log('\n⚠️  Issues detected - see test results above');
        }
        
        // Keep browser open for inspection if requested
        console.log('\n🔍 System running at http://localhost:8080');
        console.log('📋 Use browser dev tools to inspect further');
        console.log('🛑 Press Ctrl+C to close browser and exit');
        
        // Keep running until manually stopped
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            // Don't auto-close for manual inspection
            // await browser.close();
        }
    }
}

finalSystemTest();