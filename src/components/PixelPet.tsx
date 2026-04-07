import React, { useEffect, useRef, useState } from 'react'
import { PetMood, PetStage, PetType, PetAction, PET_SPECIES } from '../store/usePetStore'

interface PixelPetProps {
  species: PetType
  mood: PetMood
  stage: PetStage
  action: PetAction
  isDead: boolean
  food: 'apple' | 'noodle' | 'pudding' | 'cola' | null
  foodProgress: number
}

const PixelPet: React.FC<PixelPetProps> = ({ species, mood, stage, action, isDead, food, foodProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frame, setFrame] = useState(0)

  const speciesData = PET_SPECIES.find((s) => s.id === species)!

  const getSize = () => {
    switch (stage) {
      case 'baby':
        return 32
      case 'teen':
        return 40
      case 'adult':
        return 48
    }
  }

  const size = getSize()
  const scale = 6

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    canvas.width = width
    canvas.height = height
    ctx.imageSmoothingEnabled = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(x * scale, y * scale, scale, scale)
    }

    const drawRoom = () => {
      const roomWidth = Math.floor(width / scale)
      const roomHeight = Math.floor(height / scale)
      
      for (let x = 0; x < roomWidth; x++) {
        for (let y = 0; y < roomHeight; y++) {
          if (y === 0 || y === roomHeight - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (x === 0 || x === roomWidth - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (y === roomHeight - 2) {
            drawPixel(x, y, '#A0522D')
          } else if (y < roomHeight - 10) {
            drawPixel(x, y, '#F0E68C')
          } else {
            drawPixel(x, y, '#F5DEB3')
          }
        }
      }

      const carpetWidth = Math.max(roomWidth - 16, 24)
      const carpetHeight = Math.max(roomHeight - 16, 18)
      const carpetX = Math.floor((roomWidth - carpetWidth) / 2)
      const carpetY = roomHeight - carpetHeight - 3
      
      for (let x = carpetX; x < carpetX + carpetWidth; x++) {
        for (let y = carpetY; y < carpetY + carpetHeight; y++) {
          drawPixel(x, y, '#CD853F')
        }
      }

      for (let x = carpetX + 2; x < carpetX + carpetWidth - 2; x++) {
        for (let y = carpetY + 2; y < carpetY + carpetHeight - 2; y++) {
          drawPixel(x, y, '#D2B48C')
        }
      }

      for (let x = carpetX + 4; x < carpetX + carpetWidth - 4; x++) {
        for (let y = carpetY + 4; y < carpetY + carpetHeight - 4; y++) {
          if ((x + y) % 4 === 0) {
            drawPixel(x, y, '#CD853F')
          }
        }
      }

      const bedWidth = Math.min(roomWidth - 12, 18)
      const bedHeight = Math.min(roomHeight - 12, 10)
      const bedX = roomWidth - bedWidth - 6
      const bedY = roomHeight - bedHeight - 5
      
      for (let x = bedX; x < bedX + bedWidth; x++) {
        for (let y = bedY; y < bedY + bedHeight; y++) {
          if (y === bedY) {
            drawPixel(x, y, '#8B4513')
          } else if (y === bedY + 1) {
            drawPixel(x, y, '#A0522D')
          } else {
            drawPixel(x, y, '#FFDAB9')
          }
        }
      }

      for (let x = bedX + 3; x < bedX + bedWidth - 3; x++) {
        for (let y = bedY + 4; y < bedY + bedHeight - 3; y++) {
          drawPixel(x, y, '#FFE4B5')
        }
      }

      for (let x = bedX + 2; x < bedX + 6; x++) {
        for (let y = bedY + 2; y < bedY + 5; y++) {
          drawPixel(x, y, '#FF69B4')
        }
      }

      for (let x = bedX + bedWidth - 6; x < bedX + bedWidth - 2; x++) {
        for (let y = bedY + 2; y < bedY + 5; y++) {
          drawPixel(x, y, '#87CEEB')
        }
      }

      const nightstandWidth = Math.min(roomWidth - bedX - bedWidth - 2, 8)
      const nightstandHeight = Math.min(roomHeight - 6, 6)
      const nightstandX = roomWidth - nightstandWidth - 3
      const nightstandY = roomHeight - nightstandHeight - 2
      
      for (let x = nightstandX; x < nightstandX + nightstandWidth; x++) {
        for (let y = nightstandY; y < nightstandY + nightstandHeight; y++) {
          if (y === nightstandY) {
            drawPixel(x, y, '#8B4513')
          } else {
            drawPixel(x, y, '#DEB887')
          }
        }
      }

      if (nightstandWidth > 5) {
        drawPixel(nightstandX + 2, nightstandY - 2, '#FFFF00')
        drawPixel(nightstandX + 3, nightstandY - 2, '#FFFF00')
        drawPixel(nightstandX + 4, nightstandY - 2, '#FFFF00')
        drawPixel(nightstandX + 3, nightstandY - 3, '#FFFF00')
      }

      const windowWidth = Math.min(roomWidth - 10, 14)
      const windowHeight = Math.min(roomHeight - 10, 12)
      const windowX = Math.floor((roomWidth - windowWidth) / 2)
      const windowY = 6
      
      for (let x = windowX; x < windowX + windowWidth; x++) {
        for (let y = windowY; y < windowY + windowHeight; y++) {
          const time = Date.now() / 1000
          const wave = Math.sin(time + x * 0.1) * 30
          const blue = Math.floor(135 + wave)
          drawPixel(x, y, `rgb(135, ${blue}, 235)`)
        }
      }

      for (let x = windowX - 2; x < windowX + windowWidth + 2; x++) {
        if (x >= 0 && x < roomWidth) {
          drawPixel(x, windowY - 2, '#8B4513')
          drawPixel(x, windowY - 1, '#A0522D')
          if (windowY + windowHeight < roomHeight) {
            drawPixel(x, windowY + windowHeight, '#A0522D')
            drawPixel(x, windowY + windowHeight + 1, '#8B4513')
          }
        }
      }
      
      for (let y = windowY - 2; y < windowY + windowHeight + 2; y++) {
        if (y >= 0 && y < roomHeight) {
          drawPixel(windowX - 2, y, '#8B4513')
          drawPixel(windowX - 1, y, '#A0522D')
          if (windowX + windowWidth < roomWidth) {
            drawPixel(windowX + windowWidth, y, '#A0522D')
            drawPixel(windowX + windowWidth + 1, y, '#8B4513')
          }
        }
      }

      if (windowWidth > 8 && windowHeight > 6) {
        for (let x = windowX + Math.floor(windowWidth / 2) - 1; x < windowX + Math.floor(windowWidth / 2) + 1; x++) {
          for (let y = windowY; y < windowY + windowHeight; y++) {
            drawPixel(x, y, '#8B4513')
          }
        }

        for (let y = windowY + Math.floor(windowHeight / 2) - 1; y < windowY + Math.floor(windowHeight / 2) + 1; y++) {
          for (let x = windowX; x < windowX + windowWidth; x++) {
            drawPixel(x, y, '#8B4513')
          }
        }
      }

      const bookshelfWidth = Math.min(roomWidth - 10, 12)
      const bookshelfHeight = Math.min(roomHeight - 10, 14)
      const bookshelfX = 6
      const bookshelfY = roomHeight - bookshelfHeight - 5
      
      for (let x = bookshelfX; x < bookshelfX + bookshelfWidth; x++) {
        for (let y = bookshelfY; y < bookshelfY + bookshelfHeight; y++) {
          if (x === bookshelfX || x === bookshelfX + bookshelfWidth - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (y === bookshelfY || y === bookshelfY + 4 || y === bookshelfY + 8 || y === bookshelfY + 12 || y === bookshelfY + bookshelfHeight - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (y === bookshelfY + 1 || y === bookshelfY + 2) {
            const bookColors = ['#4B0082', '#8B0000', '#006400', '#1E90FF', '#FF4500', '#FFD700']
            drawPixel(x, y, bookColors[(x + y) % bookColors.length])
          } else if (y === bookshelfY + 5 || y === bookshelfY + 6) {
            const bookColors = ['#9370DB', '#DC143C', '#228B22', '#4169E1', '#FF6347', '#FFA500']
            drawPixel(x, y, bookColors[(x + y) % bookColors.length])
          } else if (y === bookshelfY + 9 || y === bookshelfY + 10) {
            const bookColors = ['#8A2BE2', '#B22222', '#32CD32', '#191970', '#FF7F50', '#FFD700']
            drawPixel(x, y, bookColors[(x + y) % bookColors.length])
          } else if (y === bookshelfY + 13 || y === bookshelfY + 14) {
            const bookColors = ['#9400D3', '#8B0000', '#00FF00', '#0000CD', '#FF8C00', '#FFFF00']
            drawPixel(x, y, bookColors[(x + y) % bookColors.length])
          }
        }
      }

      if (bookshelfWidth > 8) {
        drawPixel(bookshelfX + 2, bookshelfY - 2, '#32CD32')
        drawPixel(bookshelfX + 3, bookshelfY - 2, '#32CD32')
        drawPixel(bookshelfX + 4, bookshelfY - 2, '#32CD32')
        drawPixel(bookshelfX + 3, bookshelfY - 3, '#32CD32')
      }

      const deskWidth = Math.min(roomWidth - bookshelfX - bookshelfWidth - 6, 14)
      const deskHeight = Math.min(roomHeight - 8, 4)
      const deskX = bookshelfX + bookshelfWidth + 3
      const deskY = roomHeight - deskHeight - 8
      
      for (let x = deskX; x < deskX + deskWidth; x++) {
        for (let y = deskY; y < deskY + deskHeight; y++) {
          if (y === deskY + deskHeight - 1) {
            drawPixel(x, y, '#8B4513')
          } else {
            drawPixel(x, y, '#DEB887')
          }
        }
      }

      if (deskWidth > 8) {
        drawPixel(deskX + 3, deskY - 1, '#87CEEB')
        drawPixel(deskX + 4, deskY - 1, '#87CEEB')
        drawPixel(deskX + 5, deskY - 1, '#87CEEB')
        drawPixel(deskX + 6, deskY - 1, '#87CEEB')
        drawPixel(deskX + 4, deskY - 2, '#87CEEB')
        drawPixel(deskX + 5, deskY - 2, '#87CEEB')
      }

      const chairWidth = Math.min(roomWidth - deskX - deskWidth - 2, 8)
      const chairHeight = Math.min(roomHeight - 6, 6)
      const chairX = deskX + deskWidth + 2
      const chairY = roomHeight - chairHeight - 7
      
      for (let x = chairX; x < chairX + chairWidth; x++) {
        for (let y = chairY; y < chairY + chairHeight; y++) {
          if (y === chairY + chairHeight - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (x === chairX || x === chairX + chairWidth - 1) {
            drawPixel(x, y, '#8B4513')
          } else if (y === chairY) {
            drawPixel(x, y, '#A0522D')
          } else {
            drawPixel(x, y, '#D2B48C')
          }
        }
      }

      if (roomWidth > 30 && roomHeight > 20) {
        const pictureWidth = 6
        const pictureHeight = 4
        const pictureX = Math.floor((roomWidth - pictureWidth) / 2)
        const pictureY = 3
        
        for (let x = pictureX; x < pictureX + pictureWidth; x++) {
          for (let y = pictureY; y < pictureY + pictureHeight; y++) {
            if (x === pictureX || x === pictureX + pictureWidth - 1 || y === pictureY || y === pictureY + pictureHeight - 1) {
              drawPixel(x, y, '#8B4513')
            } else {
              drawPixel(x, y, '#FF69B4')
            }
          }
        }
      }
    }

    const drawPet = () => {
      const petWidth = 32
      const petHeight = 32
      const offsetX = Math.floor((width / scale - petWidth) / 2) + 5
      const offsetY = Math.floor((height / scale - petHeight) / 2) + 2
      const bounce = action === 'playing' ? (frame % 2 === 0 ? -2 : 2) : 0
      const eatOffset = action === 'eating' ? (frame % 2 === 0 ? 1 : -1) : 0

      const colors = {
        body: isDead ? '#666666' : speciesData.colors.primary,
        bodyDark: isDead ? '#444444' : speciesData.colors.accent,
        bodyLight: isDead ? '#888888' : speciesData.colors.secondary,
        cheek: isDead ? '#555555' : '#FF6B6B',
        eyeWhite: isDead ? '#999999' : '#FFFFFF',
        eyeBlack: '#222222',
        mouth: '#222222',
      }

      const bodyPixels = [
        [7, 8], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 8],
        [7, 9], [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 9],
        [6, 10], [7, 10], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 10], [14, 10],
        [6, 11], [7, 11], [8, 10], [9, 10], [10, 10], [11, 10], [12, 10], [13, 11], [14, 11],
        [6, 12], [7, 12], [8, 11], [9, 11], [10, 11], [11, 11], [12, 11], [13, 12], [14, 12],
        [6, 13], [7, 13], [8, 12], [9, 12], [10, 12], [11, 12], [12, 12], [13, 13], [14, 13],
        [7, 14], [8, 13], [9, 13], [10, 13], [11, 13], [12, 13], [13, 14],
        [8, 14], [9, 14], [10, 14], [11, 14], [12, 14],
      ]

      bodyPixels.forEach(([x, y]) => {
        drawPixel(x + offsetX, y + offsetY + bounce, colors.body)
      })

      const darkPixels = [
        [14, 10], [14, 11], [14, 12], [14, 13],
        [13, 14], [12, 14],
      ]
      darkPixels.forEach(([x, y]) => {
        drawPixel(x + offsetX, y + offsetY + bounce, colors.bodyDark)
      })

      const lightPixels = [
        [6, 10], [6, 11], [6, 12], [6, 13],
        [7, 8], [7, 9],
      ]
      lightPixels.forEach(([x, y]) => {
        drawPixel(x + offsetX, y + offsetY + bounce, colors.bodyLight)
      })

      drawPixel(7 + offsetX, 11 + offsetY + bounce, colors.cheek)
      drawPixel(13 + offsetX, 11 + offsetY + bounce, colors.cheek)

      if (isDead) {
        drawPixel(8 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)
        drawPixel(9 + offsetX, 10 + offsetY + bounce, colors.eyeWhite)
        drawPixel(12 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)
        drawPixel(11 + offsetX, 10 + offsetY + bounce, colors.eyeWhite)
      } else if (mood === 'sleeping' || action === 'sleeping') {
        drawPixel(8 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
        drawPixel(12 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
      } else {
        drawPixel(8 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)
        drawPixel(9 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)
        drawPixel(12 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)
        drawPixel(11 + offsetX, 9 + offsetY + bounce, colors.eyeWhite)

        if (mood === 'sad') {
          drawPixel(8 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
          drawPixel(11 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
        } else {
          drawPixel(9 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
          drawPixel(12 + offsetX, 10 + offsetY + bounce, colors.eyeBlack)
        }
      }

      if (!isDead && mood !== 'sleeping' && action !== 'sleeping') {
        if (mood === 'happy' || action === 'playing') {
          drawPixel(10 + offsetX, 12 + offsetY + bounce, colors.mouth)
          drawPixel(9 + offsetX, 13 + offsetY + bounce + eatOffset, colors.mouth)
          drawPixel(11 + offsetX, 13 + offsetY + bounce + eatOffset, colors.mouth)
        } else if (mood === 'sad') {
          drawPixel(9 + offsetX, 13 + offsetY + bounce, colors.mouth)
          drawPixel(10 + offsetX, 12 + offsetY + bounce, colors.mouth)
          drawPixel(11 + offsetX, 13 + offsetY + bounce, colors.mouth)
        } else if (action === 'eating') {
          drawPixel(10 + offsetX, 12 + offsetY + bounce, colors.mouth)
          drawPixel(10 + offsetX, 13 + offsetY + bounce, colors.mouth)
        } else {
          drawPixel(10 + offsetX, 12 + offsetY + bounce, colors.mouth)
        }
      }

      if ((mood === 'sleeping' || action === 'sleeping') && !isDead) {
        const zOffset = frame * 2
        drawPixel(7 + offsetX - zOffset, 7 + offsetY + bounce - zOffset, '#FFFFFF')
        drawPixel(13 + offsetX + zOffset, 6 + offsetY + bounce - zOffset, '#FFFFFF')
      }

      if (species === 'fire' && !isDead && action !== 'sleeping') {
        const fireOffset = frame % 2 === 0 ? 0 : -1
        drawPixel(10 + offsetX, 6 + offsetY + bounce + fireOffset, '#FF4500')
        drawPixel(9 + offsetX, 5 + offsetY + bounce + fireOffset, '#FF6B35')
        drawPixel(11 + offsetX, 5 + offsetY + bounce + fireOffset, '#FF6B35')
        drawPixel(10 + offsetX, 4 + offsetY + bounce + fireOffset, '#FFD700')
      }

      if (species === 'water' && !isDead && action !== 'sleeping') {
        const waveOffset = frame % 2 === 0 ? 0 : 1
        drawPixel(6 + offsetX - waveOffset, 10 + offsetY + bounce, '#00BFFF')
        drawPixel(14 + offsetX + waveOffset, 10 + offsetY + bounce, '#00BFFF')
      }

      if (species === 'grass' && !isDead && action !== 'sleeping') {
        const leafOffset = frame % 2 === 0 ? 0 : 1
        drawPixel(8 + offsetX, 5 + offsetY + bounce - leafOffset, '#32CD32')
        drawPixel(12 + offsetX, 5 + offsetY + bounce - leafOffset, '#32CD32')
        drawPixel(10 + offsetX, 4 + offsetY + bounce, '#228B22')
      }

      if (species === 'electric' && !isDead && mood === 'happy') {
        if (frame % 2 === 0) {
          drawPixel(5 + offsetX, 11 + offsetY + bounce, '#FFD700')
          drawPixel(15 + offsetX, 11 + offsetY + bounce, '#FFD700')
        }
      }

      if (stage === 'teen' && !isDead) {
        drawPixel(5 + offsetX, 14 + offsetY + bounce, colors.body)
        drawPixel(15 + offsetX, 14 + offsetY + bounce, colors.body)
      }

      if (stage === 'adult' && !isDead) {
        drawPixel(4 + offsetX, 13 + offsetY + bounce, colors.bodyDark)
        drawPixel(4 + offsetX, 14 + offsetY + bounce, colors.bodyDark)
        drawPixel(16 + offsetX, 13 + offsetY + bounce, colors.bodyDark)
        drawPixel(16 + offsetX, 14 + offsetY + bounce, colors.bodyDark)
        drawPixel(5 + offsetX, 15 + offsetY + bounce, colors.body)
        drawPixel(15 + offsetX, 15 + offsetY + bounce, colors.body)
      }

      const drawFood = () => {
        if (!food || foodProgress >= 100) return
        
        const foodX = 20 + offsetX
        const foodY = 12 + offsetY + bounce
        const progress = foodProgress / 100
        
        const foodPixels = {
          apple: [
            [0, 0], [1, 0], [2, 0], [3, 0],
            [0, 1], [1, 1], [2, 1], [3, 1],
            [1, 2], [2, 2],
          ],
          noodle: [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
          ],
          pudding: [
            [0, 0], [1, 0], [2, 0], [3, 0],
            [0, 1], [1, 1], [2, 1], [3, 1],
            [0, 2], [1, 2], [2, 2], [3, 2],
          ],
          cola: [
            [0, 0], [1, 0], [2, 0],
            [0, 1], [1, 1], [2, 1],
            [0, 2], [1, 2], [2, 2],
            [0, 3], [1, 3], [2, 3],
          ],
        }
        
        const foodColors = {
          apple: '#FF4500',
          noodle: '#FFFF00',
          pudding: '#FFD700',
          cola: '#8B4513',
        }
        
        const pixels = foodPixels[food]
        const color = foodColors[food]
        
        pixels.forEach(([x, y]) => {
          const pixelX = Math.floor(foodX - progress * 15 + x)
          if (pixelX > offsetX + 15) {
            drawPixel(pixelX, foodY + y, color)
          }
        })
      }

      drawFood()

      const drawShower = () => {
        if (action !== 'cleaning') return
        
        const showerX = 10 + offsetX
        const showerY = 2 + offsetY
        
        drawPixel(showerX, showerY, '#00BFFF')
        drawPixel(showerX - 1, showerY, '#00BFFF')
        drawPixel(showerX + 1, showerY, '#00BFFF')
        
        for (let i = 0; i < 12; i++) {
          const dropX = showerX + (Math.sin(i + frame) * 2)
          const dropY = showerY + 2 + i
          if (frame % 2 === 0) {
            drawPixel(Math.floor(dropX), Math.floor(dropY), '#00BFFF')
            drawPixel(Math.floor(dropX - 1), Math.floor(dropY + 1), '#00BFFF')
            drawPixel(Math.floor(dropX + 1), Math.floor(dropY + 1), '#00BFFF')
          }
        }
      }

      drawShower()
    }

    drawRoom()
    drawPet()
  }, [species, mood, stage, action, isDead, frame, size, speciesData, food, foodProgress])

  return <canvas ref={canvasRef} className="w-full h-full object-cover" />
}

export default PixelPet
