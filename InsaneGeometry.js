/**
 * INSANE Geometry - Mind-Blowing 4D Visualization
 * 
 * Creates absolutely WILD effects that are actually useful and spectacular:
 * - Fractal hypercube tessellations
 * - Time-warped dimensional folding
 * - Quantum probability tunneling
 * - Chaotic strange attractors in 4D
 * - Reality-bending visual effects
 */

class InsaneGeometry {
    constructor() {
        this.name = 'insane-hyperdimensional';
        this.displayName = 'INSANE Hyperdimensional Matrix';
        this.category = 'mind-bending';
        
        // INSANE parameters for reality-bending effects
        this.parameters = {
            chaosLevel: { min: 0.0, max: 10.0, default: 5.0 },
            dimensionBreak: { min: 3.0, max: 8.0, default: 4.2 },
            timeWarp: { min: 0.1, max: 50.0, default: 1.0 },
            fractalDepth: { min: 1, max: 20, default: 8 },
            quantumTunnel: { min: 0.0, max: 5.0, default: 2.0 },
            realityBend: { min: 0.0, max: 100.0, default: 25.0 },
            chaosAttractor: { min: 0.0, max: 10.0, default: 3.14 },
            hyperspaceFlow: { min: 0.0, max: 20.0, default: 7.5 }
        };
        
        this.createInsaneShaders();
    }
    
