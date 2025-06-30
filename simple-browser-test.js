/**
 * Simple browser test to debug WebGL shader compilation
 */

const puppeteer = require('puppeteer');

async function testWebGLShaders() {
    let browser = null;
    
    try {
        console.log('🚀 Starting browser test for WebGL shader debugging...');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            
            if (type === 'error') {
                console.log(`❌ Page Error: ${text}`);
            } else if (text.includes('WebGL') || text.includes('shader') || text.includes('geometry')) {
                console.log(`🎮 WebGL: ${text}`);
            }
        });
        
        // Navigate to the page
        console.log('📄 Loading VIB34D system...');
        await page.goto('http://localhost:8080');
        
        // Wait for system to initialize
        console.log('⏳ Waiting for system initialization...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if the system initialized
        const systemLoaded = await page.evaluate(() => {
            return typeof window.vib34dSystem !== 'undefined';
        });
        
        console.log(`🎯 System loaded: ${systemLoaded}`);
        
        if (systemLoaded) {
            // Check geometry registry
            const geometryInfo = await page.evaluate(() => {
                const system = window.vib34dSystem;
                const geometryRegistry = system.geometryRegistry;
                
                if (!geometryRegistry) {
                    return { error: 'GeometryRegistry not available' };
                }
                
                const hypercube = geometryRegistry.getGeometry('hypercube');
                
                return {
                    isInitialized: geometryRegistry.isInitialized,
                    geometryNames: geometryRegistry.getGeometryNames(),
                    hypercubeInfo: {
                        exists: !!hypercube,
                        isLoaded: hypercube?.isLoaded,
                        hasVertexShader: !!hypercube?.vertexShader,
                        hasFragmentShader: !!hypercube?.fragmentShader,
                        vertexShaderLength: hypercube?.vertexShader?.length,
                        fragmentShaderLength: hypercube?.fragmentShader?.length
                    }
                };
            });
            
            console.log('📐 Geometry Registry Info:', geometryInfo);
            
            // Check visualizer pool
            const visualizerInfo = await page.evaluate(() => {
                const system = window.vib34dSystem;
                const visualizerPool = system.visualizerPool;
                
                if (!visualizerPool) {
                    return { error: 'VisualizerPool not available' };
                }
                
                return {
                    isInitialized: visualizerPool.isInitialized,
                    activeVisualizers: visualizerPool.metrics.activeVisualizers,
                    webglSupported: visualizerPool.webglSupported,
                    webgl2Supported: visualizerPool.webgl2Supported,
                    webglErrors: visualizerPool.metrics.webglErrors,
                    visualizerIds: visualizerPool.getVisualizerIds()
                };
            });
            
            console.log('🎮 Visualizer Pool Info:', visualizerInfo);
            
            // Test navigation
            console.log('🧭 Testing navigation...');
            const navigationResult = await page.evaluate(() => {
                const api = window.agentAPI;
                if (!api) return { error: 'AgentAPI not available' };
                
                return api.navigateTo('tech');
            });
            
            console.log('Navigation result:', navigationResult);
        }
        
        // Keep browser open for manual inspection
        console.log('🔍 Browser left open for manual inspection. Press Ctrl+C to close.');
        await new Promise(() => {}); // Keep running indefinitely
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testWebGLShaders();