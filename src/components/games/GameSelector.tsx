import React from 'react'
import { PixelButton } from '../ui/PixelButton'

interface GameSelectorProps {
  onSelect: (game: 'rock-paper-scissors' | 'whack-a-mole' | 'match-three' | 'snake') => void
  onClose: () => void
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 border-8 border-gray-800 rounded-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎮 选择小游戏 🎮</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <PixelButton 
            onClick={() => onSelect('rock-paper-scissors')}
            color="bg-blue-400"
            className="text-lg py-3"
          >
            ✊ 石头剪刀布
          </PixelButton>
          
          <PixelButton 
            onClick={() => onSelect('whack-a-mole')}
            color="bg-green-400"
            className="text-lg py-3"
          >
            🐭 打地鼠
          </PixelButton>
          
          <PixelButton 
            onClick={() => onSelect('match-three')}
            color="bg-purple-400"
            className="text-lg py-3"
          >
            💎 消消乐
          </PixelButton>
          
          <PixelButton 
            onClick={() => onSelect('snake')}
            color="bg-orange-400"
            className="text-lg py-3"
          >
            🐍 贪吃蛇
          </PixelButton>
        </div>
        
        <PixelButton onClick={onClose} color="bg-gray-400">
          取消
        </PixelButton>
      </div>
    </div>
  )
}

export default GameSelector
