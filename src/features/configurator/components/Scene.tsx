import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { ConfigurableModel } from './ConfigurableModel'

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
            <ConfigurableModel />
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
