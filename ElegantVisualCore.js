/**
 * Elegant Visual Core - Sophisticated Movement and Tasteful Design
 * 
 * Creates flowing, organic 4D visualizations with:
 * - Graceful particle systems
 * - Smooth organic transitions  
 * - Tasteful color palettes
 * - Elegant geometric flows
 * - Sophisticated lighting
 */

class ElegantVisualCore {
    constructor() {
        this.name = 'elegant-hypercube';
        this.displayName = 'Elegant 4D Flow';
        this.category = 'refined';
        
        // Refined parameters for elegant movement
        this.parameters = {
            flowSpeed: { min: 0.1, max: 2.0, default: 0.8 },
            particleCount: { min: 50, max: 500, default: 200 },
            eleganceLevel: { min: 0.0, max: 1.0, default: 0.7 },
            organicFlow: { min: 0.0, max: 1.0, default: 0.85 },
            lightIntensity: { min: 0.3, max: 1.2, default: 0.9 },
            colorHarmony: { min: 0.0, max: 1.0, default: 0.8 },
            dimensionBlend: { min: 3.0, max: 4.5, default: 3.6 }
        };
        
        this.createRefinedShaders();
    }
    
    createRefinedShaders() {
        // Elegant vertex shader with smooth transformations
        this.vertexShader = `#version 100
        precision highp float;
        
        attribute vec2 a_position;
        varying vec2 v_uv;
        varying vec3 v_worldPos;
        
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            v_worldPos = vec3(a_position * 2.0, 0.0);
            gl_Position = vec4(a_position, 0.0, 1.0);
        }`;
        
        // Sophisticated fragment shader with organic flows
        this.fragmentShader = `#version 100
        precision highp float;
        
        varying vec2 v_uv;
        varying vec3 v_worldPos;
        
        // Elegant parameters
        uniform float u_time;
        uniform float u_flowSpeed;
        uniform float u_particleCount;
        uniform float u_eleganceLevel;
        uniform float u_organicFlow;
        uniform float u_lightIntensity;
        uniform float u_colorHarmony;
        uniform float u_dimensionBlend;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        
        // Noise functions for organic movement
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for(int i = 0; i < 4; i++) {
                value += amplitude * noise(p);
                p *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }
        
        // Elegant 4D rotation with smooth interpolation
        mat4 rotate4D(float time, float elegance) {
            float smooth_time = time * u_flowSpeed;
            
            // Smooth, organic rotation speeds
            float angleXW = smooth_time * 0.23 * elegance;
            float angleYW = smooth_time * 0.17 * elegance;
            float angleZW = smooth_time * 0.19 * elegance;
            
            // Create smooth rotation matrix
            float cx = cos(angleXW), sx = sin(angleXW);
            float cy = cos(angleYW), sy = sin(angleYW);
            float cz = cos(angleZW), sz = sin(angleZW);
            
            return mat4(
                cx * cy, -sx * cz + cx * sy * sz, sx * sz + cx * sy * cz, 0.0,
                sx * cy, cx * cz + sx * sy * sz, -cx * sz + sx * sy * cz, 0.0,
                -sy, cy * sz, cy * cz, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }
        
        // Graceful 4D to 3D projection
        vec3 project4D(vec4 p4d) {
            float w_offset = 3.0 + sin(u_time * 0.1) * 0.5; // Gentle breathing
            float perspective = 1.0 / (w_offset + p4d.w * 0.5);
            return p4d.xyz * perspective;
        }
        
        // Elegant particle field
        float particleField(vec3 p, float time) {
            float field = 0.0;
            float particle_scale = u_particleCount * 0.01;
            
            for(float i = 0.0; i < 8.0; i++) {
                // Organic particle positioning
                vec3 particle_pos = vec3(
                    sin(time * 0.3 + i * 2.1) * 2.0,
                    cos(time * 0.25 + i * 1.7) * 2.0,
                    sin(time * 0.2 + i * 1.3) * 1.5
                );
                
                // Create 4D particle and project
                vec4 p4d = vec4(particle_pos + p * 0.5, sin(time * 0.15 + i));
                p4d = rotate4D(time, u_eleganceLevel) * p4d;
                vec3 projected = project4D(p4d);
                
                // Soft, elegant particle glow
                float dist = length(projected - p);
                float particle_size = 0.3 + sin(time + i) * 0.1;
                float glow = particle_size / (dist * dist + 0.1);
                
                field += glow * (0.5 + 0.5 * sin(time * 0.5 + i));
            }
            
            return field * particle_scale;
        }
        
        // Flowing hypercube structure
        float hypercubeFlow(vec3 p, float time) {
            // Create flowing 4D hypercube
            vec4 p4d = vec4(p, sin(time * 0.1 + p.x * 0.5));
            
            // Apply organic rotation
            p4d = rotate4D(time, u_organicFlow) * p4d;
            
            // Project to 3D with breathing effect
            vec3 projected = project4D(p4d);
            
            // Create elegant lattice structure
            vec3 lattice_p = projected * u_dimensionBlend;
            vec3 grid = abs(fract(lattice_p) - 0.5);
            
            // Smooth, flowing edges
            float edge_thickness = 0.05 + sin(time * 0.2) * 0.02;
            float edges = min(min(grid.x, grid.y), grid.z) - edge_thickness;
            
            // Add organic flow distortion
            float flow_distortion = fbm(projected.xy + time * 0.1) * 0.1;
            edges += flow_distortion;
            
            return edges;
        }
        
        // Sophisticated lighting model
        vec3 calculateLighting(vec3 pos, vec3 normal, float time) {
            // Gentle, moving light sources
            vec3 light1 = normalize(vec3(sin(time * 0.3), cos(time * 0.2), 1.0));
            vec3 light2 = normalize(vec3(-cos(time * 0.25), sin(time * 0.35), 0.5));
            
            // Soft diffuse lighting
            float diffuse1 = max(0.0, dot(normal, light1)) * 0.6;
            float diffuse2 = max(0.0, dot(normal, light2)) * 0.4;
            
            // Ambient lighting for elegance
            float ambient = 0.3;
            
            return vec3(ambient + diffuse1 + diffuse2) * u_lightIntensity;
        }
        
        // Elegant color palette
        vec3 elegantColorPalette(float t, float harmony) {
            // Sophisticated color transitions
            vec3 color1 = vec3(0.6, 0.8, 1.0);  // Soft blue
            vec3 color2 = vec3(1.0, 0.9, 0.7);  // Warm cream
            vec3 color3 = vec3(0.9, 0.7, 1.0);  // Gentle purple
            vec3 color4 = vec3(0.7, 1.0, 0.8);  // Soft green
            
            // Smooth color transitions
            float phase = t * 4.0;
            
            if(phase < 1.0) {
                return mix(color1, color2, smoothstep(0.0, 1.0, phase));
            } else if(phase < 2.0) {
                return mix(color2, color3, smoothstep(1.0, 2.0, phase));
            } else if(phase < 3.0) {
                return mix(color3, color4, smoothstep(2.0, 3.0, phase));
            } else {
                return mix(color4, color1, smoothstep(3.0, 4.0, phase));
            }
        }
        
        // Mouse interaction for gentle responsiveness
        vec2 getMouseInfluence() {
            vec2 mouse_normalized = u_mouse / u_resolution;
            vec2 influence = (mouse_normalized - 0.5) * 2.0;
            return influence * 0.3; // Subtle influence
        }
        
        void main() {
            // Screen coordinates with mouse influence
            vec2 uv = (v_uv - 0.5) * 2.0;
            uv.x *= u_resolution.x / u_resolution.y;
            
            // Add gentle mouse responsiveness
            vec2 mouse_influence = getMouseInfluence();
            uv += mouse_influence * 0.1;
            
            // Create elegant 3D ray
            vec3 ray_origin = vec3(0.0, 0.0, 3.0);
            vec3 ray_dir = normalize(vec3(uv, -1.0));
            
            // Ray marching with grace
            float total_distance = 0.0;
            float min_distance = 1000.0;
            vec3 current_pos;
            vec3 surface_normal = vec3(0.0);
            
            // Elegant ray marching
            for(int i = 0; i < 48; i++) {
                current_pos = ray_origin + ray_dir * total_distance;
                
                // Combine hypercube structure and particle field
                float hypercube_dist = hypercubeFlow(current_pos, u_time);
                float particle_dist = -particleField(current_pos, u_time) + 0.5;
                
                float distance = min(hypercube_dist, particle_dist);
                min_distance = min(min_distance, distance);
                
                if(distance < 0.001 || total_distance > 8.0) break;
                
                total_distance += distance * 0.8; // Gentle stepping
            }
            
            // Calculate surface normal for lighting
            if(min_distance < 0.1) {
                float epsilon = 0.001;
                surface_normal = normalize(vec3(
                    hypercubeFlow(current_pos + vec3(epsilon, 0, 0), u_time) - 
                    hypercubeFlow(current_pos - vec3(epsilon, 0, 0), u_time),
                    hypercubeFlow(current_pos + vec3(0, epsilon, 0), u_time) - 
                    hypercubeFlow(current_pos - vec3(0, epsilon, 0), u_time),
                    hypercubeFlow(current_pos + vec3(0, 0, epsilon), u_time) - 
                    hypercubeFlow(current_pos - vec3(0, 0, epsilon), u_time)
                ));
            }
            
            // Elegant color composition
            vec3 final_color = vec3(0.0);
            
            if(min_distance < 0.1) {
                // Surface hit - elegant shading
                vec3 lighting = calculateLighting(current_pos, surface_normal, u_time);
                
                // Color based on position and time
                float color_t = (sin(u_time * 0.2 + current_pos.x * 0.3) + 1.0) * 0.5;
                vec3 base_color = elegantColorPalette(color_t, u_colorHarmony);
                
                final_color = base_color * lighting;
                
                // Add gentle rim lighting
                float rim = 1.0 - abs(dot(surface_normal, ray_dir));
                final_color += vec3(0.2, 0.3, 0.5) * pow(rim, 3.0) * 0.5;
                
            } else {
                // Background - subtle gradient
                float bg_gradient = length(uv) * 0.3;
                vec3 bg_color1 = vec3(0.05, 0.08, 0.12);
                vec3 bg_color2 = vec3(0.02, 0.04, 0.08);
                final_color = mix(bg_color1, bg_color2, bg_gradient);
                
                // Add particle glow for atmosphere
                float particle_glow = particleField(current_pos, u_time);
                final_color += vec3(0.1, 0.15, 0.2) * particle_glow * 0.3;
            }
            
            // Elegant post-processing
            final_color = pow(final_color, vec3(0.9)); // Gentle gamma
            final_color = mix(vec3(dot(final_color, vec3(0.299, 0.587, 0.114))), final_color, 1.1); // Subtle saturation
            
            // Gentle vignette for focus
            float vignette = 1.0 - length(uv) * 0.3;
            final_color *= vignette;
            
            gl_FragColor = vec4(final_color, 1.0);
        }`;
        
        // Simple geometry for fullscreen rendering
        this.vertices = new Float32Array([
            -1, -1,  1, -1,  -1, 1,  1, 1
        ]);
        
        this.indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
        this.hasShaders = true;
    }
    
    // Mouse tracking for gentle interaction
    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
    
    // Get refined parameters for elegant movement
    getRefinedParameters(time) {
        return {
            flowSpeed: 0.8 + Math.sin(time * 0.1) * 0.2,
            eleganceLevel: 0.7 + Math.sin(time * 0.05) * 0.1,
            organicFlow: 0.85 + Math.cos(time * 0.07) * 0.1,
            lightIntensity: 0.9 + Math.sin(time * 0.12) * 0.2,
            colorHarmony: 0.8 + Math.cos(time * 0.08) * 0.15
        };
    }
}

// Register the elegant geometry
if (typeof window !== 'undefined' && window.GeometryRegistry) {
    console.log('✨ Registering Elegant Visual Core...');
    
    const elegantGeometry = new ElegantVisualCore();
    window.GeometryRegistry.prototype.registerElegantGeometry = function() {
        this.geometries.set('elegant-hypercube', elegantGeometry);
        console.log('🌟 Elegant Visual Core registered successfully');
    };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantVisualCore;
}