import React, { useState } from 'react'
import { PixelButton } from '../ui/PixelButton'

interface RockPaperScissorsProps {
  onClose: () => void
  onWin: () => void
  onLose: () => void
  onDraw: () => void
}

type Choice = 'rock' | 'paper' | 'scissors'

const choices: Choice[] = ['rock', 'paper', 'scissors']

const getChoiceEmoji = (choice: Choice): string => {
  switch (choice) {
    case 'rock': return '✊'
    case 'paper': return '✋'
    case 'scissors': return '✌️'
  }
}

const getWinner = (player: Choice, computer: Choice): 'player' | 'computer' | 'draw' => {
  if (player === computer) return 'draw'
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) return 'player'
  return 'computer'
}

const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({ 
  onClose, 
  onWin, 
  onLose, 
  onDraw 
}) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<'player' | 'computer' | 'draw' | null>(null)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const [showResult, setShowResult] = useState(false)

  const handleChoice = (choice: Choice) => {
    if (playerChoice) return
    
    setPlayerChoice(choice)
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]
    setComputerChoice(computerChoice)
    
    const winner = getWinner(choice, computerChoice)
    setResult(winner)
    setShowResult(true)
    
    if (winner === 'player') {
      onWin()
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
    } else if (winner === 'computer') {
      onLose()
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
    } else {
      onDraw()
    }
  }

  const resetRound = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setShowResult(false)
    setRound(prev => prev + 1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          ✊ 石头剪刀布 ✌️
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-2">回合: {round}</p>
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <p className="font-bold">你: {score.player}</p>
            </div>
            <div>
              <p className="font-bold">宠物: {score.computer}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {choices.map((choice) => (
            <PixelButton
              key={choice}
              onClick={() => handleChoice(choice)}
              disabled={!!playerChoice}
              color="bg-blue-400"
              className="text-2xl py-4"
            >
              {getChoiceEmoji(choice)}
            </PixelButton>
          ))}
        </div>

        {showResult && (
          <div className="text-center mb-6">
            <div className="flex justify-center gap-8 mb-4">
              <div>
                <p className="text-sm font-bold mb-1">你</p>
                <p className="text-4xl">{getChoiceEmoji(playerChoice!)}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">宠物</p>
                <p className="text-4xl">{getChoiceEmoji(computerChoice!)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              {result === 'player' && (
                <p className="text-green-600 font-bold text-lg">🎉 你赢了！</p>
              )}
              {result === 'computer' && (
                <p className="text-red-600 font-bold text-lg">😢 你输了！</p>
              )}
              {result === 'draw' && (
                <p className="text-yellow-600 font-bold text-lg">🤝 平局！</p>
              )}
            </div>
            
            <PixelButton 
              onClick={resetRound} 
              color="bg-green-400" 
              className="mt-4"
            >
              再来一局
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

export default RockPaperScissors
