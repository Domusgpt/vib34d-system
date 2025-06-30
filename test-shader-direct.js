const puppeteer = require('puppeteer');

async function testShadersDirect() {
    let browser = null;
    
    try {
        console.log('🔧 Testing shader compilation directly...');
        
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', msg => {
            console.log(`Page: ${msg.text()}`);
        });
        
        await page.goto('http://localhost:8080/debug-direct.html');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get the log output
        const logOutput = await page.$eval('#log', el => el.textContent);
        console.log('\n=== DIRECT SHADER TEST RESULTS ===');
        console.log(logOutput);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testShadersDirect();