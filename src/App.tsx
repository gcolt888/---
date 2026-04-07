import React, { useEffect, useState } from 'react'
import { usePetStore, PET_SPECIES, PetType } from './store/usePetStore'
import PixelPet from './components/PixelPet'
import GameSelector from './components/games/GameSelector'
import RockPaperScissors from './components/games/RockPaperScissors'
import WhackAMole from './components/games/WhackAMole'
import { PixelButton } from './components/ui/PixelButton'

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-gray-700 mb-1 font-bold">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-4 bg-gray-800 border-2 border-gray-900">
      <div
        className="h-full transition-all duration-300"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
)

const PetSelector: React.FC<{ onSelect: (species: PetType, name: string) => void }> = ({
  onSelect,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<PetType>('fire')
  const [petName, setPetName] = useState('')

  const speciesData = PET_SPECIES.find((s) => s.id === selectedSpecies)!

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="crt-filter w-full max-w-lg">
        <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">✨ 选择你的宠物 ✨</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {PET_SPECIES.map((species) => (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(species.id)}
                className={`p-4 border-4 rounded-lg transition-all cursor-pointer
                  ${selectedSpecies === species.id ? 'border-yellow-500 bg-yellow-100' : 'border-gray-400 bg-white hover:border-gray-600'}`}
              >
                <div
                  className="w-8 h-8 mx-auto mb-2 rounded-full"
                  style={{ backgroundColor: species.colors.primary }}
                />
                <p className="font-bold text-gray-800">{species.name}</p>
                <p className="text-xs text-gray-500">{species.description}</p>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">给它起个名字：</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder={speciesData.evolutionNames.baby}
              className="w-full px-4 py-2 border-4 border-gray-800 text-center font-bold text-lg"
              maxLength={10}
            />
          </div>

          <div className="text-center">
            <PixelButton
              onClick={() => onSelect(selectedSpecies, petName || speciesData.evolutionNames.baby)}
              color="bg-green-400"
              className="text-xl px-8 py-3"
            >
              🎉 开始冒险！
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  )
}

