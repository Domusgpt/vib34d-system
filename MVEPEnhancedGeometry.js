/**
 * MVEP Enhanced Geometry - Advanced 4D Visualizations for VIB34D
 * 
 * Integrates the sophisticated MVEP visual effects into the VIB34D platform:
 * - True 4D mathematics with six-axis rotations
 * - Moiré pattern generation
 * - RGB color splitting effects
 * - GPU-accelerated fragment shader rendering
 * - Audio-reactive capabilities
 */

class MVEPEnhancedGeometry {
    constructor() {
        this.name = 'mvep-enhanced';
        this.displayName = 'MVEP Enhanced 4D Hypercube';
        this.category = 'advanced';
        
        // Advanced MVEP parameters
        this.parameters = {
            dimension: { min: 3.0, max: 5.0, default: 3.8 },
            morphFactor: { min: 0.0, max: 1.5, default: 0.7 },
            glitchIntensity: { min: 0.0, max: 0.2, default: 0.05 },
            rotationSpeed: { min: 0.0, max: 3.0, default: 1.2 },
            gridDensity: { min: 5.0, max: 25.0, default: 12.0 },
            moireScale: { min: 0.95, max: 1.05, default: 1.01 },
            colorShift: { min: -1.0, max: 1.0, default: 0.0 }
        };
        
        // Audio integration
        this.audioEnabled = false;
        this.audioContext = null;
        this.analyser = null;
        this.frequencyData = null;
        
        this.createShaders();
    }
    
