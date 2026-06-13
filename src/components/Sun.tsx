import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface SunProps {
  radius?: number
}

export function Sun({ radius = 3.5 }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    const material1 = meshRef.current?.material as THREE.ShaderMaterial | undefined
    const material2 = glowRef.current?.material as THREE.ShaderMaterial | undefined

    if (material1 && material1.uniforms) {
      material1.uniforms.uTime.value = timeRef.current
    }
    if (material2 && material2.uniforms) {
      material2.uniforms.uTime.value = timeRef.current
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={`
            uniform float uTime;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            // Simple noise function
            float hash(vec3 p) {
              return fract(sin(dot(p, vec3(1.0, 2.0, 3.0))) * 43758.5453);
            }
            
            float noise(vec3 p) {
              vec3 d = floor(p);
              vec4 o = smoothstep(0.0, 1.0, fract(p - d));
              return mix(hash(d), hash(d + 1.0), o.x);
            }
            
            void main() {
              vUv = uv;
              vNormal = normal;
              
              float displacement = noise(vec3(position * 2.0 + uTime * 0.5)) * 0.1;
              vec3 newPosition = position + normal * displacement;
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              
              vec3 coreColor = vec3(1.0, 0.9, 0.5);
              vec3 edgeColor = vec3(1.0, 0.4, 0.0);
              
              float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
              
              gl_FragColor = vec4(mix(coreColor, edgeColor, intensity), pulse);
            }
          `}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.5, 32, 32]} />
        <shaderMaterial
          transparent
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
    </group>
  )
}
