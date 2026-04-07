import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PixelButton } from '../ui/PixelButton'

interface MatchThreeProps {
  onClose: () => void
  onWin: () => void
  onLose: () => void
}

interface Gem {
  type: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

const BOARD_SIZE = 8
const GEM_TYPES = 6
const GEM_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
const GEM_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠']
const PARTICLE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899']

const createBoard = (): Gem[][] => {
  const board: Gem[][] = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row: Gem[] = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      const gem = { type: Math.floor(Math.random() * GEM_TYPES) }
      row.push(gem)
    }
    board.push(row)
  }
  return board
}

const checkMatches = (board: Gem[][]) => {
  const matches = new Set<string>()

  for (let i = 0; i < BOARD_SIZE; i++) {
    let currentType = board[i][0].type
    let count = 1
    for (let j = 1; j < BOARD_SIZE; j++) {
      if (board[i][j].type === currentType) {
        count++
      } else {
        if (count >= 3) {
          for (let k = j - count; k < j; k++) {
            matches.add(`${i},${k}`)
          }
        }
        currentType = board[i][j].type
        count = 1
      }
    }
    if (count >= 3) {
      for (let k = BOARD_SIZE - count; k < BOARD_SIZE; k++) {
        matches.add(`${i},${k}`)
      }
    }
  }

  for (let j = 0; j < BOARD_SIZE; j++) {
    let currentType = board[0][j].type
    let count = 1
    for (let i = 1; i < BOARD_SIZE; i++) {
      if (board[i][j].type === currentType) {
        count++
      } else {
        if (count >= 3) {
          for (let k = i - count; k < i; k++) {
            matches.add(`${k},${j}`)
          }
        }
        currentType = board[i][j].type
        count = 1
      }
    }
    if (count >= 3) {
      for (let k = BOARD_SIZE - count; k < BOARD_SIZE; k++) {
        matches.add(`${k},${j}`)
      }
    }
  }

  return matches
}

const dropGems = (board: Gem[][]) => {
  const newBoard = board.map(row => row.map(gem => ({ ...gem })))
  
  for (let j = 0; j < BOARD_SIZE; j++) {
    let writeIndex = BOARD_SIZE - 1
    for (let i = BOARD_SIZE - 1; i >= 0; i--) {
      if (newBoard[i][j].type !== -1) {
        newBoard[writeIndex][j] = { ...newBoard[i][j] }
        if (writeIndex !== i) {
          newBoard[i][j].type = -1
        }
        writeIndex--
      }
    }
    for (let i = writeIndex; i >= 0; i--) {
      newBoard[i][j] = { type: Math.floor(Math.random() * GEM_TYPES) }
    }
  }
  
  return newBoard
}

