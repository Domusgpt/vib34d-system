/**
 * Elegant Interaction System - Sophisticated User Experience Enhancement
 * 
 * Creates tasteful, organic user interactions with:
 * - Graceful mouse tracking
 * - Smooth parameter transitions
 * - Elegant visual feedback
 * - Organic movement responses
 */

class ElegantInteraction {
    constructor() {
        this.isInitialized = false;
        this.mousePosition = { x: 0.5, y: 0.5 };
        this.smoothMousePosition = { x: 0.5, y: 0.5 };
        this.mouseVelocity = { x: 0, y: 0 };
        this.lastMouseTime = 0;
        
        // Elegant interaction parameters
        this.config = {
            mouseSmoothness: 0.08,
            velocityDecay: 0.95,
            interactionRadius: 0.3,
            elegantInfluence: 0.15,
            organicResponse: 0.25,
            flowIntensity: 0.4
        };
        
        // Interaction state
        this.activeElements = new Set();
        this.interactionStates = new Map();
        this.elegantTimers = new Map();
        
        console.log('✨ Elegant Interaction System initialized');
    }
    
    /**
     * Initialize elegant interaction system
     */
    initialize() {
        if (this.isInitialized) return;
        
        this.setupMouseTracking();
        this.setupElementInteractions();
        this.setupKeyboardElegance();
        this.startElegantLoop();
        
        this.isInitialized = true;
        console.log('🎭 Elegant Interaction System ready');
    }
    
    /**
     * Setup sophisticated mouse tracking
     */
    setupMouseTracking() {
        let lastX = 0, lastY = 0;
        
        document.addEventListener('mousemove', (event) => {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastMouseTime;
            
            // Normalize mouse position
            this.mousePosition.x = event.clientX / window.innerWidth;
            this.mousePosition.y = event.clientY / window.innerHeight;
            
            // Calculate velocity for organic responses
            if (deltaTime > 0) {
                this.mouseVelocity.x = (event.clientX - lastX) / deltaTime;
                this.mouseVelocity.y = (event.clientY - lastY) / deltaTime;
            }
            
            lastX = event.clientX;
            lastY = event.clientY;
            this.lastMouseTime = currentTime;
            
            // Update global CSS variables for holographic effects
            document.documentElement.style.setProperty('--global-mouse-x', this.mousePosition.x);
            document.documentElement.style.setProperty('--global-mouse-y', this.mousePosition.y);
        });
        
        // Handle mouse leave for graceful fallback
        document.addEventListener('mouseleave', () => {
            this.mouseVelocity.x *= 0.8;
            this.mouseVelocity.y *= 0.8;
        });
    }
    
    /**
     * Setup elegant element interactions
     */
    setupElementInteractions() {
        // Enhanced card interactions
        this.setupCardInteractions();
        
        // Elegant parameter control
        this.setupParameterElegance();
        
        // Navigation sophistication
        this.setupNavigationElegance();
        
        // WebGL canvas refinement
        this.setupCanvasInteractions();
    }
    
