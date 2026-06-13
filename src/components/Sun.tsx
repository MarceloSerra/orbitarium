import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

interface SunProps {
  radius?: number
}

export function Sun({ radius = 3.5 }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    meshRef.current?.rotateY(delta * 0.02)

    const material1 = meshRef.current?.material as THREE.ShaderMaterial | undefined
    const material2 = glowRef.current?.material as THREE.ShaderMaterial | undefined
    const material3 = coronaRef.current?.material as THREE.ShaderMaterial | undefined

    if (material1 && material1.uniforms) {
      material1.uniforms.uTime.value = timeRef.current
    }
    if (material2 && material2.uniforms) {
      material2.uniforms.uTime.value = timeRef.current
    }
    if (material3 && material3.uniforms) {
      material3.uniforms.uTime.value = timeRef.current
    }
  })

  return (
    <group>
      {/* Core sun with layered noise */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            uniform float uTime;
            varying vec3 vNormal;
            
            // Hash-based noise
            float hash(vec3 p) {
              return fract(sin(dot(p, vec3(1.0, 2.0, 3.0))) * 43758.5453);
            }
            
            float noise(vec3 p) {
              vec3 d = floor(p);
              vec3 o = smoothstep(0.0, 1.0, fract(p - d));
              return mix(hash(d), hash(d + 1.0), o.x * o.y * o.z);
            }
            
            float fbm(vec3 p) {
              float f = 0.0;
              float a = 0.5;
              for(int i = 0; i < 4; i++) {
                f += a * noise(p);
                p *= 2.0;
                a *= 0.5;
              }
              return f;
            }
            
            void main() {
              vNormal = normal;
              
              float n1 = fbm(vec3(position * 2.0, uTime * 0.2));
              float n2 = noise(vec3(position * 4.0, uTime * 0.5));
              
              float displacement = (n1 + n2) * 0.1;
              vec3 newPosition = position + normal * displacement;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              
              vec3 coreColor = vec3(1.0, 0.95, 0.6);
              vec3 midColor = vec3(1.0, 0.7, 0.2);
              vec3 edgeColor = vec3(1.0, 0.4, 0.0);
              
              float pulse = sin(uTime * 2.0) * 0.05 + 0.95;
              
              gl_FragColor = vec4(mix(coreColor, mix(midColor, edgeColor, intensity), intensity), pulse);
            }
          `}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.5, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec3 vNormal;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              
              vec3 glowColor = vec3(1.0, 0.8, 0.4);
              float pulse = sin(uTime * 1.5) * 0.1 + 0.9;
              
              gl_FragColor = vec4(glowColor, intensity * 0.6 * pulse);
            }
          `}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Outer corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 2.5, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              
              vec3 coronaColor = vec3(1.0, 0.9, 0.7);
              float pulse = sin(uTime * 0.8) * 0.2 + 0.8;
              
              gl_FragColor = vec4(coronaColor, intensity * 0.3 * pulse);
            }
          `}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      <Html center occlude>
        <div style={{
          color: '#ffddaa',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 0 6px rgba(255, 170, 50, 0.8)',
          pointerEvents: 'none'
        }}>
          Sun
        </div>
      </Html>
    </group>
  )
}