    createInsaneShaders() {
        // INSANE vertex shader with reality distortion
        this.vertexShader = `#version 100
        precision highp float;
        
        attribute vec2 a_position;
        varying vec2 v_uv;
        varying vec3 v_worldPos;
        varying vec4 v_hyperspacePos;
        
        uniform float u_time;
        uniform float u_dimensionBreak;
        uniform float u_timeWarp;
        
        // Reality distortion functions
        vec4 hyperspaceTransform(vec2 pos, float time) {
            float warpedTime = time * u_timeWarp;
            
            // 8D to 4D projection
            vec4 hyperPos = vec4(
                pos.x + sin(warpedTime * 0.7 + pos.y * 2.0) * 0.3,
                pos.y + cos(warpedTime * 0.5 + pos.x * 1.5) * 0.3,
                sin(warpedTime * 0.3 + length(pos) * 3.0) * 0.5,
                cos(warpedTime * 0.2 + dot(pos, pos) * 2.0) * 0.4
            );
            
            // Dimension breaking effect
            if (u_dimensionBreak > 4.0) {
                float extraDim = u_dimensionBreak - 4.0;
                hyperPos.xyz *= 1.0 + extraDim * 0.5;
                hyperPos.w += sin(extraDim * warpedTime) * 0.3;
            }
            
            return hyperPos;
        }
        
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            v_worldPos = vec3(a_position * 2.0, 0.0);
            v_hyperspacePos = hyperspaceTransform(a_position, u_time);
            
            gl_Position = vec4(a_position, 0.0, 1.0);
        }`;
        
        // ABSOLUTELY INSANE fragment shader
        this.fragmentShader = `#version 100
        precision highp float;
        
        varying vec2 v_uv;
        varying vec3 v_worldPos;
        varying vec4 v_hyperspacePos;
        
        // INSANE parameters
        uniform float u_time;
        uniform float u_chaosLevel;
        uniform float u_dimensionBreak;
        uniform float u_timeWarp;
        uniform float u_fractalDepth;
        uniform float u_quantumTunnel;
        uniform float u_realityBend;
        uniform float u_chaosAttractor;
        uniform float u_hyperspaceFlow;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        
        // Chaos and noise functions
        float hash(vec3 p) {
            p = fract(p * vec3(443.897, 441.423, 437.195));
            p += dot(p, p.yzx + 19.19);
            return fract((p.x + p.y) * p.z);
        }
        
        float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            return mix(
                mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        
        float fractalNoise(vec3 p, float depth) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            
            for (float i = 0.0; i < 16.0; i++) {
                if (i >= depth) break;
                value += amplitude * noise3D(p * frequency);
                frequency *= 2.0;
                amplitude *= 0.5;
            }
            
            return value;
        }
        
        // INSANE 8D rotation matrices
        mat4 rotateHyperChaos(float time, float chaos) {
            float t = time * u_timeWarp + chaos * 10.0;
            
            // Multiple nested rotations for chaos
            float c1 = cos(t * 0.7), s1 = sin(t * 0.7);
            float c2 = cos(t * 1.3), s2 = sin(t * 1.3);
            float c3 = cos(t * 0.5), s3 = sin(t * 0.5);
            float c4 = cos(t * 2.1), s4 = sin(t * 2.1);
            
            return mat4(
                c1*c3 - s1*s2*s3, -s1*c2, c1*s3 + s1*s2*c3, s4*chaos,
                s1*c3 + c1*s2*s3, c1*c2, s1*s3 - c1*s2*c3, -c4*chaos,
                -c2*s3, s2, c2*c3, sin(chaos*t),
                -s4*sin(t), c4*cos(t), cos(chaos), 1.0
            );
        }
        
        // Project 4D to 3D with reality bending
        vec3 projectChaos4D(vec4 p4d, float bend) {
            float w_factor = 2.0 + p4d.w * bend * 0.1;
            vec3 projected = p4d.xyz / w_factor;
            
            // Reality bending distortion
            float bendAmount = bend * 0.01;
            projected.xy += sin(projected.z * 5.0 + u_time) * bendAmount;
            projected.z += cos(length(projected.xy) * 3.0 + u_time * 0.5) * bendAmount;
            
            return projected;
        }
        
        // INSANE fractal hypercube tessellation
        float insaneFractalField(vec3 p, float time) {
            float field = 0.0;
            vec3 originalP = p;
            
            // Quantum tunneling effect
            p += sin(p.yzx * u_quantumTunnel + time) * 0.2;
            
            // Fractal tessellation
            for (float level = 0.0; level < 12.0; level++) {
                if (level >= u_fractalDepth) break;
                
                float scale = pow(2.0, level);
                vec3 scaledP = p * scale;
                
                // Create chaos attractor influence
                vec3 attractor = vec3(
                    sin(time * 0.3 + level) * u_chaosAttractor,
                    cos(time * 0.2 + level) * u_chaosAttractor,
                    sin(time * 0.1 + level) * u_chaosAttractor
                );
                
                scaledP += attractor * (1.0 / scale);
                
                // 4D hypercube distance field
                vec4 p4d = vec4(scaledP, sin(time * 0.5 + level));
                p4d = rotateHyperChaos(time, u_chaosLevel * level * 0.1) * p4d;
                vec3 projected = projectChaos4D(p4d, u_realityBend);
                
                // Hypercube edges in 3D
                vec3 hyperCube = abs(fract(projected + 0.5) - 0.5);
                float edges = min(min(hyperCube.x, hyperCube.y), hyperCube.z);
                
                // Add fractal noise for chaos
                float chaos = fractalNoise(scaledP + time * 0.1, 4.0) * u_chaosLevel * 0.1;
                edges += chaos;
                
                field += edges / scale;
            }
            
            return field;
        }
        
        // Hyperspace flow field
        vec3 hyperspaceFlow(vec3 p, float time) {
            vec3 flow = vec3(0.0);
            
            // Multiple flow layers
            for (float i = 0.0; i < 8.0; i++) {
                float freq = pow(2.0, i);
                float amp = 1.0 / freq;
                
                vec3 flowP = p * freq + time * u_hyperspaceFlow * 0.1;
                
                flow += vec3(
                    sin(flowP.y + cos(flowP.z)),
                    cos(flowP.z + sin(flowP.x)),
                    sin(flowP.x + cos(flowP.y))
                ) * amp;
            }
            
            return flow * u_hyperspaceFlow * 0.05;
        }
        
        // Strange attractor field
        float strangeAttractor(vec3 p, float time) {
            // Lorenz-like attractor in 3D space
            vec3 pos = p * 5.0;
            float t = time * u_timeWarp * 0.1;
            
            // Lorenz equations modified for chaos
            float sigma = 10.0 + u_chaosAttractor;
            float rho = 28.0 + u_chaosLevel;
            float beta = 8.0/3.0;
            
            vec3 flow = vec3(
                sigma * (pos.y - pos.x),
                pos.x * (rho - pos.z) - pos.y,
                pos.x * pos.y - beta * pos.z
            );
            
            // Distance to attractor trajectory
            vec3 trajectory = pos + flow * t * 0.01;
            return length(trajectory - p * 5.0) - 0.1;
        }
        
        // INSANE color system
        vec3 insaneColorSystem(float field, vec3 position, float time) {
            // Base chaos color
            vec3 color = vec3(0.0);
            
            // Quantum color tunneling
            float tunnel = sin(field * 20.0 + time * 2.0) * 0.5 + 0.5;
            tunnel = pow(tunnel, u_quantumTunnel);
            
            // Reality bending color shifts
            float bend = u_realityBend * 0.01;
            vec3 bendColor = vec3(
                sin(position.x * 5.0 + time + bend * 10.0),
                cos(position.y * 4.0 + time * 1.3 + bend * 8.0),
                sin(position.z * 6.0 + time * 0.7 + bend * 12.0)
            ) * 0.5 + 0.5;
            
            // Chaos level influences
            float chaos = u_chaosLevel * 0.1;
            
            if (field < 0.0) {
                // Inside hypercube - INSANE core colors
                float intensity = abs(field) * 10.0;
                intensity = pow(intensity, 1.0 + chaos);
                
                color = mix(
                    vec3(1.0, 0.2, 0.8), // Hot magenta
                    vec3(0.1, 1.0, 0.3), // Electric green
                    tunnel
                );
                
                color = mix(color, bendColor, bend);
                color *= intensity * (1.0 + chaos);
                
                // Add hyperspace flow influence
                vec3 flow = hyperspaceFlow(position, time);
                color += flow * 0.3;
                
            } else {
                // Outside - chaotic glow field
                float glow = exp(-field * (5.0 + chaos * 3.0));
                
                color = vec3(
                    glow * (0.5 + bendColor.r * 0.5),
                    glow * (0.3 + bendColor.g * 0.4),
                    glow * (1.0 + bendColor.b * 0.3)
                );
                
                // Strange attractor influence
                float attractor = strangeAttractor(position, time);
                float attractorGlow = exp(-abs(attractor) * 10.0);
                color += vec3(attractorGlow * 0.8, attractorGlow * 0.2, attractorGlow * 1.0);
            }
            
            // Dimension breaking effects
            if (u_dimensionBreak > 4.0) {
                float extraDim = u_dimensionBreak - 4.0;
                color *= 1.0 + extraDim * 0.5;
                color += sin(color * 10.0 + time) * extraDim * 0.1;
            }
            
            return color;
        }
        
        void main() {
            // Screen coordinates with reality bending
            vec2 uv = (v_uv - 0.5) * 2.0;
            uv.x *= u_resolution.x / u_resolution.y;
            
            // Mouse influence for chaos
            vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
            float mouseInfluence = length(mouse) * u_chaosLevel * 0.1;
            uv += mouse * mouseInfluence;
            
            // Create INSANE 3D ray
            vec3 rayOrigin = vec3(0.0, 0.0, 3.0);
            vec3 rayDir = normalize(vec3(uv, -1.0));
            
            // Add hyperspace flow to ray
            vec3 flowOffset = hyperspaceFlow(rayOrigin, u_time) * 0.1;
            rayOrigin += flowOffset;
            rayDir += hyperspaceFlow(rayDir, u_time * 0.5) * 0.05;
            rayDir = normalize(rayDir);
            
            // INSANE ray marching with reality bending
            float totalDistance = 0.0;
            float minDistance = 1000.0;
            vec3 currentPos;
            
            for (int i = 0; i < 80; i++) {
                currentPos = rayOrigin + rayDir * totalDistance;
                
                // Main insane fractal field
                float distance = insaneFractalField(currentPos, u_time);
                
                // Add strange attractor influence
                float attractorDist = strangeAttractor(currentPos, u_time);
                distance = min(distance, attractorDist);
                
                minDistance = min(minDistance, distance);
                
                if (distance < 0.001 || totalDistance > 15.0) break;
                
                // Chaos-influenced step size
                float stepSize = 0.5 + sin(u_time + totalDistance) * u_chaosLevel * 0.1;
                totalDistance += distance * stepSize;
            }
            
            // INSANE color composition
            vec3 finalColor = insaneColorSystem(minDistance, currentPos, u_time);
            
            // Time warp post-processing
            if (u_timeWarp > 5.0) {
                float warpEffect = (u_timeWarp - 5.0) * 0.1;
                finalColor += sin(finalColor * 20.0 + u_time * 10.0) * warpEffect;
            }
            
            // Quantum tunneling visual effect
            float quantumEffect = sin(length(uv) * 10.0 + u_time * 5.0) * u_quantumTunnel * 0.1;
            finalColor *= 1.0 + quantumEffect;
            
            // INSANE contrast and saturation
            finalColor = pow(finalColor, vec3(0.7 + u_chaosLevel * 0.05));
            finalColor = mix(
                vec3(dot(finalColor, vec3(0.299, 0.587, 0.114))), 
                finalColor, 
                1.5 + u_chaosLevel * 0.2
            );
            
            // Final reality check
            finalColor = clamp(finalColor, 0.0, 3.0);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }`;
        
        // Geometry for fullscreen quad
        this.vertices = new Float32Array([
            -1, -1,  1, -1,  -1, 1,  1, 1
        ]);
        
        this.indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        this.hasShaders = true;
    }
    
