// 精灵图配置：将宠物状态映射到对应的精灵图
import type { PetAction, PetMood } from '../store/usePetStore'

export interface SpriteDef {
  src: string
  cols: number
  rows: number
  fps: number
}

const BASE = '/sprites'

const S4x6 = (name: string, fps = 8): SpriteDef => ({
  src: `${BASE}/${name}.png`,
  cols: 4,
  rows: 6,
  fps,
})

const SPRITES: Record<string, SpriteDef> = {
  idle:   S4x6('idle', 8),
  eat:    S4x6('eat', 8),
  bath:   S4x6('bath', 8),
  sleep:  S4x6('sleep', 6),
  sad:    S4x6('sad', 6),
}

// 有专属精灵图的状态 → 精灵图 key
const ACTION_SPRITE: Record<PetAction, string | null> = {
  idle:     'idle',
  eating:   'eat',
  playing:  null,
  sleeping: 'sleep',
  cleaning: 'bath',
}

const MOOD_OVERRIDE: Partial<Record<PetMood, string>> = {
  sad:      'sad',
  sick:     'sad',
  poisoned: 'sad',
  happy:    'idle',
  thinking: 'idle',
}

export function getSpriteForState(
  action: PetAction,
  mood: PetMood
): SpriteDef {
  if (MOOD_OVERRIDE[mood]) {
    return SPRITES[MOOD_OVERRIDE[mood]]
  }
  const key = ACTION_SPRITE[action] ?? 'idle'
  return SPRITES[key] || SPRITES.idle
}

export function getTotalFrames(def: SpriteDef): number {
  return def.cols * def.rows
}