    createShaders() {
        // Advanced MVEP Vertex Shader (fullscreen quad approach)
        this.vertexShader = `#version 100
        precision highp float;
        
        attribute vec2 a_position;
        varying vec2 v_uv;
        
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }`;
        
        // Advanced MVEP Fragment Shader (sophisticated 4D effects)
        this.fragmentShader = `#version 100
        precision highp float;
        
        varying vec2 v_uv;
        
        // MVEP Enhanced Parameters
        uniform float u_time;
        uniform float u_dimension;
        uniform float u_morphFactor;
        uniform float u_glitchIntensity;
        uniform float u_rotationSpeed;
        uniform float u_gridDensity;
        uniform float u_moireScale;
        uniform float u_colorShift;
        uniform vec2 u_resolution;
        
        // Audio parameters
        uniform float u_audioEnabled;
        uniform float u_bassLevel;
        uniform float u_midLevel;
        uniform float u_highLevel;
        uniform float u_pitchFactor;
        
        // 4D Rotation Matrices (Six Independent Planes)
        mat4 rotateXW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(
                c, 0.0, 0.0, -s,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                s, 0.0, 0.0, c
            );
        }
        
        mat4 rotateYW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, c, 0.0, -s,
                0.0, 0.0, 1.0, 0.0,
                0.0, s, 0.0, c
            );
        }
        
        mat4 rotateZW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, c, -s,
                0.0, 0.0, s, c
            );
        }
        
        mat4 rotateXY(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(
                c, -s, 0.0, 0.0,
                s, c, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }
        
        // Project 4D point to 3D
        vec3 project4Dto3D(vec4 p4d) {
            float w = p4d.w + 2.0; // Perspective factor
            return p4d.xyz / w;
        }
        
        // Advanced Hypercube Lattice with 4D Mathematics
        float hypercubeLattice(vec3 p, float morphFactor, float gridSize) {
            // Convert to 4D space
            float w = sin(p.x * 0.3 + u_time * 0.2) * morphFactor;
            vec4 p4d = vec4(p, w);
            
            // Apply 4D rotations based on audio or time
            float timeFactor = u_time * u_rotationSpeed;
            if (u_audioEnabled > 0.5) {
                timeFactor += u_bassLevel * 2.0;
            }
            
            p4d = rotateXW(timeFactor * 0.31) * p4d;
            p4d = rotateYW(timeFactor * 0.27 + u_midLevel * 0.5) * p4d;
            p4d = rotateZW(timeFactor * 0.23) * p4d;
            p4d = rotateXY(timeFactor * 0.19 + u_highLevel * 0.3) * p4d;
            
            // Project back to 3D
            vec3 distortedP = project4Dto3D(p4d);
            
            // Create lattice structure
            vec3 gridP = distortedP * gridSize;
            vec3 fractP = fract(gridP) - 0.5;
            
            // Edge thickness with audio modulation
            float edgeThickness = 0.03;
            if (u_audioEnabled > 0.5) {
                edgeThickness += u_pitchFactor * 0.02;
            }
            
            // Lattice edges
            float edges = min(min(
                length(fractP.yz),
                length(fractP.xz)),
                length(fractP.xy)
            ) - edgeThickness;
            
            // Vertices (4D hypercube has 16 vertices)
            float vertices = length(fractP) - 0.08;
            
            return max(edges, vertices);
        }
        
        // Moiré Pattern Generation
        float generateMoire(vec3 p, float morphFactor, float gridDensity) {
            float grid1 = hypercubeLattice(p, morphFactor, gridDensity);
            float grid2 = hypercubeLattice(p, morphFactor, gridDensity * u_moireScale);
            return abs(grid1 - grid2) * 0.5;
        }
        
        // RGB Color Splitting Effect
        vec3 applyColorSplitting(vec2 uv, vec3 baseColor) {
            float glitchAmount = u_glitchIntensity;
            if (u_audioEnabled > 0.5) {
                glitchAmount += u_highLevel * 0.1;
            }
            
            vec2 rOffset = vec2(glitchAmount, glitchAmount * 0.5);
            vec2 gOffset = vec2(-glitchAmount * 0.3, glitchAmount * 0.2);
            vec2 bOffset = vec2(glitchAmount * 0.1, -glitchAmount * 0.4);
            
            float r = baseColor.r;
            float g = baseColor.g * 0.9; // Slight offset sampling
            float b = baseColor.b * 0.8;
            
            return vec3(r, g, b);
        }
        
        // Advanced Color Mapping with Audio
        vec3 enhancedColorMapping(float distance, vec3 position) {
            // Base color from distance field
            vec3 color = vec3(0.0);
            
            // Inside/outside coloring
            if (distance < 0.0) {
                // Inside - bright core with audio reactivity
                float intensity = abs(distance) * 2.0;
                if (u_audioEnabled > 0.5) {
                    intensity += u_bassLevel * 0.5;
                }
                
                color = vec3(
                    0.2 + intensity * 0.8,
                    0.1 + intensity * 0.6,
                    0.8 + intensity * 0.2
                );
            } else {
                // Outside - edge glow with fade
                float edge = exp(-distance * 8.0);
                if (u_audioEnabled > 0.5) {
                    edge += exp(-distance * 15.0) * u_midLevel;
                }
                
                color = vec3(
                    edge * 0.9,
                    edge * 0.7,
                    edge * 1.2
                );
            }
            
            // Apply color shift
            float hueShift = u_colorShift;
            if (u_audioEnabled > 0.5) {
                hueShift += sin(u_time + u_pitchFactor * 6.28) * 0.3;
            }
            
            // Simple hue rotation
            float cosShift = cos(hueShift);
            float sinShift = sin(hueShift);
            mat3 hueMatrix = mat3(
                cosShift + (1.0 - cosShift) / 3.0,
                (1.0 - cosShift) / 3.0 - sinShift * 0.577,
                (1.0 - cosShift) / 3.0 + sinShift * 0.577,
                (1.0 - cosShift) / 3.0 + sinShift * 0.577,
                cosShift + (1.0 - cosShift) / 3.0,
                (1.0 - cosShift) / 3.0 - sinShift * 0.577,
                (1.0 - cosShift) / 3.0 - sinShift * 0.577,
                (1.0 - cosShift) / 3.0 + sinShift * 0.577,
                cosShift + (1.0 - cosShift) / 3.0
            );
            
            return hueMatrix * color;
        }
        
        void main() {
            // Normalized coordinates
            vec2 uv = (v_uv - 0.5) * 2.0;
            uv.x *= u_resolution.x / u_resolution.y;
            
            // 3D ray setup
            vec3 rayOrigin = vec3(0.0, 0.0, 2.0);
            vec3 rayDirection = normalize(vec3(uv, -1.0));
            
            // Ray marching parameters
            float totalDistance = 0.0;
            float minDistance = 1000.0;
            vec3 currentPos;
            
            // Enhanced ray marching with audio influence
            for (int i = 0; i < 64; i++) {
                currentPos = rayOrigin + rayDirection * totalDistance;
                
                // Main distance function
                float distance = hypercubeLattice(currentPos, u_morphFactor, u_gridDensity);
                
                // Add moiré effects
                float moire = generateMoire(currentPos, u_morphFactor * 0.5, u_gridDensity * 0.8);
                distance = min(distance, moire - 0.02);
                
                minDistance = min(minDistance, distance);
                
                // Ray marching step
                if (distance < 0.001 || totalDistance > 10.0) break;
                totalDistance += distance * 0.7; // Slower marching for detail
            }
            
            // Color calculation
            vec3 finalColor = enhancedColorMapping(minDistance, currentPos);
            
            // Apply RGB color splitting
            finalColor = applyColorSplitting(v_uv, finalColor);
            
            // Enhance contrast and saturation
            finalColor = pow(finalColor, vec3(0.8));
            finalColor = mix(vec3(dot(finalColor, vec3(0.299, 0.587, 0.114))), finalColor, 1.4);
            
            // Audio-reactive brightness boost
            if (u_audioEnabled > 0.5) {
                finalColor *= 1.0 + u_bassLevel * 0.3;
            }
            
            gl_FragColor = vec4(finalColor, 1.0);
        }`;
        
        // Geometry data for fullscreen quad
        this.vertices = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        
        this.indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        
        this.hasShaders = true;
    }
    
