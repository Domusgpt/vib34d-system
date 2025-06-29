/**
 * VIB34D Implementation Validation
 * Direct code analysis without server dependency
 */

const fs = require('fs');
const path = require('path');

class VIB34DValidator {
    constructor() {
        this.results = {
            phase1: { status: 'unknown', tests: [] },
            phase2: { status: 'unknown', tests: [] },
            phase3: { status: 'unknown', tests: [] },
            phase4: { status: 'unknown', tests: [] },
            phase5: { status: 'unknown', tests: [] },
            critical: { status: 'unknown', tests: [] }
        };
    }

    readFile(filename) {
        try {
            return fs.readFileSync(filename, 'utf8');
        } catch (error) {
            return null;
        }
    }

    validatePhase1() {
        console.log('📋 Validating Phase 1: Core Foundation...');
        
        const tests = [
            {
                name: 'JsonConfigSystem.js exists',
                test: () => !!this.readFile('JsonConfigSystem.js'),
                critical: true
            },
            {
                name: 'SystemController.js exists', 
                test: () => !!this.readFile('SystemController.js'),
                critical: true
            },
            {
                name: 'JSON configs exist',
                test: () => {
                    return ['layout-content.json', 'visuals.json', 'behavior.json', 'state-map.json']
                        .every(file => !!this.readFile(file));
                },
                critical: true
            },
            {
                name: 'CSS styles exist',
                test: () => !!this.readFile('vib34d-styles.css'),
                critical: true
            },
            {
                name: 'HTML bootstrap exists',
                test: () => !!this.readFile('index.html'),
                critical: true
            },
            {
                name: 'SystemController has boot sequence',
                test: () => {
                    const content = this.readFile('SystemController.js');
                    return content && content.includes('initializeContainer') && 
                           content.includes('initializeConfigSystem') &&
                           content.includes('initializeStaticLayout');
                }
            }
        ];

        return this.runTests('phase1', tests);
    }

    validatePhase2() {
        console.log('🎮 Validating Phase 2: WebGL Rendering...');
        
        const tests = [
            {
                name: 'GeometryRegistry.js exists',
                test: () => !!this.readFile('GeometryRegistry.js'),
                critical: true
            },
            {
                name: 'VisualizerPool.js exists',
                test: () => !!this.readFile('VisualizerPool.js'), 
                critical: true
            },
            {
                name: 'GeometryRegistry has 4D shaders',
                test: () => {
                    const content = this.readFile('GeometryRegistry.js');
                    return content && content.includes('4D hypercube') && 
                           content.includes('rotateXW') && 
                           content.includes('u_dimension');
                }
            },
            {
                name: 'VisualizerPool has WebGL context management',
                test: () => {
                    const content = this.readFile('VisualizerPool.js');
                    return content && content.includes('getContext') && 
                           content.includes('webgl') && 
                           content.includes('startRenderLoop');
                }
            },
            {
                name: 'SystemController integrates WebGL modules',
                test: () => {
                    const content = this.readFile('SystemController.js');
                    return content && content.includes('GeometryRegistry') && 
                           content.includes('VisualizerPool') &&
                           content.includes('initializeCoreModules');
                }
            }
        ];

        return this.runTests('phase2', tests);
    }

    validatePhase3() {
        console.log('🏠 Validating Phase 3: State Management...');
        
        const tests = [
            {
                name: 'HomeMaster.js exists',
                test: () => !!this.readFile('HomeMaster.js'),
                critical: true
            },
            {
                name: 'InteractionCoordinator.js exists', 
                test: () => !!this.readFile('InteractionCoordinator.js'),
                critical: true
            },
            {
                name: 'state-map.json has navigation config',
                test: () => {
                    const content = this.readFile('state-map.json');
                    if (!content) return false;
                    const config = JSON.parse(content);
                    return config.navigation && config.navigation.keyboard && config.states;
                }
            },
            {
                name: 'HomeMaster has state management',
                test: () => {
                    const content = this.readFile('HomeMaster.js');
                    return content && content.includes('navigateTo') && 
                           content.includes('stateDefinitions') &&
                           content.includes('globalParameters');
                }
            },
            {
                name: 'InteractionCoordinator has keyboard handling',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('handleKeyDown') && 
                           content.includes('executeNavigationCommand') &&
                           content.includes('keyboardNavigation');
                }
            },
            {
                name: 'SystemController integrates Phase 3 modules',
                test: () => {
                    const content = this.readFile('SystemController.js');
                    return content && content.includes('HomeMaster') && 
                           content.includes('InteractionCoordinator') &&
                           content.includes('handleStateChange');
                }
            },
            {
                name: 'HTML loads Phase 3 modules',
                test: () => {
                    const content = this.readFile('index.html');
                    return content && content.includes('HomeMaster.js') && 
                           content.includes('InteractionCoordinator.js');
                }
            }
        ];

