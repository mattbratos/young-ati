"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Fog } from "three"
import * as THREE from "three"

const TRACKS = [
  "Hacker Flip",
  "Office Late At Night",
  "No One Callin",
  "Nothing Works",
  "Gray Cold Warsaw Days",
  "Grind",
  "3 AM",
  "404 Problems",
  "New Terry Davis",
  "Black Collar",
  "YC Email",
  "Your Idol's Boss's Boss",
  "New Delhi Freestyle",
]

// Seeded pseudo-random for deterministic city layout
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function Buildings() {
  const groupRef = useRef<THREE.Group>(null!)
  const rand = seededRandom(42)

  const buildings = useMemo(() => {
    const items = []
    const cols = 12
    const rows = 30
    const spacingX = 6
    const spacingZ = 10

    for (let row = 0; row < rows; row++) {
      for (let col = -Math.floor(cols / 2); col <= Math.floor(cols / 2); col++) {
        const r = rand()
        const height = 4 + r * 28
        const width = 1.5 + rand() * 2.5
        const depth = 1.5 + rand() * 2.5
        const x = col * spacingX + (rand() - 0.5) * 2
        const z = -row * spacingZ
        const hue = rand() > 0.7 ? (rand() > 0.5 ? 0.55 : 0.85) : 0.0
        const sat = hue > 0 ? 0.8 + rand() * 0.2 : 0
        const lit = 0.08 + rand() * 0.12

        items.push({ height, width, depth, x, z, hue, sat, lit, key: `${row}-${col}` })
      }
    }
    return items
  }, [])

  // Windows as instanced geometry
  const windowData = useMemo(() => {
    const wrand = seededRandom(99)
    const positions: number[] = []
    const colors: number[] = []
    buildings.forEach((b) => {
      const floorsY = Math.floor(b.height / 1.2)
      const floorsX = Math.max(1, Math.floor(b.width / 1.1))
      for (let fy = 0; fy < floorsY; fy++) {
        for (let fx = 0; fx < floorsX; fx++) {
          if (wrand() > 0.65) continue
          const wx = b.x - b.width / 2 + (fx + 0.5) * (b.width / floorsX)
          const wy = 0.6 + fy * 1.2
          const wz = b.z + b.depth / 2 + 0.02
          positions.push(wx, wy, wz)
          // yellow/orange warm light or cool blue
          const warm = wrand() > 0.3
          if (warm) {
            colors.push(1, 0.85 + wrand() * 0.15, 0.3 + wrand() * 0.2)
          } else {
            colors.push(0.4 + wrand() * 0.2, 0.6 + wrand() * 0.2, 1)
          }
        }
      }
    })
    return { positions, colors, count: positions.length / 3 }
  }, [buildings])

  const windowGeometry = useMemo(() => new THREE.PlaneGeometry(0.35, 0.5), [])
  const windowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  const instancedWindows = useMemo(() => {
    const mesh = new THREE.InstancedMesh(
      windowGeometry,
      windowMaterial,
      windowData.count
    )
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    for (let i = 0; i < windowData.count; i++) {
      dummy.position.set(
        windowData.positions[i * 3],
        windowData.positions[i * 3 + 1],
        windowData.positions[i * 3 + 2]
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      color.setRGB(
        windowData.colors[i * 3],
        windowData.colors[i * 3 + 1],
        windowData.colors[i * 3 + 2]
      )
      mesh.setColorAt(i, color)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    return mesh
  }, [windowData, windowGeometry, windowMaterial])

  // Slow forward drift
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z += delta * 4
      // Loop back when we've drifted too far
      if (groupRef.current.position.z > 80) {
        groupRef.current.position.z -= 80
      }
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((b) => (
        <mesh key={b.key} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(b.hue, b.sat, b.lit)}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
      <primitive object={instancedWindows} />
    </group>
  )
}

function NeonSigns() {
  const signsRef = useRef<THREE.Group>(null!)
  const rand = seededRandom(77)

  const signs = useMemo(() =>
    TRACKS.map((track, i) => ({
      track,
      x: (rand() - 0.5) * 40,
      z: -20 - i * 22 - rand() * 10,
      y: 8 + rand() * 12,
      hue: rand() > 0.5 ? 0.55 : 0.9,
    })),
    []
  )

  useFrame((_, delta) => {
    if (signsRef.current) {
      signsRef.current.position.z += delta * 4
      if (signsRef.current.position.z > 80) {
        signsRef.current.position.z -= 80
      }
    }
  })

  return (
    <group ref={signsRef}>
      {signs.map((s) => (
        <mesh key={s.track} position={[s.x, s.y, s.z]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -100]}>
      <planeGeometry args={[120, 300]} />
      <meshStandardMaterial color="#050505" roughness={1} />
    </mesh>
  )
}

function Road() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -100]}>
        <planeGeometry args={[8, 300]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -100]}>
        <planeGeometry args={[0.12, 300]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
    </>
  )
}

export function CityScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 40, 60], fov: 55, near: 0.1, far: 400 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ scene, camera }) => {
          scene.background = new THREE.Color("#020205")
          scene.fog = new Fog("#020205", 60, 200)
          camera.lookAt(0, 0, -40)
        }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 30, 10]} intensity={4} color="#4444ff" />
        <pointLight position={[-20, 20, -30]} intensity={3} color="#ff00aa" />
        <pointLight position={[20, 20, -60]} intensity={2} color="#00ffcc" />
        <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
        <Ground />
        <Road />
        <Buildings />
        <NeonSigns />
      </Canvas>
    </div>
  )
}
