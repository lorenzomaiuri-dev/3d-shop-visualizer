import { Canvas } from '@react-three/fiber'
import { Badge } from '@/components/ui/badge'
import { ConfigurableModel } from './ConfigurableModel'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import { Box } from 'lucide-react'

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

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <XR store={store}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <ConfigurableModel />
        </XR>
      </Canvas>
    </div>
  )
}

export default Scene
