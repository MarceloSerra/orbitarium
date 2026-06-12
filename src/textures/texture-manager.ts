import { TextureLoader, CanvasTexture } from 'three'

const TEXTURE_TIMEOUT = 5000
const RETRY_COUNT = 2

interface TextureResult {
  success: boolean
  texture: any | null
}

export async function loadPlanetTexture(
  url: string,
  fallbackColor: string
): Promise<TextureResult> {
  for (let attempt = 0; attempt < RETRY_COUNT; attempt++) {
    try {
      const texture = await loadWithTimeout(url)
      return { success: true, texture }
    } catch {
      console.warn(`Texture load attempt ${attempt + 1} failed:`, url)
    }
  }

  console.log('Using procedural fallback for', fallbackColor)
  const fallbackTexture = createProceduralFallback(fallbackColor)
  return { success: false, texture: fallbackTexture }
}

function loadWithTimeout(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Texture load timeout'))
    }, TEXTURE_TIMEOUT)

    const loader = new TextureLoader()
    loader.load(
      url,
      (texture) => {
        clearTimeout(timeout)
        resolve(texture)
      },
      undefined,
      (error) => {
        clearTimeout(timeout)
        reject(error)
      }
    )
  })
}

function createProceduralFallback(color: string): any {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    128, 64, 0,
    128, 64, 128
  )
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, adjustBrightness(color, -30))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 128)

  const texture = new CanvasTexture(canvas)
  return texture
}

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