const MatchThree: React.FC<MatchThreeProps> = ({ onClose, onWin, onLose }) => {
  const [board, setBoard] = useState<Gem[][]>(createBoard())
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null)
  const [score, setScore] = useState(0)
  const [targetScore] = useState(1000)
  const [moves, setMoves] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [explodingCells, setExplodingCells] = useState<Set<string>>(new Set())
  const [particles, setParticles] = useState<Particle[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20
      const speed = 3 + Math.random() * 4
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 5
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            life: p.life - 0.025
          }))
          .filter(p => p.life > 0)
        
        updated.forEach(p => {
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.shadowBlur = 10
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })
        
        return updated
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles])

  const processMatches = useCallback((currentBoard: Gem[][]) => {
    const matches = checkMatches(currentBoard)
    
    if (matches.size > 0) {
      const boardWithHoles = currentBoard.map(row => row.map(gem => ({ ...gem })))
      matches.forEach(pos => {
        const [i, j] = pos.split(',').map(Number)
        boardWithHoles[i][j].type = -1
      })
      
      const cellSize = 32 + 4
      matches.forEach(pos => {
        const [i, j] = pos.split(',').map(Number)
        const x = j * cellSize + cellSize / 2
        const y = i * cellSize + cellSize / 2
        const gemType = currentBoard[i][j].type
        createParticles(x, y, PARTICLE_COLORS[gemType])
      })
      
      setExplodingCells(new Set(matches))
      setBoard([...boardWithHoles])
      setScore(prev => prev + matches.size * 10)
      
      setTimeout(() => {
        setExplodingCells(new Set())
        const droppedBoard = dropGems(boardWithHoles)
        setBoard(droppedBoard)
        
        setTimeout(() => {
          const newMatches = checkMatches(droppedBoard)
          if (newMatches.size > 0) {
            processMatches(droppedBoard)
          } else {
            setIsProcessing(false)
          }
        }, 300)
      }, 400)
    } else {
      setIsProcessing(false)
    }
  }, [createParticles])

  const handleGemClick = (i: number, j: number) => {
    if (isProcessing || gameOver || gameWon) return

    if (!selected) {
      setSelected({ i, j })
    } else {
      const isAdjacent = 
        (Math.abs(selected.i - i) === 1 && selected.j === j) ||
        (Math.abs(selected.j - j) === 1 && selected.i === i)

      if (isAdjacent) {
        swapAndProcess(selected.i, selected.j, i, j)
      } else {
        setSelected({ i, j })
      }
    }
  }

  const swapAndProcess = (i1: number, j1: number, i2: number, j2: number) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    const newBoard = board.map(row => row.map(gem => ({ ...gem })))
    const temp = { ...newBoard[i1][j1] }
    newBoard[i1][j1] = { ...newBoard[i2][j2] }
    newBoard[i2][j2] = temp

    const matches = checkMatches(newBoard)
    
    if (matches.size > 0) {
      setBoard(newBoard)
      setMoves(prev => prev - 1)
      
      setTimeout(() => {
        processMatches(newBoard)
      }, 300)
    } else {
      setIsProcessing(false)
    }
    setSelected(null)
  }

  useEffect(() => {
    if (!isProcessing && !gameOver && !gameWon) {
      const initialMatches = checkMatches(board)
      if (initialMatches.size > 0) {
        setIsProcessing(true)
        setTimeout(() => {
          processMatches(board)
        }, 500)
      }
    }
  }, [])

  useEffect(() => {
    if (score >= targetScore && !gameWon) {
      setGameWon(true)
      onWin()
    } else if (moves <= 0 && !gameOver && score < targetScore) {
      setGameOver(true)
      onLose()
    }
  }, [score, targetScore, moves, gameOver, gameWon, onWin, onLose])

  const resetGame = () => {
    const newBoard = createBoard()
    setBoard(newBoard)
    setSelected(null)
    setScore(0)
    setMoves(30)
    setGameOver(false)
    setGameWon(false)
    setIsProcessing(false)
    setExplodingCells(new Set())
    setParticles([])
    
    setTimeout(() => {
      const matches = checkMatches(newBoard)
      if (matches.size > 0) {
        setIsProcessing(true)
        processMatches(newBoard)
      }
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <style>{`
        @keyframes explode {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2.5) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-explode {
          animation: explode 0.4s ease-out forwards;
        }
      `}</style>
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          💎 消消乐 💎
        </h2>

        <div className="flex justify-between items-center mb-4 px-2">
          <div className="text-lg font-bold">
            分数: {score}/{targetScore}
          </div>
          <div className="text-lg font-bold">
            步数: {moves}
          </div>
        </div>

        <div className="bg-gray-800 border-4 border-gray-900 rounded-lg p-2 mb-4 relative">
          <canvas
            ref={canvasRef}
            width={(32 + 4) * BOARD_SIZE}
            height={(32 + 4) * BOARD_SIZE}
            className="absolute top-2 left-2 pointer-events-none"
          />
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
            {board.map((row, i) =>
              row.map((gem, j) => {
                const isSelected = selected?.i === i && selected?.j === j
                const isExploding = explodingCells.has(`${i},${j}`)
                const isEmpty = gem.type === -1
                return (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleGemClick(i, j)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-lg transition-all relative
                      ${isEmpty ? 'opacity-0' : GEM_COLORS[gem.type]}
                      ${isSelected ? 'ring-4 ring-yellow-400 scale-110 z-10' : ''}
                      ${isExploding ? 'animate-explode z-20' : ''}
                      ${isProcessing ? 'opacity-50' : 'hover:scale-105'}
                    `}
                    disabled={isProcessing || gameOver || gameWon}
                  >
                    {!isEmpty && GEM_EMOJIS[gem.type]}
                  </button>
                )
              })
            )}
          </div>
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
                😢 步数用完了！
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

export default MatchThree
