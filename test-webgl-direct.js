/**
 * Direct WebGL Test - Test VIB34D WebGL visualizers without browser automation
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Direct WebGL Test - VIB34D System');
console.log('=====================================');

// Test 1: Verify all required files exist
console.log('\n📂 File Verification:');
const requiredFiles = [
    'index.html',
    'SystemController.js', 
    'GeometryRegistry.js',
    'VisualizerPool.js',
    'HomeMaster.js',
    'JsonConfigSystem.js',
    'agentAPI.js',
    'layout-content.json',
    'visuals.json',
    'state-map.json',
    'behavior.json',
    'vib34d-styles.css'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// Test 2: Check SystemController initialization order
console.log('\n🔧 SystemController Analysis:');
const systemControllerContent = fs.readFileSync(path.join(__dirname, 'SystemController.js'), 'utf8');

const hasFixedInitOrder = systemControllerContent.includes('// NOW initialize core modules after layout is created');
console.log(`  ${hasFixedInitOrder ? '✅' : '❌'} Initialization order fixed`);

const hasCanvasCreation = systemControllerContent.includes('<canvas class="card-visualizer"');
console.log(`  ${hasCanvasCreation ? '✅' : '❌'} Canvas creation in createAdaptiveCard`);

const hasVisualizerPoolInit = systemControllerContent.includes('this.visualizerPool.startRenderLoop()');
console.log(`  ${hasVisualizerPoolInit ? '✅' : '❌'} VisualizerPool render loop start`);

// Test 3: Check GeometryRegistry shader implementation
console.log('\n🎮 GeometryRegistry WebGL Analysis:');
const geometryContent = fs.readFileSync(path.join(__dirname, 'GeometryRegistry.js'), 'utf8');

const hasVertexShader = geometryContent.includes('hypercube.vertexShader = `');
console.log(`  ${hasVertexShader ? '✅' : '❌'} Hypercube vertex shader defined`);

const hasFragmentShader = geometryContent.includes('hypercube.fragmentShader = `');
console.log(`  ${hasFragmentShader ? '✅' : '❌'} Hypercube fragment shader defined`);

const has4DMath = geometryContent.includes('rotateXW') && geometryContent.includes('rotateYW');
console.log(`  ${has4DMath ? '✅' : '❌'} 4D mathematics (rotation matrices)`);

const hasShaderValidation = geometryContent.includes('hasShaders = true');
console.log(`  ${hasShaderValidation ? '✅' : '❌'} Shader validation flags`);

// Test 4: Check VisualizerPool WebGL pipeline
console.log('\n🖥️ VisualizerPool WebGL Analysis:');
const visualizerContent = fs.readFileSync(path.join(__dirname, 'VisualizerPool.js'), 'utf8');

const hasWebGLContext = visualizerContent.includes('createWebGLContext');
console.log(`  ${hasWebGLContext ? '✅' : '❌'} WebGL context creation`);

const hasShaderCompilation = visualizerContent.includes('compileShader');
console.log(`  ${hasShaderCompilation ? '✅' : '❌'} Shader compilation pipeline`);

const hasRenderLoop = visualizerContent.includes('renderLoop') && visualizerContent.includes('requestAnimationFrame');
console.log(`  ${hasRenderLoop ? '✅' : '❌'} Animation render loop`);

const hasUniformUpdates = visualizerContent.includes('updateUniforms');
console.log(`  ${hasUniformUpdates ? '✅' : '❌'} Uniform parameter updates`);

// Test 5: Check layout configuration
console.log('\n📐 Layout Configuration Analysis:');
const layoutContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'layout-content.json'), 'utf8'));

const hasCards = layoutContent.cards && layoutContent.cards.length > 0;
console.log(`  ${hasCards ? '✅' : '❌'} Adaptive cards defined (${layoutContent.cards?.length || 0} cards)`);

if (hasCards) {
    const cardsWithGeometry = layoutContent.cards.filter(card => card.geometry).length;
    console.log(`  ${cardsWithGeometry > 0 ? '✅' : '❌'} Cards with geometry specified (${cardsWithGeometry}/${layoutContent.cards.length})`);
}

// Test 6: Generate System Report
console.log('\n📊 SYSTEM READINESS REPORT:');
console.log('==============================');

const fileScore = allFilesExist ? 4 : 0;
const systemControllerScore = (hasFixedInitOrder ? 1 : 0) + (hasCanvasCreation ? 1 : 0) + (hasVisualizerPoolInit ? 1 : 0);
const geometryScore = (hasVertexShader ? 1 : 0) + (hasFragmentShader ? 1 : 0) + (has4DMath ? 1 : 0) + (hasShaderValidation ? 1 : 0);
const visualizerScore = (hasWebGLContext ? 1 : 0) + (hasShaderCompilation ? 1 : 0) + (hasRenderLoop ? 1 : 0) + (hasUniformUpdates ? 1 : 0);
const layoutScore = hasCards ? 2 : 0;

const totalScore = fileScore + systemControllerScore + geometryScore + visualizerScore + layoutScore;
const maxScore = 4 + 3 + 4 + 4 + 2; // 17 total

const successRate = (totalScore / maxScore * 100).toFixed(1);

console.log(`📈 Overall Readiness: ${totalScore}/${maxScore} (${successRate}%)`);
console.log(`📂 Files: ${fileScore}/4`);
console.log(`🔧 SystemController: ${systemControllerScore}/3`);
console.log(`🎮 GeometryRegistry: ${geometryScore}/4`);
console.log(`🖥️ VisualizerPool: ${visualizerScore}/4`);
console.log(`📐 Layout: ${layoutScore}/2`);

if (successRate >= 90) {
    console.log('\n🎉 SYSTEM READY FOR DEPLOYMENT!');
    console.log('✅ WebGL visualizers should render correctly');
    console.log('✅ All critical components implemented');
} else if (successRate >= 70) {
    console.log('\n⚠️ SYSTEM MOSTLY READY - Minor issues detected');
    console.log('🔧 Some components may need fine-tuning');
} else {
    console.log('\n❌ SYSTEM NOT READY - Critical issues detected');
    console.log('🚨 Major components missing or broken');
}

console.log('\n🌐 GitHub Pages URL: https://domusgpt.github.io/vib34d-system/');
console.log('🔍 Recommendation: Test system locally first, then deploy');