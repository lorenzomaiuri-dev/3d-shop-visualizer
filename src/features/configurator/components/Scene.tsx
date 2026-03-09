import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Stage,
  MeshDistortMaterial,
  Float,
} from '@react-three/drei'
import { useConfiguratorStore } from '../../../store/useConfiguratorStore'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'

const ProductPlaceholder = () => {
  const selectedVariant = useConfiguratorStore((state) => state.selectedVariant)
  const color = selectedVariant?.color || '#ffffff'

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh scale={1.5} rotation={[0.5, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          radius={1}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </Float>
  )
}

const Scene = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-white/80">
          Rotate the product to view it from different angles!
        </Badge>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <ProductPlaceholder />
          </Stage>
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}

export default Scene
