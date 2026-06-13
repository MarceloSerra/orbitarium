import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'

interface PostProcessingProps {
  bloomIntensity?: number
}

export function PostProcessing({ bloomIntensity = 1 }: PostProcessingProps) {
  return (
    <EffectComposer>
      <Bloom intensity={bloomIntensity} luminanceThreshold={0.5} mipmapBlur />
      <ToneMapping />
    </EffectComposer>
  )
}
