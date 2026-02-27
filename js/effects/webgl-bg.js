import {$,  DOM } from '../config/dom.js';
import { currentScreen } from '../core/screen.js';

    // WEBGL COSMIC NEURAL BACKGROUND ("WOW FACTOR")
    // ═══════════════════════════════════════
export function initWebGLBackground() {
      const canvas = $('webgl-bg');
      if (!canvas) return;

      const gl = canvas.getContext('webgl', { alpha: true });
      if (!gl) {
        console.warn("WebGL not supported, falling back to static background.");
        return;
      }

      // Vertex Shader: simply passing through coordinates
      const vsSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: complex cosmic/neural fluid-like effect
      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;

        // Psuedo-random noise function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        // 2D Noise based on Morgan McGuire @morgan3d
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) + 
                   (c - a)* u.y * (1.0 - u.x) + 
                   (d - b) * u.x * u.y;
        }

        // Fractional Brownian Motion (fBm)
        #define OCTAVES 5
        float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < OCTAVES; i++) {
                value += amplitude * noise(st);
                st *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }

        void main() {
            vec2 st = gl_FragCoord.xy / uResolution.xy;
            st.x *= uResolution.x / uResolution.y;

            vec2 mouse = uMouse / uResolution.xy;
            mouse.x *= uResolution.x / uResolution.y;

            vec3 color = vec3(0.0);

            // Fluid-like domain warping
            vec2 q = vec2(0.);
            q.x = fbm( st + 0.00 * uTime);
            q.y = fbm( st + vec2(1.0));

            vec2 r = vec2(0.);
            r.x = fbm( st + 1.0*q + vec2(1.7, 9.2) + 0.15*uTime );
            r.y = fbm( st + 1.0*q + vec2(8.3, 2.8) + 0.126*uTime );

            // Introduce mouse interaction
            float dist = distance(st, mouse);
            r += vec2(0.3 / (dist * 10.0 + 1.0)) * vec2(cos(uTime), sin(uTime));

            float f = fbm(st + r);

            // Color palette (Crimson, Deep Red, Dark Void)
            color = mix(vec3(0.05, 0.0, 0.0),
                        vec3(0.5, 0.0, 0.0),
                        clamp((f*f)*4.0, 0.0, 1.0));

            color = mix(color,
                        vec3(0.86, 0.08, 0.24), // Crimson highlights
                        clamp(length(q), 0.0, 1.0));

            color = mix(color,
                        vec3(1.0, 0.2, 0.2), // Bright core 
                        clamp(length(r.x), 0.0, 1.0));

            // Add subtle neural connection lines
            float network = noise(st * 10.0 + uTime * 0.5);
            network = smoothstep(0.45, 0.5, network) * smoothstep(0.55, 0.5, network);
            color += vec3(network * 0.3, network * 0.1, network * 0.1);
            
            // Mouse glow
            float glow = smoothstep(0.3, 0.0, dist);
            color += vec3(glow * 0.5, glow * 0.1, glow * 0.1);

            // Output with modulated opacity (keeps background visible)
            gl_FragColor = vec4((f*f*f + 0.6 * f*f + 0.5 * f) * color, 0.8 * f);
        }
      `;

      function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return;
      }

      gl.useProgram(shaderProgram);

      // Buffer setup
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const timeLocation = gl.getUniformLocation(shaderProgram, 'uTime');
      const resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
      const mouseLocation = gl.getUniformLocation(shaderProgram, 'uMouse');

      const startTime = Date.now();
      let webglMouse = { x: 0, y: 0 };

      // Update mouse for webgl (with slight damping)
      document.addEventListener('mousemove', (e) => {
        webglMouse.x = e.clientX;
        // WebGL coordinates are usually Y-up, but since we map to screen, we invert Y usually or keep it relative
        webglMouse.y = window.innerHeight - e.clientY;
      });

      function render(time) {
        if (currentScreen !== 'card-select') {
          requestAnimationFrame(render);
          return;
        }

        const dpr = window.devicePixelRatio || 1;

        // Only resize if necessary to save performance
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
          canvas.width = displayWidth * dpr;
          canvas.height = displayHeight * dpr;
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        const t = (Date.now() - startTime) / 1000.0;

        gl.uniform1f(timeLocation, t);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // Interpolate mouse for smoother shader reaction
        gl.uniform2f(mouseLocation, webglMouse.x * dpr, webglMouse.y * dpr);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Blending for opacity
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    }

    // WebGL background is now initialized inside enterArcade()

export function setMode(mode) {
      const recBtn = document.getElementById("btn-rec-mode");
      const arcBtn = document.getElementById("btn-arcade-mode");
      const recContainer = document.getElementById("recruiter-mode");

      if (mode === "recruiter") {
        recBtn.classList.add("active");
        arcBtn.classList.remove("active");
        recContainer.classList.remove("hidden");
      } else {
        arcBtn.classList.add("active");
        recBtn.classList.remove("active");
        recContainer.classList.add("hidden");
      }
    }
