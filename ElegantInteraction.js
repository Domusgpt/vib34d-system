/**
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