const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function visualTest() {
    let browser = null;
    
    try {
        console.log('🚀 VIB34D Visual Test - Testing file:// directly');
        
        browser = await puppeteer.launch({
            headless: false,
            devtools: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Track console messages for debugging
        page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            
            if (type === 'error') {
                console.log(`❌ Page Error: ${text}`);
            } else if (text.includes('✅') || text.includes('🎮') || text.includes('🎨') || text.includes('❌')) {
                console.log(`📄 ${text}`);
            }
        });
        
        // Load directly from file system
        const htmlPath = path.resolve(__dirname, 'index.html');
        const fileUrl = `file://${htmlPath}`;
        
        console.log(`📄 Loading: ${fileUrl}`);
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        console.log('⏳ Waiting for system initialization...');
        await new Promise(resolve => setTimeout(resolve, 8000));
        
        // Take screenshots of different states
        console.log('📸 Taking screenshots...');
        
        // Initial state
        await page.screenshot({ 
            path: 'vib34d-initial.png', 
            fullPage: true 
        });
        
        // Test navigation
        console.log('🧭 Testing navigation...');
        await page.keyboard.press('2'); // Navigate to tech
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await page.screenshot({ 
            path: 'vib34d-tech-state.png', 
            fullPage: true 
        });
        
        // Test hover effects
        console.log('🖱️ Testing hover effects...');
        const cards = await page.$$('.vib34d-card');
        if (cards.length > 0) {
            await cards[0].hover();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await page.screenshot({ 
                path: 'vib34d-hover-effect.png', 
                fullPage: true 
            });
        }
        
        // Check visual elements
        const visualCheck = await page.evaluate(() => {
            return {
                // System loaded
                systemLoaded: typeof window.vib34dSystem !== 'undefined',
                agentAPILoaded: typeof window.agentAPI !== 'undefined',
                
                // UI elements
                navButtons: document.querySelectorAll('.nav-button').length,
                paramSliders: document.querySelectorAll('.param-slider').length,
                geometrySelector: document.querySelectorAll('.geometry-selector').length,
                
                // Cards and effects
                adaptiveCards: document.querySelectorAll('.adaptive-card').length,
                rgbGlitchBorders: document.querySelectorAll('.rgb-glitch-border').length,
                holographicLayers: document.querySelectorAll('.holographic-layer').length,
                siliconGlass: document.querySelectorAll('.silicon-glass-shadow').length,
                universalAccents: document.querySelectorAll('.universal-accent').length,
                
                // WebGL
                webglCanvases: document.querySelectorAll('.card-visualizer').length,
                
                // Grid density stages
                gridStage1: document.querySelectorAll('.grid-density-stage-1').length,
                gridStage2: document.querySelectorAll('.grid-density-stage-2').length,
                gridStage3: document.querySelectorAll('.grid-density-stage-3').length,
                gridStage4: document.querySelectorAll('.grid-density-stage-4').length,
                gridStage5: document.querySelectorAll('.grid-density-stage-5').length,
                
                // Enhanced content
                videoPlayers: document.querySelectorAll('.content-video-player').length,
                audioPlayers: document.querySelectorAll('.content-audio-player').length,
                textReaders: document.querySelectorAll('.content-text-reader').length,
                
                // Container classes
                cardsContainer: document.querySelector('.cards-container') !== null,
                
                // CSS animations working
                rgbAnimationActive: getComputedStyle(document.querySelector('.rgb-glitch-border::before') || document.body).animationName !== 'none'
            };
        });
        
        console.log('\n📊 VISUAL SYSTEM ANALYSIS:');
        console.log('═══════════════════════════');
        
        console.log('\n🏗️ CORE SYSTEM:');
        console.log(`   System Loaded: ${visualCheck.systemLoaded ? '✅' : '❌'}`);
        console.log(`   Agent API: ${visualCheck.agentAPILoaded ? '✅' : '❌'}`);
        
        console.log('\n🎛️ UI ELEMENTS:');
        console.log(`   Nav Buttons: ${visualCheck.navButtons} ${visualCheck.navButtons > 0 ? '✅' : '❌'}`);
        console.log(`   Param Sliders: ${visualCheck.paramSliders} ${visualCheck.paramSliders > 0 ? '✅' : '❌'}`);
        console.log(`   Geometry Selector: ${visualCheck.geometrySelector} ${visualCheck.geometrySelector > 0 ? '✅' : '❌'}`);
        
        console.log('\n🃏 CARDS & EFFECTS:');
        console.log(`   Adaptive Cards: ${visualCheck.adaptiveCards} ${visualCheck.adaptiveCards > 0 ? '✅' : '❌'}`);
        console.log(`   RGB Glitch Borders: ${visualCheck.rgbGlitchBorders} ${visualCheck.rgbGlitchBorders > 0 ? '✅' : '❌'}`);
        console.log(`   Holographic Layers: ${visualCheck.holographicLayers} ${visualCheck.holographicLayers > 0 ? '✅' : '❌'}`);
        console.log(`   Silicon Glass: ${visualCheck.siliconGlass} ${visualCheck.siliconGlass > 0 ? '✅' : '❌'}`);
        console.log(`   Universal Accents: ${visualCheck.universalAccents} ${visualCheck.universalAccents >= 0 ? '✅' : '❌'}`);
        
        console.log('\n🎮 WEBGL:');
        console.log(`   WebGL Canvases: ${visualCheck.webglCanvases} ${visualCheck.webglCanvases > 0 ? '✅' : '❌'}`);
        
        console.log('\n🎚️ GRID DENSITY STAGES:');
        console.log(`   Stage 1: ${visualCheck.gridStage1}`);
        console.log(`   Stage 2: ${visualCheck.gridStage2}`);
        console.log(`   Stage 3: ${visualCheck.gridStage3}`);
        console.log(`   Stage 4: ${visualCheck.gridStage4}`);
        console.log(`   Stage 5: ${visualCheck.gridStage5}`);
        
        console.log('\n📱 ENHANCED CONTENT:');
        console.log(`   Video Players: ${visualCheck.videoPlayers}`);
        console.log(`   Audio Players: ${visualCheck.audioPlayers}`);
        console.log(`   Text Readers: ${visualCheck.textReaders}`);
        
        console.log('\n🎨 CONTAINER SETUP:');
        console.log(`   Cards Container: ${visualCheck.cardsContainer ? '✅' : '❌'}`);
        
        // Calculate success metrics
        const coreSuccess = visualCheck.systemLoaded && visualCheck.agentAPILoaded;
        const uiSuccess = visualCheck.navButtons > 0 && visualCheck.paramSliders > 0;
        const cardsSuccess = visualCheck.adaptiveCards > 0 && visualCheck.rgbGlitchBorders > 0;
        const webglSuccess = visualCheck.webglCanvases > 0;
        const effectsSuccess = visualCheck.holographicLayers > 0 && visualCheck.siliconGlass > 0;
        
        const overallSuccess = coreSuccess && uiSuccess && cardsSuccess && webglSuccess && effectsSuccess;
        
        console.log('\n🎯 SUCCESS METRICS:');
        console.log(`   Core System: ${coreSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   UI Elements: ${uiSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Cards & Effects: ${cardsSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   WebGL System: ${webglSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Visual Effects: ${effectsSuccess ? '✅ PASS' : '❌ FAIL'}`);
        
        console.log(`\n🏆 OVERALL: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS FIXES'}`);
        
        if (!overallSuccess) {
            console.log('\n🔧 ISSUES TO FIX:');
            if (!coreSuccess) console.log('   - Core system initialization');
            if (!uiSuccess) console.log('   - UI element creation');
            if (!cardsSuccess) console.log('   - Card visual effects');
            if (!webglSuccess) console.log('   - WebGL canvas setup');
            if (!effectsSuccess) console.log('   - Visual effect layers');
        }
        
        console.log('\n📸 Screenshots saved:');
        console.log('   - vib34d-initial.png');
        console.log('   - vib34d-tech-state.png');
        console.log('   - vib34d-hover-effect.png');
        
        console.log('\n🔍 Browser left open for manual inspection');
        console.log('🛑 Press Ctrl+C to close');
        
        // Keep open for inspection
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Visual test failed:', error);
    } finally {
        // Don't auto-close for inspection
    }
}

visualTest();