        return this.runTests('phase3', tests);
    }

    validatePhase4() {
        console.log('🌊 Validating Phase 4: Relational Interaction Physics...');
        
        const tests = [
            {
                name: 'InteractionCoordinator has blueprint parsing',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('loadInteractionBlueprints') && 
                           content.includes('interactionBlueprints') &&
                           content.includes('stateModifiers');
                },
                critical: true
            },
            {
                name: 'Relational targeting implemented',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('resolveRelationalTargets') && 
                           content.includes('subject') && 
                           content.includes('ecosystem') &&
                           content.includes('global');
                },
                critical: true
            },
            {
                name: 'Animation engine implemented',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('animationQueue') && 
                           content.includes('executeAnimation') &&
                           content.includes('applyEasingCurve');
                }
            },
            {
                name: 'DOM event integration complete',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('setupInteractionEventListeners') && 
                           content.includes('executeInteractionBlueprint') &&
                           content.includes('mapTriggerToEvent');
                },
                critical: true
            },
            {
                name: 'WebGL parameter synchronization',
                test: () => {
                    const visualizerContent = this.readFile('VisualizerPool.js');
                    const systemContent = this.readFile('SystemController.js');
                    return visualizerContent && systemContent &&
                           visualizerContent.includes('setupParameterSynchronization') &&
                           visualizerContent.includes('homeMaster.getGlobalParameters') &&
                           systemContent.includes('this.homeMaster');
                },
                critical: true
            },
            {
                name: 'Behavior blueprints configured',
                test: () => {
                    const behaviorContent = this.readFile('behavior.json');
                    if (!behaviorContent) return false;
                    const config = JSON.parse(behaviorContent);
                    return config.interactionBlueprints && 
                           config.interactionBlueprints.cardHoverResponse &&
                           config.stateModifiers;
                }
            },
            {
                name: 'Animation value interpolation',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('interpolateValue') && 
                           content.includes('parseTargetValue') &&
                           content.includes('*=') && content.includes('+=');
                }
            },
            {
                name: 'Element registry for relationships',
                test: () => {
                    const content = this.readFile('InteractionCoordinator.js');
                    return content && content.includes('elementRegistry') && 
                           content.includes('registerDOMElements') &&
                           content.includes('relationships');
                }
            }
        ];

        return this.runTests('phase4', tests);
    }

    validatePhase5() {
        console.log('🤖 Validating Phase 5: Agent API & Finalization...');
        
        const tests = [
            {
                name: 'agentAPI.js exists',
                test: () => !!this.readFile('agentAPI.js'),
                critical: true
            },
            {
                name: 'AgentAPI class implementation',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('class AgentAPI') && 
                           content.includes('navigateTo') &&
                           content.includes('setMasterParameter');
                },
                critical: true
            },
            {
                name: 'Config hot-reloading implemented',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('updateConfig') && 
                           content.includes('_performHotRestart') &&
                           content.includes('hot-reload');
                },
                critical: true
            },
            {
                name: 'System diagnostics and metrics',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('getDiagnostics') && 
                           content.includes('getPerformanceMetrics') &&
                           content.includes('metrics');
                }
            },
            {
                name: 'SystemController integrates AgentAPI',
                test: () => {
                    const content = this.readFile('SystemController.js');
                    return content && content.includes('AgentAPI') && 
                           content.includes('this.agentAPI') &&
                           content.includes('agentAPI.initialize');
                },
                critical: true
            },
            {
                name: 'HTML loads AgentAPI module',
                test: () => {
                    const content = this.readFile('index.html');
                    return content && content.includes('agentAPI.js');
                },
                critical: true
            },
            {
                name: 'Global window.agentAPI exposure',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('window.agentAPI') && 
                           content.includes('global');
                }
            },
            {
                name: 'System restart functionality',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('restartSystem') && 
                           content.includes('shutdown') &&
                           content.includes('reinitialize');
                }
            },
            {
                name: 'Error handling and API metrics',
                test: () => {
                    const content = this.readFile('agentAPI.js');
                    return content && content.includes('_apiCall') && 
                           content.includes('successfulCalls') &&
                           content.includes('failedCalls');
                }
            }
        ];

        return this.runTests('phase5', tests);
    }

    validateCriticalFeatures() {
        console.log('🎯 Validating Critical Features...');
        
        const tests = [
            {
                name: 'State navigation implemented',
                test: () => {
                    const stateMap = this.readFile('state-map.json');
                    const homeMaster = this.readFile('HomeMaster.js');
                    if (!stateMap || !homeMaster) return false;
                    
                    const config = JSON.parse(stateMap);
                    const states = ['home', 'tech', 'media', 'innovation', 'context'];
                    
                    return states.every(state => config.states[state]) &&
                           homeMaster.includes('performStateTransition');
                },
                critical: true
            },
            {
                name: 'Keyboard navigation configured', 
                test: () => {
                    const stateMap = this.readFile('state-map.json');
                    if (!stateMap) return false;
                    
                    const config = JSON.parse(stateMap);
                    const nav = config.navigation?.keyboard;
                    
                    return nav && nav['Digit1'] && nav['ArrowRight'] && nav['KeyH'];
                },
                critical: true
            },
            {
                name: '4D hypercube visualization ready',
                test: () => {
                    const geometry = this.readFile('GeometryRegistry.js');
                    return geometry && geometry.includes('mat4 rotateXW') && 
                           geometry.includes('u_dimension') &&
                           geometry.includes('4D hypercube');
                },
                critical: true
            },
            {
                name: 'WebGL render pipeline complete',
                test: () => {
                    const visualizer = this.readFile('VisualizerPool.js');
                    return visualizer && visualizer.includes('compileShader') && 
                           visualizer.includes('createBuffers') &&
                           visualizer.includes('render');
                }
            },
            {
                name: 'Event system integration',
                test: () => {
                    const controller = this.readFile('SystemController.js');
                    const homeMaster = this.readFile('HomeMaster.js');
                    return controller && homeMaster && 
                           controller.includes('addEventListener') &&
                           homeMaster.includes('eventBus');
                }
            }
        ];

        return this.runTests('critical', tests);
    }

    runTests(phase, tests) {
        let passed = 0;
        let critical_passed = 0;
        let critical_total = 0;

        tests.forEach((test, index) => {
            try {
                const result = test.test();
                const status = result ? '✅' : '❌';
                console.log(`  ${status} ${test.name}`);
                
                this.results[phase].tests.push({
                    name: test.name,
                    passed: result,
                    critical: test.critical || false
                });

                if (result) passed++;
                if (test.critical) {
                    critical_total++;
                    if (result) critical_passed++;
                }
            } catch (error) {
                console.log(`  ❌ ${test.name} (Error: ${error.message})`);
                this.results[phase].tests.push({
                    name: test.name,
                    passed: false,
                    error: error.message,
                    critical: test.critical || false
                });
                
                if (test.critical) critical_total++;
            }
        });

        const success_rate = (passed / tests.length * 100).toFixed(1);
        const critical_rate = critical_total > 0 ? (critical_passed / critical_total * 100).toFixed(1) : 100;
        
        console.log(`  📊 ${phase.toUpperCase()}: ${passed}/${tests.length} passed (${success_rate}%)`);
        if (critical_total > 0) {
            console.log(`  🎯 Critical: ${critical_passed}/${critical_total} passed (${critical_rate}%)`);
        }

        this.results[phase].status = critical_passed === critical_total ? 'pass' : 'fail';
        this.results[phase].success_rate = success_rate;
        this.results[phase].critical_rate = critical_rate;

        return { passed, total: tests.length, critical_passed, critical_total };
    }

    generateReport() {
        console.log('\n📊 VALIDATION REPORT');
        console.log('==================');

        const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'critical'];
        let total_passed = 0;
        let total_tests = 0;
        let all_critical_passed = true;

        phases.forEach(phase => {
            const result = this.results[phase];
            const status_icon = result.status === 'pass' ? '✅' : '❌';
            console.log(`${status_icon} ${phase.toUpperCase()}: ${result.success_rate}% (Critical: ${result.critical_rate}%)`);
            
            total_passed += result.tests.filter(t => t.passed).length;
            total_tests += result.tests.length;
            
            if (result.status !== 'pass') {
                all_critical_passed = false;
            }
        });

        const overall_rate = (total_passed / total_tests * 100).toFixed(1);
        console.log(`\n🎯 OVERALL: ${total_passed}/${total_tests} tests passed (${overall_rate}%)`);
        
        if (all_critical_passed) {
            console.log('✅ All critical features implemented - VIB34D system ready!');
        } else {
            console.log('❌ Some critical features missing - implementation incomplete');
        }

        // Show specific failures
        const failures = [];
        phases.forEach(phase => {
            this.results[phase].tests.forEach(test => {
                if (!test.passed && test.critical) {
                    failures.push(`${phase}: ${test.name}`);
                }
            });
        });

        if (failures.length > 0) {
            console.log('\n⚠️  CRITICAL FAILURES:');
            failures.forEach(failure => console.log(`  - ${failure}`));
        }

        return {
            overall_success: all_critical_passed,
            success_rate: overall_rate,
            phases: this.results,
            critical_failures: failures
        };
    }

    async validate() {
        console.log('🔍 VIB34D Implementation Validation Starting...\n');
        
        this.validatePhase1();
        console.log();
        this.validatePhase2(); 
        console.log();
        this.validatePhase3();
        console.log();
        this.validatePhase4();
        console.log();
        this.validatePhase5();
        console.log();
        this.validateCriticalFeatures();
        console.log();
        
        return this.generateReport();
    }
}

// Run validation
const validator = new VIB34DValidator();
validator.validate().then(report => {
    console.log('\n✅ Validation Complete!');
    process.exit(report.overall_success ? 0 : 1);
}).catch(error => {
    console.error('💥 Validation failed:', error);
    process.exit(1);
});