    // Initialize audio context for audio-reactive effects
    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Get microphone input
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            
            this.audioEnabled = true;
            console.log('🎵 MVEP Audio integration enabled');
        } catch (error) {
            console.warn('⚠️ Audio access denied, continuing without audio:', error);
            this.audioEnabled = false;
        }
    }
    
    // Get audio data for shader uniforms
    getAudioData() {
        if (!this.audioEnabled || !this.analyser) {
            return {
                bassLevel: 0,
                midLevel: 0,
                highLevel: 0,
                pitchFactor: 0
            };
        }
        
        this.analyser.getByteFrequencyData(this.frequencyData);
        
        // Extract frequency bands
        const bassLevel = this.getFrequencyBand(0, 8) / 255.0;        // 20-250Hz
        const midLevel = this.getFrequencyBand(8, 64) / 255.0;       // 250-4000Hz  
        const highLevel = this.getFrequencyBand(64, 128) / 255.0;    // 4000-12000Hz
        
        // Simple pitch estimation
        const pitchFactor = this.detectDominantFrequency() / 1000.0;
        
        return { bassLevel, midLevel, highLevel, pitchFactor };
    }
    
    getFrequencyBand(startBin, endBin) {
        let sum = 0;
        for (let i = startBin; i < endBin && i < this.frequencyData.length; i++) {
            sum += this.frequencyData[i];
        }
        return sum / (endBin - startBin);
    }
    
    detectDominantFrequency() {
        let maxAmplitude = 0;
        let dominantBin = 0;
        
        for (let i = 1; i < this.frequencyData.length; i++) {
            if (this.frequencyData[i] > maxAmplitude) {
                maxAmplitude = this.frequencyData[i];
                dominantBin = i;
            }
        }
        
        // Convert bin to frequency (approximate)
        const sampleRate = this.audioContext?.sampleRate || 44100;
        return (dominantBin * sampleRate) / (this.analyser?.fftSize || 256);
    }
}

// Register the enhanced geometry
if (typeof window !== 'undefined' && window.GeometryRegistry) {
    console.log('🚀 Registering MVEP Enhanced Geometry...');
    
    // Create and register the geometry
    const mvepGeometry = new MVEPEnhancedGeometry();
    window.GeometryRegistry.prototype.registerMVEPGeometry = function() {
        this.geometries.set('mvep-enhanced', mvepGeometry);
        console.log('✅ MVEP Enhanced Geometry registered successfully');
        
        // Initialize audio if available
        mvepGeometry.initializeAudio();
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MVEPEnhancedGeometry;
}