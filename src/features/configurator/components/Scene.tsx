import { Canvas } from '@react-three/fiber'
import { Badge } from '@/components/ui/badge'
import { ConfigurableModel } from './ConfigurableModel'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import { Box } from 'lucide-react'
import {
  Center,
  OrbitControls,
  ContactShadows,
  Environment,
} from '@react-three/drei'

const store = createXRStore({
  depthSensing: true,
  hand: true,
})

const Scene = () => {
  return (
    <div className="group relative h-[600px] w-full overflow-hidden rounded-xl border bg-slate-50">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Badge
          variant="secondary"
          className="border-blue-100 bg-white/80 backdrop-blur-sm"
        >
          Rotate the product to view it from different angles!
        </Badge>

        <Button
          onClick={() => store.enterAR()}
          variant="secondary"
          size="sm"
          className="w-fit gap-2 bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
        >
          <Box className="h-4 w-4" />
          View in AR
        </Button>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <XR store={store}>
          <Environment preset="city" />

          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1.5}
            castShadow
          />

          <Center top>
            <ConfigurableModel />
          </Center>

          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={1}
          />

          <OrbitControls
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.75}
          />
        </XR>
      </Canvas>
    </div>
  )
}

export default Scene
