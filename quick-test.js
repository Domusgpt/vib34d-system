const puppeteer = require('puppeteer');

async function quickTest() {
    let browser = null;
    
    try {
        console.log('🚀 Quick VIB34D visual test...');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        console.log('📄 Loading http://localhost:8080...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
        
        console.log('⏳ Waiting for system to load...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Take a screenshot
        await page.screenshot({ path: 'vib34d-current-state.png', fullPage: true });
        console.log('📸 Screenshot saved as vib34d-current-state.png');
        
        // Check for key elements
        const checks = await page.evaluate(() => {
            return {
                navButtons: document.querySelectorAll('.nav-button').length,
                paramSliders: document.querySelectorAll('.param-slider').length,
                geometrySelector: document.querySelectorAll('.geometry-selector').length,
                adaptiveCards: document.querySelectorAll('.adaptive-card').length,
                webglCanvases: document.querySelectorAll('.card-visualizer').length,
                systemLoaded: typeof window.vib34dSystem !== 'undefined',
                agentAPILoaded: typeof window.agentAPI !== 'undefined'
            };
        });
        
        console.log('\n📊 VISUAL SYSTEM CHECK:');
        console.log(`🔘 Navigation buttons: ${checks.navButtons}`);
        console.log(`🎛️ Parameter sliders: ${checks.paramSliders}`);
        console.log(`🎮 Geometry selector: ${checks.geometrySelector}`);
        console.log(`🃏 Adaptive cards: ${checks.adaptiveCards}`);
        console.log(`🌐 WebGL canvases: ${checks.webglCanvases}`);
        console.log(`🏗️ System loaded: ${checks.systemLoaded ? '✅' : '❌'}`);
        console.log(`🤖 Agent API loaded: ${checks.agentAPILoaded ? '✅' : '❌'}`);
        
        const success = checks.navButtons > 0 && checks.paramSliders > 0 && checks.adaptiveCards > 0;
        console.log(`\n🎯 VISUAL STATUS: ${success ? '✅ UI ELEMENTS VISIBLE' : '❌ UI ISSUES'}`);
        
        console.log('\n🔍 Browser open for inspection. Press Ctrl+C to close.');
        await new Promise(() => {}); // Keep open for inspection
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            // Don't auto-close for inspection
        }
    }
}

quickTest();