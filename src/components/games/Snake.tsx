import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PixelButton } from '../ui/PixelButton'

interface SnakeProps {
  onClose: () => void
  onWin: () => void
  onLose: () => void
}

const BOARD_SIZE = 15
const TARGET_SCORE = 20

type Direction = 'up' | 'down' | 'left' | 'right'

type Position = {
  x: number
  y: number
}

const Snake: React.FC<SnakeProps> = ({ onClose, onWin, onLose }) => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 }
  ])
  const [food, setFood] = useState<Position>({ x: 3, y: 3 })
  const [direction, setDirection] = useState<Direction>('up')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const directionRef = useRef<Direction>('up')
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true
    }
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0]
      const newDirection = directionRef.current
      let newHead: Position

      switch (newDirection) {
        case 'up':
          newHead = { x: head.x, y: head.y - 1 }
          break
        case 'down':
          newHead = { x: head.x, y: head.y + 1 }
          break
        case 'left':
          newHead = { x: head.x - 1, y: head.y }
          break
        case 'right':
          newHead = { x: head.x + 1, y: head.y }
          break
      }

      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true)
        onLose()
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 1
          if (newScore >= TARGET_SCORE) {
            setGameWon(true)
            onWin()
          }
          return newScore
        })
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, checkCollision, generateFood, onWin, onLose])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (gameOver || gameWon || isPaused) return

    const currentDir = directionRef.current
    switch (e.key) {
      case 'ArrowUp':
        if (currentDir !== 'down') {
          directionRef.current = 'up'
          setDirection('up')
        }
        break
      case 'ArrowDown':
        if (currentDir !== 'up') {
          directionRef.current = 'down'
          setDirection('down')
        }
        break
      case 'ArrowLeft':
        if (currentDir !== 'right') {
          directionRef.current = 'left'
          setDirection('left')
        }
        break
      case 'ArrowRight':
        if (currentDir !== 'left') {
          directionRef.current = 'right'
          setDirection('right')
        }
        break
    }
  }, [gameOver, gameWon, isPaused])

  const handleDirectionButton = (newDir: Direction) => {
    if (gameOver || gameWon || isPaused) return

    const currentDir = directionRef.current
    if (
      (newDir === 'up' && currentDir !== 'down') ||
      (newDir === 'down' && currentDir !== 'up') ||
      (newDir === 'left' && currentDir !== 'right') ||
      (newDir === 'right' && currentDir !== 'left')
    ) {
      directionRef.current = newDir
      setDirection(newDir)
    }
  }

  useEffect(() => {
    if (!isPaused && !gameOver && !gameWon) {
      gameLoopRef.current = setInterval(moveSnake, 150)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPaused, gameOver, gameWon, moveSnake])

  const resetGame = () => {
    const initialSnake = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 }
    ]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection('up')
    directionRef.current = 'up'
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setIsPaused(true)
  }

  const togglePause = () => {
    if (!gameOver && !gameWon) {
      setIsPaused(prev => !prev)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          🐍 贪吃蛇 🐍
        </h2>

        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-lg font-bold">
            分数: {score}/{TARGET_SCORE}
          </div>
        </div>

        <div className="bg-gray-800 border-4 border-gray-900 rounded-lg p-1 mb-4">
          <div 
            className="grid gap-0" 
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
              const x = index % BOARD_SIZE
              const y = Math.floor(index / BOARD_SIZE)
              const isSnakeHead = snake[0].x === x && snake[0].y === y
              const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
              const isFood = food.x === x && food.y === y

              let cellClass = 'w-5 h-5'
              if (isSnakeHead) {
                cellClass += ' bg-green-400'
              } else if (isSnakeBody) {
                cellClass += ' bg-green-600'
              } else if (isFood) {
                cellClass += ' bg-red-500'
              } else {
                cellClass += ' bg-gray-700'
              }

              return (
                <div 
                  key={index} 
                  className={cellClass}
                />
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div />
            <PixelButton onClick={() => handleDirectionButton('up')} color="bg-blue-400">
              ⬆️
            </PixelButton>
            <div />
            <PixelButton onClick={() => handleDirectionButton('left')} color="bg-blue-400">
              ⬅️
            </PixelButton>
            <PixelButton onClick={togglePause} color={isPaused ? 'bg-green-400' : 'bg-yellow-400'}>
              {isPaused ? '▶️' : '⏸️'}
            </PixelButton>
            <PixelButton onClick={() => handleDirectionButton('right')} color="bg-blue-400">
              ➡️
            </PixelButton>
            <div />
            <PixelButton onClick={() => handleDirectionButton('down')} color="bg-blue-400">
              ⬇️
            </PixelButton>
            <div />
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            也可以使用键盘方向键
          </p>
        </div>

        {(gameOver || gameWon) && (
          <div className="text-center mb-4">
            {gameWon && (
              <p className="text-green-600 font-bold text-xl mb-4">
                🎉 恭喜你赢了！
              </p>
            )}
            {gameOver && (
              <p className="text-red-600 font-bold text-xl mb-4">
                😢 游戏结束！
              </p>
            )}
            <PixelButton onClick={resetGame} color="bg-green-400">
              再玩一次
            </PixelButton>
          </div>
        )}

        <div className="text-center">
          <PixelButton onClick={onClose} color="bg-gray-400">
            结束游戏
          </PixelButton>
        </div>
      </div>
    </div>
  )
}

export default Snake