    /**
     * Setup sophisticated card interactions
     */
    setupCardInteractions() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('vib34d-card')) {
                        this.enhanceCardElement(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Enhance existing cards
        document.querySelectorAll('.vib34d-card').forEach(card => {
            this.enhanceCardElement(card);
        });
    }
    
    /**
     * Enhance individual card with elegant interactions
     */
    enhanceCardElement(card) {
        if (this.activeElements.has(card)) return;
        
        this.activeElements.add(card);
        
        // Create interaction state
        const state = {
            element: card,
            basePosition: { x: 0, y: 0 },
            targetPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            isHovered: false,
            eleganceLevel: 0,
            flowIntensity: 0,
            lastUpdate: performance.now()
        };
        
        this.interactionStates.set(card, state);
        
        // Mouse enter - elegant activation
        card.addEventListener('mouseenter', () => {
            state.isHovered = true;
            this.triggerElegantResponse(card, 'enter');
            
            // Add elegant glow effect
            card.style.filter = 'brightness(1.1) saturate(1.2)';
            card.style.transition = 'filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        // Mouse leave - graceful recession
        card.addEventListener('mouseleave', () => {
            state.isHovered = false;
            this.triggerElegantResponse(card, 'leave');
            
            // Remove glow effect
            card.style.filter = '';
        });
        
        // Mouse move - organic tracking
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            
            // Update local mouse position for this card
            card.style.setProperty('--local-mouse-x', `${x * 100}%`);
            card.style.setProperty('--local-mouse-y', `${y * 100}%`);
            
            // Subtle 3D tilt effect
            const tiltX = (y - 0.5) * 10;
            const tiltY = (x - 0.5) * -10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg) 
                translateY(-12px) 
                scale(1.05)
            `;
        });
        
        // Click - elegant response
        card.addEventListener('click', () => {
            this.triggerElegantClick(card);
        });
    }
    
    /**
     * Trigger elegant response animations
     */
    triggerElegantResponse(element, type) {
        const state = this.interactionStates.get(element);
        if (!state) return;
        
        switch (type) {
            case 'enter':
                state.eleganceLevel = 1;
                state.flowIntensity = 0.8;
                
                // Gentle scale and glow
                element.style.transform = 'scale(1.05) translateY(-8px)';
                element.style.boxShadow = `
                    0 20px 60px rgba(0, 0, 0, 0.25),
                    0 0 40px rgba(255, 255, 255, 0.1),
                    0 0 80px rgba(144, 202, 249, 0.15)
                `;
                break;
                
            case 'leave':
                state.eleganceLevel = 0;
                state.flowIntensity = 0;
                
                // Smooth return
                element.style.transform = '';
                element.style.boxShadow = '';
                break;
        }
    }
    
    /**
     * Elegant click response with ripple effect
     */
    triggerElegantClick(element) {
        // Create elegant ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'elegant-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            transform: scale(0);
            animation: elegantRipple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            pointer-events: none;
            top: 50%;
            left: 50%;
            transform-origin: center;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
        
        // Trigger visual feedback
        element.style.filter = 'brightness(1.3) saturate(1.5)';
        setTimeout(() => {
            element.style.filter = '';
        }, 200);
    }
    
    /**
     * Setup elegant parameter controls
     */
    setupParameterElegance() {
        document.addEventListener('input', (event) => {
            if (event.target.classList.contains('param-slider')) {
                this.handleElegantParameterChange(event.target);
            }
        });
    }
    
    /**
     * Handle elegant parameter changes
     */
    handleElegantParameterChange(slider) {
        const value = parseFloat(slider.value);
        const param = slider.getAttribute('data-param');
        
        // Create visual feedback
        slider.style.background = `
            linear-gradient(to right, 
                rgba(144, 202, 249, 0.8) 0%, 
                rgba(144, 202, 249, 0.8) ${((value - slider.min) / (slider.max - slider.min)) * 100}%, 
                rgba(255, 255, 255, 0.12) ${((value - slider.min) / (slider.max - slider.min)) * 100}%, 
                rgba(255, 255, 255, 0.12) 100%)
        `;
        
        // Elegant thumb glow effect
        slider.style.filter = 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.5))';
        
        // Remove glow after interaction
        setTimeout(() => {
            slider.style.filter = '';
        }, 300);
        
        // Update parameter with elegant timing
        if (window.vib34dSystem?.homeMaster) {
            window.vib34dSystem.homeMaster.updateGlobalParameter(param, value);
        }
    }
    
    /**
     * Setup elegant navigation interactions
     */
    setupNavigationElegance() {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('nav-button')) {
                this.handleElegantNavigation(event.target);
            }
        });
    }
    
    /**
     * Handle elegant navigation with smooth transitions
     */
    handleElegantNavigation(button) {
        // Visual feedback
        button.style.transform = 'translateY(-4px) scale(0.98)';
        button.style.boxShadow = '0 8px 24px rgba(144, 202, 249, 0.3)';
        
        // Reset after animation
        setTimeout(() => {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 200);
        
        // Parse navigation action
        const action = button.getAttribute('data-action');
        if (action && action.includes('navigateTo')) {
            const state = action.match(/navigateTo\\('(.+)'\\)/)?.[1];
            if (state && window.vib34dSystem?.homeMaster) {
                // Trigger elegant state transition
                this.triggerElegantStateTransition(state);
            }
        }
    }
    
    /**
     * Trigger elegant state transition with visual effects
     */
    triggerElegantStateTransition(targetState) {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'elegant-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at var(--global-mouse-x, 50%) var(--global-mouse-y, 50%), 
                rgba(144, 202, 249, 0.1) 0%, 
                transparent 60%);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(overlay);
        
        // Animate overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Trigger navigation
        setTimeout(() => {
            window.vib34dSystem.homeMaster.navigateTo(targetState);
        }, 100);
        
        // Remove overlay
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 600);
        }, 300);
    }
    
    /**
     * Setup canvas interactions for WebGL elegance
     */
    setupCanvasInteractions() {
        document.addEventListener('mousemove', (event) => {
            document.querySelectorAll('.card-visualizer').forEach(canvas => {
                const rect = canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                
                // Pass mouse coordinates to WebGL shaders
                if (canvas.mouseX !== undefined) {
                    canvas.mouseX = x;
                    canvas.mouseY = 1.0 - y; // Flip Y for WebGL
                }
            });
        });
    }
    
    /**
     * Setup elegant keyboard interactions
     */
    setupKeyboardElegance() {
        document.addEventListener('keydown', (event) => {
            if (event.key >= '1' && event.key <= '5') {
                this.triggerElegantKeyboardNavigation(event.key);
            }
        });
    }
    
    /**
     * Handle elegant keyboard navigation
     */
    triggerElegantKeyboardNavigation(key) {
        // Create elegant keyboard feedback
        const feedback = document.createElement('div');
        feedback.className = 'elegant-keyboard-feedback';
        feedback.textContent = key;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(144, 202, 249, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-family: var(--font-elegant);
            font-size: 1.5rem;
            font-weight: 300;
            backdrop-filter: blur(16px);
            z-index: 10000;
            animation: elegantKeyboardPulse 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove feedback after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 600);
    }
    
    /**
     * Start elegant animation loop
     */
    startElegantLoop() {
        const elegantLoop = () => {
            this.updateSmoothMouse();
            this.updateInteractionStates();
            this.updateVelocityDecay();
            
            requestAnimationFrame(elegantLoop);
        };
        
        elegantLoop();
    }
    
    /**
     * Update smooth mouse interpolation
     */
    updateSmoothMouse() {
        this.smoothMousePosition.x += (this.mousePosition.x - this.smoothMousePosition.x) * this.config.mouseSmoothness;
        this.smoothMousePosition.y += (this.mousePosition.y - this.smoothMousePosition.y) * this.config.mouseSmoothness;
        
        // Update global smooth mouse variables
        document.documentElement.style.setProperty('--smooth-mouse-x', this.smoothMousePosition.x);
        document.documentElement.style.setProperty('--smooth-mouse-y', this.smoothMousePosition.y);
    }
    
    /**
     * Update interaction states for all elements
     */
    updateInteractionStates() {
        const currentTime = performance.now();
        
        this.interactionStates.forEach((state, element) => {
            const deltaTime = currentTime - state.lastUpdate;
            
            // Update elegance level
            if (state.isHovered) {
                state.eleganceLevel = Math.min(1, state.eleganceLevel + deltaTime * 0.003);
            } else {
                state.eleganceLevel = Math.max(0, state.eleganceLevel - deltaTime * 0.002);
            }
            
            // Update flow intensity
            state.flowIntensity += (state.isHovered ? 0.8 : 0.2 - state.flowIntensity) * 0.05;
            
            // Apply elegant effects
            if (state.eleganceLevel > 0) {
                element.style.setProperty('--elegance-level', state.eleganceLevel);
                element.style.setProperty('--flow-intensity', state.flowIntensity);
            }
            
            state.lastUpdate = currentTime;
        });
    }
    
    /**
     * Update velocity decay for organic movement
     */
    updateVelocityDecay() {
        this.mouseVelocity.x *= this.config.velocityDecay;
        this.mouseVelocity.y *= this.config.velocityDecay;
        
        // Update global velocity variables
        document.documentElement.style.setProperty('--mouse-velocity-x', this.mouseVelocity.x);
        document.documentElement.style.setProperty('--mouse-velocity-y', this.mouseVelocity.y);
    }
    
    /**
     * Get current interaction metrics
     */
    getInteractionMetrics() {
        return {
            activeElements: this.activeElements.size,
            mousePosition: { ...this.mousePosition },
            smoothMousePosition: { ...this.smoothMousePosition },
            mouseVelocity: { ...this.mouseVelocity },
            interactionStates: this.interactionStates.size
        };
    }
}

// Create elegant ripple animation CSS
const elegantAnimationCSS = `
    @keyframes elegantRipple {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
        }
        50% {
            opacity: 0.4;
        }
        100% {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
    
    @keyframes elegantKeyboardPulse {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
`;

// Inject elegant animation styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = elegantAnimationCSS;
    document.head.appendChild(styleElement);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for system to be ready
        const initElegantInteraction = () => {
            if (window.vib34dSystem && window.vib34dSystem.isInitialized) {
                const elegantInteraction = new ElegantInteraction();
                elegantInteraction.initialize();
                
                // Expose globally for debugging
                window.elegantInteraction = elegantInteraction;
                
                console.log('✨ Elegant Interaction System activated');
            } else {
                setTimeout(initElegantInteraction, 100);
            }
        };
        
        initElegantInteraction();
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantInteraction;
}

console.log('🎭 Elegant Interaction System loaded - Ready for sophistication');
 * Elegant Interaction System - Sophisticated Mouse and Touch Interactions
 * 
 * Creates refined, tasteful interactions:
 * - Gentle mouse tracking
 * - Elegant parallax effects  
 * - Sophisticated hover states
 * - Graceful touch responses
 * - Organic movement patterns
 */

class ElegantInteraction {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.easingFactor = 0.02; // Gentle easing
        
        this.cards = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupMouseTracking();
        this.setupCardInteractions();
        this.setupElegantCursor();
        this.startAnimationLoop();
        
        // Observe for new cards
        this.observeNewCards();
        
        this.isInitialized = true;
        console.log('✨ Elegant Interaction System initialized');
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
        
        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            this.targetMouseX = 0;
            this.targetMouseY = 0;
        });
    }
    
    setupCardInteractions() {
        // Setup interactions for existing cards
        const cards = document.querySelectorAll('.vib34d-card');
        cards.forEach(card => this.enhanceCard(card));
    }
    
    enhanceCard(card) {
        if (card._elegantInteractionEnhanced) return;
        card._elegantInteractionEnhanced = true;
        
        const canvas = card.querySelector('.card-visualizer');
        const content = card.querySelector('.card-content');
        
        // Elegant hover effects
        card.addEventListener('mouseenter', (e) => {
            this.onCardEnter(card, e);
        });
        
        card.addEventListener('mouseleave', (e) => {
            this.onCardLeave(card, e);
        });
        
        card.addEventListener('mousemove', (e) => {
            this.onCardMove(card, e);
        });
        
        // Touch interactions
        card.addEventListener('touchstart', (e) => {
            this.onCardTouchStart(card, e);
        });
        
        card.addEventListener('touchend', (e) => {
            this.onCardTouchEnd(card, e);
        });
        
        // Store card reference
        this.cards.push({
            element: card,
            canvas: canvas,
            content: content,
            originalTransform: '',
            isHovered: false
        });
    }
    
    onCardEnter(card, event) {
        const cardData = this.cards.find(c => c.element === card);
        if (!cardData) return;
        
        cardData.isHovered = true;
        
        // Elegant scale and shadow
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.transform = 'translateY(-12px) scale(1.03)';
        card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
        card.style.zIndex = '10';
        
        // Enhance content
        if (cardData.content) {
            cardData.content.style.transition = 'all 0.4s ease-out';
            cardData.content.style.transform = 'translateY(-4px)';
        }
        
        // Canvas glow effect
        if (cardData.canvas) {
            cardData.canvas.style.transition = 'all 0.5s ease-out';
            cardData.canvas.style.filter = 'brightness(1.1) contrast(1.05)';
            cardData.canvas.style.boxShadow = 'inset 0 0 0 2px rgba(255, 255, 255, 0.1)';
        }
    }
    
    onCardLeave(card, event) {
        const cardData = this.cards.find(c => c.element === card);
        if (!cardData) return;
        
        cardData.isHovered = false;
        
        // Graceful return
        card.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        card.style.zIndex = '';
        
        // Reset content
        if (cardData.content) {
            cardData.content.style.transition = 'all 0.6s ease-out';
            cardData.content.style.transform = 'translateY(0)';
        }
        
        // Reset canvas
        if (cardData.canvas) {
            cardData.canvas.style.transition = 'all 0.7s ease-out';
            cardData.canvas.style.filter = '';
            cardData.canvas.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        }
    }
    
    onCardMove(card, event) {
        const cardData = this.cards.find(c => c.element === card);
        if (!cardData || !cardData.isHovered) return;
        
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        
        // Subtle parallax effect
        const parallaxStrength = 0.3;
        const rotateX = y * parallaxStrength;
        const rotateY = -x * parallaxStrength;
        
        card.style.transform = `
            translateY(-12px) 
            scale(1.03) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
        
        // Canvas perspective effect
        if (cardData.canvas) {
            const canvasParallax = 0.1;
            cardData.canvas.style.transform = `
                translateX(${x * canvasParallax}px) 
                translateY(${y * canvasParallax}px)
            `;
        }
    }
    
    onCardTouchStart(card, event) {
        // Gentle touch feedback
        card.style.transition = 'all 0.2s ease-out';
        card.style.transform = 'scale(0.98)';
    }
    
    onCardTouchEnd(card, event) {
        // Elegant bounce back
        card.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        card.style.transform = 'scale(1)';
        
        // Brief highlight
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.1)';
            
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 600);
        }, 100);
    }
    
    setupElegantCursor() {
        // Create custom cursor dot
        const cursor = document.createElement('div');
        cursor.className = 'elegant-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s ease-out;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
        
        // Track cursor position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 3 + 'px';
            cursor.style.top = e.clientY - 3 + 'px';
        });
        
        // Cursor interactions
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(255, 255, 255, 1)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        // Hide on interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.opacity = '0.3';
                cursor.style.transform = 'scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.opacity = '1';
                cursor.style.transform = 'scale(1)';
            });
        });
    }
    
    observeNewCards() {
        // Watch for dynamically added cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('vib34d-card')) {
                            this.enhanceCard(node);
                        } else {
                            // Check children
                            const cards = node.querySelectorAll && node.querySelectorAll('.vib34d-card');
                            if (cards) {
                                cards.forEach(card => this.enhanceCard(card));
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            // Smooth mouse tracking
            this.mouseX += (this.targetMouseX - this.mouseX) * this.easingFactor;
            this.mouseY += (this.targetMouseY - this.mouseY) * this.easingFactor;
            
            // Apply global mouse influence
            this.applyGlobalMouseInfluence();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    applyGlobalMouseInfluence() {
        // Subtle global parallax effect
        const app = document.getElementById('vib34d-app');
        if (app) {
            const parallaxStrength = 0.5;
            const translateX = this.mouseX * parallaxStrength;
            const translateY = this.mouseY * parallaxStrength;
            
            app.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        
        // Update any WebGL uniform if available
        if (window.vib34dSystem && window.vib34dSystem.visualizerPool) {
            const pool = window.vib34dSystem.visualizerPool;
            if (pool.updateMousePosition) {
                pool.updateMousePosition(this.mouseX, this.mouseY);
            }
        }
    }
    
    // Public methods for external control
    setEasingFactor(factor) {
        this.easingFactor = Math.max(0.001, Math.min(0.1, factor));
    }
    
    getMousePosition() {
        return {
            x: this.mouseX,
            y: this.mouseY,
            targetX: this.targetMouseX,
            targetY: this.targetMouseY
        };
    }
}

// Initialize elegant interactions when available
if (typeof window !== 'undefined') {
    window.ElegantInteraction = ElegantInteraction;
    
    // Auto-initialize
    const elegantInteraction = new ElegantInteraction();
    window.elegantInteraction = elegantInteraction;
    
    console.log('✨ Elegant Interaction System loaded');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantInteraction;
}