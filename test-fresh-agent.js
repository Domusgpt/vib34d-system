/**
 * Fresh Agent Test - Using VIB34D System to Build CyberPunk 2077 Theme
 * 
 * This test simulates a new agent using only the documentation and agentAPI
 * to create a completely new themed experience from scratch.
 */

const puppeteer = require('puppeteer');

class FreshAgentTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.agentAPI = null;
    }

    async initialize() {
        console.log('🤖 Fresh Agent starting VIB34D system test...\n');
        
        this.browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });

        // Set up console logging
        this.page.on('console', msg => {
            const type = msg.type();
            if (type === 'error') {
                console.error('❌ Browser Error:', msg.text());
            } else {
                console.log(`📝 [${type}] ${msg.text()}`);
            }
        });

        // Navigate to the VIB34D system
        console.log('🌐 Navigating to VIB34D system...');
        await this.page.goto('http://localhost:9000', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for system to fully initialize
        await this.page.waitForTimeout(3000);
        
        console.log('✅ Page loaded, checking system status...\n');
    }

    async checkSystemStatus() {
        console.log('🔍 Step 1: Checking if VIB34D system is ready...');
        
        const systemCheck = await this.page.evaluate(() => {
            // Check if agentAPI is available globally
            if (!window.agentAPI) {
                return { error: 'window.agentAPI not found!' };
            }

            // Get diagnostics
            const diagnostics = window.agentAPI.getDiagnostics();
            
            return {
                apiReady: window.agentAPI.isReady,
                version: window.agentAPI.version,
                modules: diagnostics.systemModules,
                webgl: diagnostics.webglStatus,
                currentState: window.agentAPI.getSystemState()
            };
        });

        if (systemCheck.error) {
            console.error('❌ System Error:', systemCheck.error);
            return false;
        }

        console.log('📊 System Status:');
        console.log(`   API Ready: ${systemCheck.apiReady ? '✅' : '❌'}`);
        console.log(`   Version: ${systemCheck.version}`);
        console.log(`   Current State: ${systemCheck.currentState.currentState}`);
        console.log(`   WebGL: ${systemCheck.webgl.supported ? '✅' : '❌'} (${systemCheck.webgl.activeVisualizers} visualizers)`);
        console.log(`   Modules:`, systemCheck.modules);
        console.log();

        return systemCheck.apiReady;
    }

    async testNavigation() {
        console.log('🧭 Step 2: Testing navigation between states...');
        
        const states = ['home', 'tech', 'media', 'innovation', 'context'];
        
        for (const state of states) {
            console.log(`   Navigating to: ${state}`);
            
            const result = await this.page.evaluate(async (targetState) => {
                const success = await window.agentAPI.navigateTo(targetState);
                const currentState = window.agentAPI.getSystemState().currentState;
                return { success, currentState };
            }, state);
            
            console.log(`   → Result: ${result.success ? '✅' : '❌'} (current: ${result.currentState})`);
            
            // Take screenshot of each state
            await this.page.screenshot({ 
                path: `state-${state}.png`,
                fullPage: false 
            });
            
            await this.page.waitForTimeout(1500); // Let animations complete
        }
        
        console.log();
    }

    async createCyberPunkTheme() {
        console.log('🎨 Step 3: Creating custom CyberPunk 2077 theme...\n');
        
        // Define CyberPunk color scheme
        const cyberPunkVisuals = {
            themes: {
                cyberpunk: {
                    primaryColor: '#00ffff',      // Neon cyan
                    secondaryColor: '#ff00ff',    // Neon magenta
                    accentColor: '#ffff00',       // Neon yellow
                    backgroundColor: '#0a0a0a',   // Deep black
                    surfaceColor: '#1a0a1a',      // Purple-tinted black
                    textColor: '#00ffff',         // Cyan text
                    borderColor: '#ff00ff',       // Magenta borders
                    glowColor: '#00ffff',         // Cyan glow
                    warningColor: '#ff0080',      // Hot pink warning
                    successColor: '#00ff00'       // Neon green success
                }
            },
            geometries: {
                glitchCube: {
                    type: 'hypercube',
                    parameters: {
                        u_dimension: 4.5,
                        u_morphFactor: 0.8,
                        u_rotationSpeed: 1.2,
                        u_gridDensity: 12,
                        u_lineThickness: 0.03,
                        u_patternIntensity: 1.5,
                        u_glitchIntensity: 0.15,
                        u_colorShift: 0.3
                    }
                }
            }
        };

        console.log('   Applying CyberPunk visual configuration...');
        
        const visualResult = await this.page.evaluate(async (config) => {
            try {
                const result = await window.agentAPI.updateConfig('visuals', config);
                return { success: true, result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }, cyberPunkVisuals);

        console.log(`   → Visual config: ${visualResult.success ? '✅ Applied' : '❌ Failed'}`);
        if (!visualResult.success) {
            console.error('   Error:', visualResult.error);
        }

        // Update behavior for more aggressive interactions
        const cyberPunkBehavior = {
            interactionBlueprints: {
                cyberGlitch: {
                    trigger: 'onHover',
                    selector: '.adaptive-card',
                    reactions: [
                        {
                            target: 'subject',
                            animation: {
                                'transform.scale': { to: 1.15, curve: 'parabolic', duration: 200 },
                                'u_glitchIntensity': { to: 0.3, curve: 'easeIn', duration: 100 },
                                'border-color': { to: '#00ffff', curve: 'linear', duration: 150 }
                            }
                        },
                        {
                            target: 'ecosystem',
                            animation: {
                                'u_colorShift': { to: '+=0.5', curve: 'easeOut', duration: 300 },
                                'opacity': { to: 0.6, curve: 'linear', duration: 200 }
                            }
                        },
                        {
                            target: 'global',
                            animation: {
                                'u_glitchIntensity': { to: '+=0.1', curve: 'easeInOut', duration: 400 },
                                'u_dimension': { to: '+=0.3', curve: 'cubic', duration: 500 }
                            }
                        }
                    ],
                    revertOn: 'onLeave',
                    revertDelay: 50
                }
            },
            stateModifiers: {
                tech: {
                    cyberGlitch: {
                        parameterMultipliers: {
                            u_glitchIntensity: 2.0,
                            u_colorShift: 1.5
                        }
                    }
                }
            }
        };

        console.log('   Applying CyberPunk behavior configuration...');
        
        const behaviorResult = await this.page.evaluate(async (config) => {
            try {
                const result = await window.agentAPI.updateConfig('behavior', config);
                return { success: true, result };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }, cyberPunkBehavior);

        console.log(`   → Behavior config: ${behaviorResult.success ? '✅ Applied' : '❌ Failed'}`);

        // Take screenshot of CyberPunk theme
        await this.page.waitForTimeout(2000);
        await this.page.screenshot({ 
            path: 'cyberpunk-theme.png',
            fullPage: true 
        });

        console.log('   📸 Screenshot saved: cyberpunk-theme.png\n');
    }

    async testInteractions() {
        console.log('🖱️ Step 4: Testing CyberPunk interactions...');

        // Find adaptive cards
        const cards = await this.page.$$('.adaptive-card');
        console.log(`   Found ${cards.length} adaptive cards`);

        if (cards.length > 0) {
            // Test hover interaction on first card
            console.log('   Testing hover on first card...');
            const firstCard = cards[0];
            const box = await firstCard.boundingBox();
            
            // Move mouse to card
            await this.page.mouse.move(box.x + box.width/2, box.y + box.height/2);
            await this.page.waitForTimeout(1000);
            
            // Check if glitch effect applied
            const glitchActive = await this.page.evaluate(() => {
                const params = window.agentAPI.getMasterParameters();
                return params.u_glitchIntensity > 0;
            });
            
            console.log(`   → Glitch effect: ${glitchActive ? '✅ Active' : '❌ Inactive'}`);
            
            // Screenshot during hover
            await this.page.screenshot({ 
                path: 'cyberpunk-hover.png',
                fullPage: false 
            });
            
            // Move mouse away
            await this.page.mouse.move(100, 100);
            await this.page.waitForTimeout(1000);
        }

        console.log();
    }

    async testParameterControl() {
        console.log('🎛️ Step 5: Testing parameter control...');

        const parameterTests = [
            { name: 'u_dimension', value: 5.0, description: 'Maximum 5D projection' },
            { name: 'u_glitchIntensity', value: 0.25, description: 'Heavy glitch' },
            { name: 'u_rotationSpeed', value: 2.0, description: 'Fast rotation' },
            { name: 'u_colorShift', value: 0.5, description: 'Color warping' }
        ];

        for (const test of parameterTests) {
            console.log(`   Setting ${test.name} = ${test.value} (${test.description})`);
            
            const result = await this.page.evaluate(async (param, val) => {
                return window.agentAPI.setMasterParameter(param, val);
            }, test.name, test.value);
            
            console.log(`   → Result: ${result ? '✅' : '❌'}`);
            await this.page.waitForTimeout(500);
        }

        // Final screenshot with all parameters
        await this.page.screenshot({ 
            path: 'cyberpunk-parameters.png',
            fullPage: true 
        });

        console.log();
    }

    async checkPerformance() {
        console.log('📊 Step 6: Checking system performance...');

        const metrics = await this.page.evaluate(() => {
            return window.agentAPI.getPerformanceMetrics();
        });

        console.log('   Performance Metrics:');
        console.log(`   → API Calls: ${metrics.agentAPI.apiCalls} (${metrics.agentAPI.successfulCalls} successful)`);
        console.log(`   → Navigation: ${metrics.agentAPI.navigationCalls} state changes`);
        console.log(`   → Parameters: ${metrics.agentAPI.parameterUpdates} updates`);
        console.log(`   → Config Updates: ${metrics.agentAPI.configUpdates}`);
        
        if (metrics.visualizerPool) {
            console.log(`   → WebGL FPS: ${metrics.visualizerPool.averageFPS?.toFixed(1) || 'N/A'}`);
            console.log(`   → Active Visualizers: ${metrics.visualizerPool.activeVisualizers}`);
        }

        console.log();
    }

    async exportConfiguration() {
        console.log('💾 Step 7: Exporting final configuration...');

        const config = await this.page.evaluate(() => {
            return window.agentAPI.exportConfiguration();
        });

        // Save the configuration
        const fs = require('fs');
        fs.writeFileSync('cyberpunk-config-export.json', JSON.stringify(config, null, 2));
        
        console.log('   ✅ Configuration exported to: cyberpunk-config-export.json');
        console.log(`   → Contains ${Object.keys(config).length} config sections`);
        console.log();
    }

    async runFullTest() {
        try {
            await this.initialize();
            
            const isReady = await this.checkSystemStatus();
            if (!isReady) {
                throw new Error('System not ready!');
            }

            await this.testNavigation();
            await this.createCyberPunkTheme();
            await this.testInteractions();
            await this.testParameterControl();
            await this.checkPerformance();
            await this.exportConfiguration();

            console.log('✅ FRESH AGENT TEST COMPLETE!');
            console.log('\n📸 Screenshots saved:');
            console.log('   - state-*.png (all 5 states)');
            console.log('   - cyberpunk-theme.png');
            console.log('   - cyberpunk-hover.png');
            console.log('   - cyberpunk-parameters.png');
            console.log('\n📄 Configuration exported:');
            console.log('   - cyberpunk-config-export.json');

        } catch (error) {
            console.error('❌ Test failed:', error);
        } finally {
            // Keep browser open for inspection
            console.log('\n🔍 Browser left open for inspection. Press Ctrl+C to exit.');
        }
    }
}

// Run the test
const test = new FreshAgentTest();
test.runFullTest();