const FoodSelector: React.FC<{
  onSelect: (food: 'apple' | 'noodle' | 'pudding' | 'cola') => void
  onClose: () => void
}> = ({ onSelect, onClose }) => {
  const foods = [
    { id: 'apple' as const, name: '🍎 苹果', color: 'bg-red-400' },
    { id: 'noodle' as const, name: '🍜 方便面', color: 'bg-yellow-400' },
    { id: 'pudding' as const, name: '🍮 布丁', color: 'bg-orange-400' },
    { id: 'cola' as const, name: '🥤 可乐', color: 'bg-brown-400' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ 选择食物 🍽️</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {foods.map((food) => (
            <PixelButton
              key={food.id}
              onClick={() => onSelect(food.id)}
              color={food.color}
              className="py-3"
            >
              {food.name}
            </PixelButton>
          ))}
        </div>
        
        <PixelButton onClick={onClose} color="bg-gray-400">
          取消
        </PixelButton>
      </div>
    </div>
  )
}

const EvolutionModal: React.FC<{
  onEvolve: () => void
  onCancel: () => void
  currentName: string
  nextName: string
}> = ({ onEvolve, onCancel, currentName, nextName }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-8 max-w-sm w-full text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🌟 可以进化了！🌟</h2>
      <p className="text-gray-700 mb-2">{currentName} 即将进化为...</p>
      <p className="text-3xl font-bold text-purple-600 mb-6">{nextName}！</p>
      <div className="flex gap-4 justify-center">
        <PixelButton onClick={onEvolve} color="bg-purple-400">
          ✨ 进化！
        </PixelButton>
        <PixelButton onClick={onCancel} color="bg-gray-400">
          稍后
        </PixelButton>
      </div>
    </div>
  </div>
)

function App() {
  const pet = usePetStore((state) => state.pet)
  const choosePet = usePetStore((state) => state.choosePet)
  const feed = usePetStore((state) => state.feed)
  const play = usePetStore((state) => state.play)
  const clean = usePetStore((state) => state.clean)
  const sleep = usePetStore((state) => state.sleep)
  const wakeUp = usePetStore((state) => state.wakeUp)
  const resetPet = usePetStore((state) => state.resetPet)
  const setName = usePetStore((state) => state.setName)
  const evolve = usePetStore((state) => state.evolve)
  const decayStats = usePetStore((state) => state.decayStats)
  const feedWithFood = usePetStore((state) => state.feedWithFood)
  const [nameInput, setNameInput] = useState(pet.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showEvolutionModal, setShowEvolutionModal] = useState(false)
  const [showGameSelector, setShowGameSelector] = useState(false)
  const [currentGame, setCurrentGame] = useState<'rock-paper-scissors' | 'whack-a-mole' | null>(null)
  const [showFoodSelector, setShowFoodSelector] = useState(false)
  const updateFoodProgress = usePetStore((state) => state.updateFoodProgress)

  useEffect(() => {
    const stored = localStorage.getItem('pixel-pet-storage')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.state && data.state.pet && data.state.pet.hasChosenPet === undefined) {
          localStorage.removeItem('pixel-pet-storage')
        }
      } catch (e) {
        localStorage.removeItem('pixel-pet-storage')
      }
    }
  }, [])

  useEffect(() => {
    if (pet.action === 'eating' && pet.food) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        updateFoodProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [pet.action, pet.food, updateFoodProgress])

  const speciesData = PET_SPECIES.find((s) => s.id === pet.species)!

  useEffect(() => {
    const interval = setInterval(() => {
      decayStats()
    }, 1000)
    return () => clearInterval(interval)
  }, [decayStats])

  useEffect(() => {
    if (pet.experience >= pet.experienceToEvolve && pet.stage !== 'adult' && !pet.isDead) {
      setShowEvolutionModal(true)
    }
  }, [pet.experience, pet.experienceToEvolve, pet.stage, pet.isDead])

  const formatAge = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const hrs = Math.floor(mins / 60)
    if (hrs > 0) return `${hrs}小时${mins % 60}分`
    if (mins > 0) return `${mins}分钟`
    return `${Math.floor(seconds)}秒`
  }

  const getMoodText = () => {
    if (pet.isDead) return '已离开...'
    switch (pet.mood) {
      case 'happy':
        return '好开心！'
      case 'sad':
        return '好难过...'
      case 'sleeping':
        return 'zzZ 睡觉中'
      default:
        return '嗯~'
    }
  }

  const getStageText = () => {
    switch (pet.stage) {
      case 'baby':
        return '幼年期'
      case 'teen':
        return '成长期'
      case 'adult':
        return '成熟期'
    }
  }

  if (!pet.hasChosenPet) {
    return <PetSelector onSelect={choosePet} />
  }

  const getNextEvolutionName = () => {
    if (pet.stage === 'baby') return speciesData.evolutionNames.teen
    if (pet.stage === 'teen') return speciesData.evolutionNames.adult
    return ''
  }

  const handleGameWin = () => {
    play()
  }

  const handleGameLose = () => {
  }

  const handleGameDraw = () => {
  }

  const handleGameSelect = (game: 'rock-paper-scissors' | 'whack-a-mole') => {
    setCurrentGame(game)
    setShowGameSelector(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-500 flex items-center justify-center p-4">
      <div className="crt-filter w-full max-w-md">
        <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-6 shadow-2xl">
          <div className="text-center mb-4">
            {isEditingName ? (
              <div className="flex gap-2 justify-center">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2 py-1 border-4 border-gray-800 text-center font-bold"
                  maxLength={10}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setName(nameInput)
                      setIsEditingName(false)
                    }
                  }}
                />
                <PixelButton
                  onClick={() => {
                    setName(nameInput)
                    setIsEditingName(false)
                  }}
                  color="bg-green-400"
                >
                  ✓
                </PixelButton>
              </div>
            ) : (
              <h1
                className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-yellow-600"
                onClick={() => setIsEditingName(true)}
              >
                {pet.name}
              </h1>
            )}
            <p className="text-sm text-gray-600 mt-1">{getMoodText()}</p>
            <div className="flex justify-center gap-4 mt-1">
              <span className="text-xs text-gray-500">年龄: {formatAge(pet.age)}</span>
              <span className="text-xs font-bold" style={{ color: speciesData.colors.primary }}>
                {getStageText()}
              </span>
            </div>
          </div>

          <div className="bg-white border-4 border-gray-800 rounded-lg p-0 mb-4 min-h-[320px] w-full h-[320px] flex flex-col justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              <PixelPet
                species={pet.species}
                mood={pet.mood}
                stage={pet.stage}
                action={pet.action}
                isDead={pet.isDead}
                food={pet.food}
                foodProgress={pet.foodProgress}
              />
            </div>
            {pet.isDead && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
                <p className="text-gray-700 font-bold">你的宠物离开了...</p>
                <PixelButton onClick={resetPet} color="bg-red-400" className="mt-4">
                  重新开始
                </PixelButton>
              </div>
            )}
          </div>

          {!pet.isDead && (
            <>
              <div className="bg-gray-200 border-4 border-gray-800 rounded-lg p-4 mb-4">
                <StatBar label="🍖 饥饿" value={pet.hunger} color="#F59E0B" />
                <StatBar label="😊 心情" value={pet.happiness} color="#EC4899" />
                <StatBar label="🧼 清洁" value={pet.cleanliness} color="#3B82F6" />
                <StatBar label="❤️ 健康" value={pet.health} color="#EF4444" />
                <StatBar label="⚡ 精力" value={pet.energy} color="#10B981" />
                <div className="mt-3 pt-3 border-t-2 border-gray-400">
                  <div className="flex justify-between text-xs text-gray-700 font-bold">
                    <span>✨ 经验值</span>
                    <span>
                      {Math.round(pet.experience)} / {pet.experienceToEvolve}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 border-2 border-gray-900 mt-1">
                    <div
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${(pet.experience / pet.experienceToEvolve) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <PixelButton
                  onClick={() => setShowFoodSelector(true)}
                  disabled={pet.mood === 'sleeping' || pet.hunger >= 100}
                  color="bg-orange-400"
                >
                  🍖 喂食
                </PixelButton>
                <PixelButton
                  onClick={play}
                  disabled={pet.mood === 'sleeping' || pet.energy < 20}
                  color="bg-pink-400"
                >
                  🎮 玩耍
                </PixelButton>
                <PixelButton
                  onClick={clean}
                  disabled={pet.mood === 'sleeping' || pet.cleanliness >= 100}
                  color="bg-blue-400"
                >
                  🧼 洗澡
                </PixelButton>
                {pet.mood === 'sleeping' ? (
                  <PixelButton onClick={wakeUp} color="bg-yellow-300">
                    ☀️ 叫醒
                  </PixelButton>
                ) : (
                  <PixelButton onClick={sleep} disabled={pet.energy >= 100} color="bg-indigo-400">
                    💤 睡觉
                  </PixelButton>
                )}
              </div>
              
              <div className="text-center">
                <PixelButton 
                  onClick={() => setShowGameSelector(true)}
                  disabled={pet.mood === 'sleeping'}
                  color="bg-purple-400"
                  className="w-full"
                >
                  🎯 小游戏
                </PixelButton>
              </div>
            </>
          )}
        </div>
      </div>

      {showEvolutionModal && (
        <EvolutionModal
          onEvolve={() => {
            evolve()
            setShowEvolutionModal(false)
          }}
          onCancel={() => setShowEvolutionModal(false)}
          currentName={pet.name}
          nextName={getNextEvolutionName()}
        />
      )}

      {showGameSelector && (
        <GameSelector 
          onSelect={handleGameSelect}
          onClose={() => setShowGameSelector(false)}
        />
      )}

      {currentGame === 'rock-paper-scissors' && (
        <RockPaperScissors 
          onClose={() => setCurrentGame(null)}
          onWin={handleGameWin}
          onLose={handleGameLose}
          onDraw={handleGameDraw}
        />
      )}

      {currentGame === 'whack-a-mole' && (
        <WhackAMole 
          onClose={() => setCurrentGame(null)}
          onWin={handleGameWin}
          onLose={handleGameLose}
        />
      )}

      {showFoodSelector && (
        <FoodSelector 
          onSelect={(food) => {
            feedWithFood(food)
            setShowFoodSelector(false)
          }}
          onClose={() => setShowFoodSelector(false)}
        />
      )}
    </div>
  )
}

export default App
