import React from 'react'

interface PixelButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  color?: string
  className?: string
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  onClick, 
  children, 
  disabled = false, 
  color = 'bg-yellow-400', 
  className = '' 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`pixel-btn px-4 py-2 font-bold text-gray-900 border-b-4 border-r-4 
      ${color} 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 cursor-pointer'}
      active:border-b-0 active:border-r-0 active:mt-1 active:ml-1 ${className}`}
    style={{
      borderBottomColor: 'rgba(0,0,0,0.3)',
      borderRightColor: 'rgba(0,0,0,0.3)',
    }}
  >
    {children}
  </button>
)
