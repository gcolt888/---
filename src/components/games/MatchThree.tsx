import React, { useState, useEffect, useCallback } from 'react'
import { PixelButton } from '../ui/PixelButton'

interface MatchThreeProps {
  onClose: () => void
  onWin: () => void
  onLose: () => void
}

const BOARD_SIZE = 8
const GEM_TYPES = 6
const GEM_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
const GEM_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠']

const createBoard = () => {
  const board: number[][] = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row: number[] = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      let gem
      do {
        gem = Math.floor(Math.random() * GEM_TYPES)
      } while (
        (j >= 2 && row[j - 1] === gem && row[j - 2] === gem) ||
        (i >= 2 && board[i - 1]?.[j] === gem && board[i - 2]?.[j] === gem)
      )
      row.push(gem)
    }
    board.push(row)
  }
  return board
}

const checkMatches = (board: number[][]) => {
  const matches = new Set<string>()

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 2; j++) {
      if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
        matches.add(`${i},${j}`)
        matches.add(`${i},${j + 1}`)
        matches.add(`${i},${j + 2}`)
        let k = j + 3
        while (k < BOARD_SIZE && board[i][k] === board[i][j]) {
          matches.add(`${i},${k}`)
          k++
        }
      }
    }
  }

  for (let i = 0; i < BOARD_SIZE - 2; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
        matches.add(`${i},${j}`)
        matches.add(`${i + 1},${j}`)
        matches.add(`${i + 2},${j}`)
        let k = i + 3
        while (k < BOARD_SIZE && board[k][j] === board[i][j]) {
          matches.add(`${k},${j}`)
          k++
        }
      }
    }
  }

  return matches
}

const removeMatches = (board: number[][], matches: Set<string>) => {
  const newBoard = board.map(row => [...row])
  matches.forEach(pos => {
    const [i, j] = pos.split(',').map(Number)
    newBoard[i][j] = -1
  })
  return newBoard
}

const dropGems = (board: number[][]) => {
  const newBoard = board.map(row => [...row])
  for (let j = 0; j < BOARD_SIZE; j++) {
    let writeIndex = BOARD_SIZE - 1
    for (let i = BOARD_SIZE - 1; i >= 0; i--) {
      if (newBoard[i][j] !== -1) {
        newBoard[writeIndex][j] = newBoard[i][j]
        if (writeIndex !== i) {
          newBoard[i][j] = -1
        }
        writeIndex--
      }
    }
    for (let i = writeIndex; i >= 0; i--) {
      newBoard[i][j] = Math.floor(Math.random() * GEM_TYPES)
    }
  }
  return newBoard
}

const MatchThree: React.FC<MatchThreeProps> = ({ onClose, onWin, onLose }) => {
  const [board, setBoard] = useState<number[][]>(createBoard())
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null)
  const [score, setScore] = useState(0)
  const [targetScore] = useState(1000)
  const [moves, setMoves] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processMatches = useCallback((currentBoard: number[][]) => {
    let newBoard = currentBoard
    let matches = checkMatches(newBoard)
    let totalMatches = 0

    while (matches.size > 0) {
      totalMatches += matches.size
      newBoard = removeMatches(newBoard, matches)
      newBoard = dropGems(newBoard)
      matches = checkMatches(newBoard)
    }

    if (totalMatches > 0) {
      const points = totalMatches * 10
      setScore(prev => prev + points)
    }

    return newBoard
  }, [])

  const swapGems = useCallback((i1: number, j1: number, i2: number, j2: number) => {
    if (isProcessing) return
    
    setIsProcessing(true)
    const newBoard = board.map(row => [...row])
    const temp = newBoard[i1][j1]
    newBoard[i1][j1] = newBoard[i2][j2]
    newBoard[i2][j2] = temp

    const matches = checkMatches(newBoard)
    if (matches.size > 0) {
      setBoard(newBoard)
      setMoves(prev => prev - 1)
      setTimeout(() => {
        const processedBoard = processMatches(newBoard)
        setBoard(processedBoard)
        setIsProcessing(false)
      }, 300)
    } else {
      setIsProcessing(false)
    }
    setSelected(null)
  }, [board, isProcessing, processMatches])

  const handleGemClick = (i: number, j: number) => {
    if (isProcessing || gameOver || gameWon) return

    if (!selected) {
      setSelected({ i, j })
    } else {
      const isAdjacent = 
        (Math.abs(selected.i - i) === 1 && selected.j === j) ||
        (Math.abs(selected.j - j) === 1 && selected.i === i)

      if (isAdjacent) {
        swapGems(selected.i, selected.j, i, j)
      } else {
        setSelected({ i, j })
      }
    }
  }

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
    setBoard(createBoard())
    setSelected(null)
    setScore(0)
    setMoves(30)
    setGameOver(false)
    setGameWon(false)
    setIsProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
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

        <div className="bg-gray-800 border-4 border-gray-900 rounded-lg p-2 mb-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
            {board.map((row, i) =>
              row.map((gem, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleGemClick(i, j)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xl transition-all
                    ${GEM_COLORS[gem]}
                    ${selected?.i === i && selected?.j === j ? 'ring-4 ring-yellow-400 scale-110' : ''}
                    ${isProcessing ? 'opacity-50' : 'hover:scale-105'}
                  `}
                  disabled={isProcessing || gameOver || gameWon}
                >
                  {GEM_EMOJIS[gem]}
                </button>
              ))
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
