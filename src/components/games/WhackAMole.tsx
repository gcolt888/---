import React, { useState, useEffect, useRef } from 'react'
import { PixelButton } from '../ui/PixelButton'

interface WhackAMoleProps {
  onClose: () => void
  onWin: () => void
  onLose: () => void
}

interface Hole {
  id: number
  hasMole: boolean
  isWhacked: boolean
}

const WhackAMole: React.FC<WhackAMoleProps> = ({ onClose, onWin, onLose }) => {
  const [holes, setHoles] = useState<Hole[]>([
    { id: 1, hasMole: false, isWhacked: false },
    { id: 2, hasMole: false, isWhacked: false },
    { id: 3, hasMole: false, isWhacked: false },
    { id: 4, hasMole: false, isWhacked: false },
    { id: 5, hasMole: false, isWhacked: false },
    { id: 6, hasMole: false, isWhacked: false },
    { id: 7, hasMole: false, isWhacked: false },
    { id: 8, hasMole: false, isWhacked: false },
    { id: 9, hasMole: false, isWhacked: false },
  ])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const gameInterval = useRef<number | null>(null)
  const moleInterval = useRef<number | null>(null)

  useEffect(() => {
    startGame()
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current)
      if (moleInterval.current) clearInterval(moleInterval.current)
    }
  }, [])

  const startGame = () => {
    gameInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    spawnMole()
  }

  const spawnMole = () => {
    moleInterval.current = setInterval(() => {
      setHoles(prevHoles => {
        const newHoles = prevHoles.map(hole => ({
          ...hole,
          hasMole: false,
          isWhacked: false,
        }))
        
        const availableHoles = newHoles.filter(hole => !hole.hasMole)
        if (availableHoles.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableHoles.length)
          newHoles[availableHoles[randomIndex].id - 1].hasMole = true
        }
        
        return newHoles
      })
    }, 800)
  }

  const endGame = () => {
    if (gameInterval.current) clearInterval(gameInterval.current)
    if (moleInterval.current) clearInterval(moleInterval.current)
    setGameOver(true)
    
    if (score >= 10) {
      onWin()
    } else {
      onLose()
    }
  }

  const handleWhack = (holeId: number) => {
    setHoles(prevHoles => {
      const newHoles = prevHoles.map(hole => {
        if (hole.id === holeId && hole.hasMole && !hole.isWhacked) {
          setScore(prev => prev + 1)
          return { ...hole, isWhacked: true, hasMole: false }
        }
        return hole
      })
      return newHoles
    })
  }

  const resetGame = () => {
    setHoles(holes.map(hole => ({ ...hole, hasMole: false, isWhacked: false })))
    setScore(0)
    setTimeLeft(30)
    setGameOver(false)
    startGame()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          🐭 打地鼠 🐭
        </h2>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="font-bold">分数: {score}</p>
          </div>
          <div>
            <p className="font-bold">时间: {timeLeft}s</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {holes.map((hole) => (
            <div 
              key={hole.id}
              className="aspect-square bg-gray-700 rounded-full flex items-center justify-center cursor-pointer relative"
              onClick={() => handleWhack(hole.id)}
              style={{
                border: '4px solid #333',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
              }}
            >
              {hole.hasMole && !hole.isWhacked && (
                <div className="text-3xl">
                  🐭
                </div>
              )}
              {hole.isWhacked && (
                <div className="text-3xl">
                  🤯
                </div>
              )}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">游戏结束！</h3>
            <p className="text-lg mb-4">最终分数: {score}</p>
            {score >= 10 ? (
              <p className="text-green-600 font-bold mb-4">🎉 恭喜你赢了！</p>
            ) : (
              <p className="text-red-600 font-bold mb-4">😢 再试一次吧！</p>
            )}
            <PixelButton 
              onClick={resetGame} 
              color="bg-green-400" 
              className="mb-4"
            >
              再玩一次
            </PixelButton>
          </div>
        )}

        <div className="text-center mt-6">
          <PixelButton onClick={onClose} color="bg-gray-400">
            结束游戏
          </PixelButton>
        </div>
      </div>
    </div>
  )
}

export default WhackAMole