    // Get dynamic parameters for maximum insanity
    getInsaneParameters(time) {
        return {
            chaosLevel: 5.0 + Math.sin(time * 0.1) * 3.0,
            dimensionBreak: 4.2 + Math.cos(time * 0.05) * 1.5,
            timeWarp: 1.0 + Math.sin(time * 0.03) * 10.0,
            fractalDepth: 8 + Math.floor(Math.sin(time * 0.07) * 4),
            quantumTunnel: 2.0 + Math.cos(time * 0.12) * 2.0,
            realityBend: 25.0 + Math.sin(time * 0.08) * 50.0,
            chaosAttractor: 3.14 + Math.cos(time * 0.15) * 2.0,
            hyperspaceFlow: 7.5 + Math.sin(time * 0.06) * 10.0
        };
    }
}

// Register the INSANE geometry
if (typeof window !== 'undefined' && window.GeometryRegistry) {
    console.log('🔥 Registering INSANE Hyperdimensional Matrix...');
    
    const insaneGeometry = new InsaneGeometry();
    window.GeometryRegistry.prototype.registerInsaneGeometry = function() {
        this.geometries.set('insane-hyperdimensional', insaneGeometry);
        console.log('💥 INSANE Hyperdimensional Matrix registered - PREPARE FOR CHAOS!');
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InsaneGeometry;
}