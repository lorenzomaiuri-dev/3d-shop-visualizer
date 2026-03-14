import { useGLTF } from '@react-three/drei'
import { useConfiguratorStore } from '../../../store/useConfiguratorStore'
import { useEffect } from 'react'
import * as THREE from 'three'

export function ConfigurableModel() {
  const { product, selectedVariant } = useConfiguratorStore()

  const { scene } = useGLTF(product?.model_path || '')

  useEffect(() => {
    if (!scene || !selectedVariant) return

    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        console.log('Mesh:', child.name)
        if (
          child.name === selectedVariant.target_mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.color.set(selectedVariant.color)
        }

        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene, selectedVariant])

  return <primitive object={scene} />
}
