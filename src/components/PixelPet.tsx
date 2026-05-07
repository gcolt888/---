import { useEffect, useRef } from 'react'
import type { PetType, PetStage, PetMood, PetAction } from '../store/usePetStore'
import { getSpriteForState, getTotalFrames, type SpriteDef } from './spriteConfig'

interface PixelPetProps {
  species: PetType
  mood: PetMood
  stage: PetStage
  action: PetAction
  isDead: boolean
  food: number
  foodProgress: number
}

const imageCache = new Map<string, HTMLImageElement>()

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return Promise.resolve(cached)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => { imageCache.set(src, img); resolve(img) }
    img.onerror = reject
    img.src = src
  })
}

export default function PixelPet({
  species: _species,
  mood,
  stage: _stage,
  action,
  isDead,
}: PixelPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const frameRef = useRef(0)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const spriteDef = getSpriteForState(action, mood)
    frameRef.current = 0
    lastTimeRef.current = 0

    loadImage(spriteDef.src).then(() => {
      if (!animRef.current) {
        animRef.current = requestAnimationFrame(tick)
      }
    })

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      animRef.current = 0
    }
  }, [action, mood])

  function tick(timestamp: number) {
    const canvas = canvasRef.current
    if (!canvas) { animRef.current = requestAnimationFrame(tick); return }
    const ctx = canvas.getContext('2d')
    if (!ctx) { animRef.current = requestAnimationFrame(tick); return }

    const spriteDef = getSpriteForState(action, mood)
    const img = imageCache.get(spriteDef.src)
    if (!img) { animRef.current = requestAnimationFrame(tick); return }

    const frameInterval = 1000 / spriteDef.fps
    if (timestamp - lastTimeRef.current >= frameInterval) {
      frameRef.current = (frameRef.current + 1) % getTotalFrames(spriteDef)
      lastTimeRef.current = timestamp
    }

    const fw = img.width / spriteDef.cols
    const fh = img.height / spriteDef.rows
    const col = frameRef.current % spriteDef.cols
    const row = Math.floor(frameRef.current / spriteDef.cols)

    const parent = canvas.parentElement
    const displayW = parent ? parent.clientWidth : 320
    const displayH = parent ? parent.clientHeight : 320
    const scale = Math.min(displayW / fw, displayH / fh) * (window.devicePixelRatio || 1)

    canvas.width = fw * scale
    canvas.height = fh * scale
    canvas.style.width = (fw * scale / (window.devicePixelRatio || 1)) + 'px'
    canvas.style.height = (fh * scale / (window.devicePixelRatio || 1)) + 'px'

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, col * fw, row * fh, fw, fh, 0, 0, fw * scale, fh * scale)

    animRef.current = requestAnimationFrame(tick)
  }

  if (isDead) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-6xl mb-4 opacity-50">💀</div>
        <p className="text-gray-400 font-bold text-sm">你的宠物离开了...</p>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="block mx-auto"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
