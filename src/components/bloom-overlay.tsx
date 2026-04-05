"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"

// Horizontal neon grid lines scrolling toward camera
function NeonGrid() {
  const groupRef = useRef<THREE.Group>(null!)

  const lines = Array.from({ length: 20 }, (_, i) => ({
    z: -i * 12,
    opacity: 0.15 + Math.random() * 0.25,
  }))

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.z += delta * 5
    if (groupRef.current.position.z > 12) {
      groupRef.current.position.z -= 12
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {lines.map((line, i) => (
        <mesh key={i} position={[0, 0, line.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[80, 0.04]} />
          <meshBasicMaterial
            color="#00aaff"
            transparent
            opacity={line.opacity}
          />
        </mesh>
      ))}
      {/* Side lines */}
      {[-6, -4, -2, 0, 2, 4, 6].map((x, i) => (
        <mesh key={`v${i}`} position={[x * 4, 0, -120]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 240]} />
          <meshBasicMaterial
            color="#0066ff"
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  )
}

// Floating neon accent dots — like distant lit windows or signs
function NeonDots() {
  const positions = useRef(
    Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * 60,
      y: 2 + Math.random() * 20,
      z: -10 - Math.random() * 120,
      color: Math.random() > 0.5 ? "#ff00cc" : Math.random() > 0.5 ? "#00ffcc" : "#4466ff",
      size: 0.05 + Math.random() * 0.15,
    }))
  ).current

  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </>
  )
}

// Thin neon scan line sweeping across
function ScanLine() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = (clock.getElapsedTime() * 0.15) % 1
    meshRef.current.position.y = 30 - t * 50
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.04 + Math.sin(t * Math.PI) * 0.06
  })

  return (
    <mesh ref={meshRef} position={[0, 10, -20]}>
      <planeGeometry args={[200, 0.08]} />
      <meshBasicMaterial color="#00ccff" transparent opacity={0.06} />
    </mesh>
  )
}

export function BloomOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: "screen" }}>
      <Canvas
        camera={{ position: [0, 8, 30], fov: 60, far: 300 }}
        gl={{ alpha: true, antialias: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <NeonGrid />
        <NeonDots />
        <ScanLine />

        <EffectComposer>
          <Bloom
            intensity={3.5}
            luminanceThreshold={0.01}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.SCREEN}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
