import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function TransparentScene() {
    const { scene, gl } = useThree()
    useEffect(() => {
        scene.background = null
        gl.setClearColor(0x000000, 0)
    }, [scene, gl])
    return null
}

function GlobeSphere() {
    const ref = useRef<THREE.Points>(null!)

    const positions = useMemo(() => {
        const pts = new Float32Array(120 * 3)
        for (let i = 0; i < 120; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            pts[i * 3] = 1.5 * Math.sin(phi) * Math.cos(theta)
            pts[i * 3 + 1] = 1.5 * Math.sin(phi) * Math.sin(theta)
            pts[i * 3 + 2] = 1.5 * Math.cos(phi)
        }
        return pts
    }, [])

    useFrame((_, delta) => {
        ref.current.rotation.y += delta * 0.3
        ref.current.rotation.x += delta * 0.05
    })

    return (
        <Points ref={ref} positions={positions}>
            <PointMaterial
                size={0.05}
                color="#4da6ff"
                sizeAttenuation
                transparent
                opacity={0.8}
            />
        </Points>
    )
}

function FieldParticles() {
    const positions = useMemo(() => {
        const pts = new Float32Array(200 * 3)
        for (let i = 0; i < 200; i++) {
            pts[i * 3] = (Math.random() - 0.5) * 10
            pts[i * 3 + 1] = (Math.random() - 0.5) * 8
            pts[i * 3 + 2] = (Math.random() - 0.5) * 6
        }
        return pts
    }, [])

    return (
        <Points positions={positions}>
            <PointMaterial
                size={0.025}
                color="#3366cc"
                transparent
                opacity={0.5}
            />
        </Points>
    )
}

export default function ParticleGlobe() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <TransparentScene />
                <ambientLight intensity={0.5} />
                <GlobeSphere />
                <FieldParticles />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    )
}