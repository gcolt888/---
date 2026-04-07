import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type PetType = 'fire' | 'water' | 'grass' | 'electric'
export type PetStage = 'baby' | 'teen' | 'adult'
export type PetMood = 'happy' | 'normal' | 'sad' | 'sleeping' | 'eating' | 'thinking'
export type PetAction = 'idle' | 'eating' | 'playing' | 'sleeping' | 'cleaning'

export interface PetSpecies {
  id: PetType
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  evolutionNames: {
    baby: string
    teen: string
    adult: string
  }
}

export const PET_SPECIES: PetSpecies[] = [
  {
    id: 'fire',
    name: '火焰系',
    description: '活泼好动的火系宠物',
    colors: {
      primary: '#FF6B35',
      secondary: '#FFB08A',
      accent: '#FF4500',
    },
    evolutionNames: {
      baby: '小火苗',
      teen: '烈焰兽',
      adult: '炎龙王',
    },
  },
  {
    id: 'water',
    name: '水系',
    description: '温柔可爱的水系宠物',
    colors: {
      primary: '#4ECDC4',
      secondary: '#A8E6CF',
      accent: '#00BFFF',
    },
    evolutionNames: {
      baby: '小水滴',
      teen: '浪花兽',
      adult: '海神王',
    },
  },
  {
    id: 'grass',
    name: '草系',
    description: '自然清新的草系宠物',
    colors: {
      primary: '#95E1A3',
      secondary: '#C8F7C5',
      accent: '#32CD32',
    },
    evolutionNames: {
      baby: '小芽苗',
      teen: '森林兽',
      adult: '树精王',
    },
  },
  {
    id: 'electric',
    name: '电系',
    description: '活力四射的电系宠物',
    colors: {
      primary: '#FFE066',
      secondary: '#FFF59D',
      accent: '#FFD700',
    },
    evolutionNames: {
      baby: '小电球',
      teen: '闪电兽',
      adult: '雷神王',
    },
  },
]

export interface Pet {
  species: PetType
  name: string
  stage: PetStage
  mood: PetMood
  action: PetAction
  hunger: number
  happiness: number
  cleanliness: number
  health: number
  energy: number
  experience: number
  experienceToEvolve: number
  age: number
  isDead: boolean
  createdAt: number
  lastUpdated: number
  hasChosenPet: boolean
  food: 'apple' | 'noodle' | 'pudding' | 'cola' | null
  foodProgress: number
}

interface PetStore {
  pet: Pet
  choosePet: (species: PetType, name: string) => void
  feed: () => void
  play: () => void
  clean: () => void
  sleep: () => void
  wakeUp: () => void
  resetPet: () => void
  setName: (name: string) => void
  evolve: () => void
  decayStats: () => void
  setAction: (action: PetAction) => void
  feedWithFood: (food: 'apple' | 'noodle' | 'pudding' | 'cola') => void
  updateFoodProgress: (progress: number) => void
}

const getExpToEvolve = (stage: PetStage): number => {
  switch (stage) {
    case 'baby':
      return 100
    case 'teen':
      return 250
    case 'adult':
      return 999999
  }
}

export const createInitialPet = (): Pet => ({
  species: 'fire',
  name: '小宝贝',
  stage: 'baby',
  mood: 'normal',
  action: 'idle',
  hunger: 80,
  happiness: 70,
  cleanliness: 90,
  health: 100,
  energy: 100,
  experience: 0,
  experienceToEvolve: 100,
  age: 0,
  isDead: false,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  hasChosenPet: false,
  food: null,
  foodProgress: 0,
})

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pet: createInitialPet(),
      
      choosePet: (species: PetType, name: string) => {
        const speciesData = PET_SPECIES.find((s) => s.id === species)!
        const newPet: Pet = {
          ...createInitialPet(),
          species,
          name: name || speciesData.evolutionNames.baby,
          hasChosenPet: true,
          createdAt: Date.now(),
          lastUpdated: Date.now(),
        }
        set({ pet: newPet })
      },

      feed: () => {
        const { pet } = get()
        if (pet.isDead || pet.mood === 'sleeping') return
        const newHunger = Math.min(100, pet.hunger + 25)
        const newExperience = Math.min(pet.experienceToEvolve, pet.experience + 5)
        const newMood = pet.hunger < 30 ? 'happy' : pet.mood
        set({
          pet: {
            ...pet,
            hunger: newHunger,
            experience: newExperience,
            mood: newMood,
            action: 'eating',
            lastUpdated: Date.now(),
          },
        })
      },

      play: () => {
        const { pet } = get()
        if (pet.isDead || pet.mood === 'sleeping' || pet.energy < 20) return
        const newHappiness = Math.min(100, pet.happiness + 30)
        const newEnergy = Math.max(0, pet.energy - 20)
        const newExperience = Math.min(pet.experienceToEvolve, pet.experience + 10)
        set({
          pet: {
            ...pet,
            happiness: newHappiness,
            energy: newEnergy,
            experience: newExperience,
            mood: 'happy',
            action: 'playing',
            lastUpdated: Date.now(),
          },
        })
      },

      clean: () => {
        const { pet } = get()
        if (pet.isDead || pet.mood === 'sleeping') return
        set({
          pet: {
            ...pet,
            cleanliness: Math.min(100, pet.cleanliness + 40),
            action: 'cleaning',
            lastUpdated: Date.now(),
          },
        })
        
        setTimeout(() => {
          const currentPet = get().pet
          if (currentPet.action === 'cleaning') {
            set({
              pet: {
                ...currentPet,
                action: 'idle',
                lastUpdated: Date.now(),
              },
            })
          }
        }, 2000)
      },

      sleep: () => {
        const { pet } = get()
        if (pet.isDead) return
        set({
          pet: {
            ...pet,
            mood: 'sleeping',
            action: 'sleeping',
            lastUpdated: Date.now(),
          },
        })
      },

      wakeUp: () => {
        const { pet } = get()
        if (pet.isDead) return
        set({
          pet: {
            ...pet,
            mood: 'normal',
            action: 'idle',
            energy: Math.min(100, pet.energy + 50),
            lastUpdated: Date.now(),
          },
        })
      },

      resetPet: () => {
        set({ pet: { ...createInitialPet(), createdAt: Date.now(), lastUpdated: Date.now() } })
      },

      setName: (name: string) => {
        const { pet } = get()
        set({ pet: { ...pet, name } })
      },

      evolve: () => {
        const { pet } = get()
        if (pet.stage === 'adult') return
        const newStage: PetStage = pet.stage === 'baby' ? 'teen' : 'adult'
        set({
          pet: {
            ...pet,
            stage: newStage,
            experience: 0,
            experienceToEvolve: getExpToEvolve(newStage),
            lastUpdated: Date.now(),
          },
        })
      },

      setAction: (action: PetAction) => {
        const { pet } = get()
        set({ pet: { ...pet, action, lastUpdated: Date.now() } })
      },

      feedWithFood: (food: 'apple' | 'noodle' | 'pudding' | 'cola') => {
        const { pet } = get()
        if (pet.isDead || pet.mood === 'sleeping') return
        const newHunger = Math.min(100, pet.hunger + 25)
        const newExperience = Math.min(pet.experienceToEvolve, pet.experience + 5)
        const newMood = pet.hunger < 30 ? 'happy' : pet.mood
        set({
          pet: {
            ...pet,
            hunger: newHunger,
            experience: newExperience,
            mood: newMood,
            action: 'eating',
            food,
            foodProgress: 0,
            lastUpdated: Date.now(),
          },
        })
        
        setTimeout(() => {
          const currentPet = get().pet
          if (currentPet.action === 'eating') {
            set({
              pet: {
                ...currentPet,
                action: 'idle',
                food: null,
                foodProgress: 0,
                lastUpdated: Date.now(),
              },
            })
          }
        }, 2000)
      },

      updateFoodProgress: (progress: number) => {
        const { pet } = get()
        set({
          pet: {
            ...pet,
            foodProgress: progress,
            lastUpdated: Date.now(),
          },
        })
      },

      decayStats: () => {
        const { pet } = get()
        if (pet.isDead) return

        const now = Date.now()
        const timeDiff = (now - pet.lastUpdated) / 1000
        if (timeDiff < 1) return

        const decayRate = pet.mood === 'sleeping' ? 0.3 : 1
        let newHunger = Math.max(0, pet.hunger - timeDiff * 0.5 * decayRate)
        let newHappiness = Math.max(0, pet.happiness - timeDiff * 0.3 * decayRate)
        let newCleanliness = Math.max(0, pet.cleanliness - timeDiff * 0.2 * decayRate)
        let newEnergy = pet.energy

        if (pet.mood === 'sleeping') {
          newEnergy = Math.min(100, pet.energy + timeDiff * 2)
        }

        let newHealth = pet.health
        if (newHunger < 20 || newCleanliness < 20 || newHappiness < 20) {
          newHealth = Math.max(0, pet.health - timeDiff * 0.5)
        } else if (newHealth < 100) {
          newHealth = Math.min(100, pet.health + timeDiff * 0.2)
        }

        let newMood = pet.mood
        let newAction = pet.action
        let newFood = pet.food
        let newFoodProgress = pet.foodProgress
        if (newMood !== 'sleeping') {
          if (newHappiness > 60 && newHunger > 40) newMood = 'happy'
          else if (newHappiness < 30 || newHunger < 30) newMood = 'sad'
          else newMood = 'normal'
          if (newAction !== 'idle' && timeDiff > 3) {
            newAction = 'idle'
            newFood = null
            newFoodProgress = 0
          }
        }

        const newAge = pet.age + timeDiff
        const isDead = newHealth <= 0

        set({
          pet: {
            ...pet,
            hunger: newHunger,
            happiness: newHappiness,
            cleanliness: newCleanliness,
            energy: newEnergy,
            health: newHealth,
            age: newAge,
            mood: newMood,
            action: newAction,
            food: newFood,
            foodProgress: newFoodProgress,
            isDead,
            lastUpdated: now,
          },
        })
      },
    }),
    {
      name: 'pixel-pet-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
