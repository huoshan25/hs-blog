'use client'

import { useEffect, useState } from 'react'

interface TypeWriterProps {
  texts: string[]
  typingSpeed?: number
}

/**
 * 逐行打字效果
 * @param texts 文本数组
 * @param typingSpeed 打字速度(ms)
 * @constructor TypeWriter
 */
export default function TypeWriter({ texts, typingSpeed = 100 }: TypeWriterProps) {
  const [displayTexts, setDisplayTexts] = useState(Array(texts.length).fill(''))
  const [currentLine, setCurrentLine] = useState(0)
  const [currentPos, setCurrentPos] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentLine >= texts.length) {
      setIsTyping(false)
      return
    }

    //将字符串拆分为字符数组(包括emoji)
    const chars = Array.from(texts[currentLine])

    const timer = setTimeout(() => {
      if (currentPos < chars.length) {
        setDisplayTexts((prev) => {
          const newTexts = [...prev]
          //处理emoji
          newTexts[currentLine] = Array.from(texts[currentLine])
            .slice(0, currentPos + 1)
            .join('')
          return newTexts
        })
        setCurrentPos((prev) => prev + 1)
      } else {
        setCurrentPos(0)
        setCurrentLine((prev) => prev + 1)
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [currentLine, currentPos, texts, typingSpeed])

  return (
    <>
      {displayTexts.map((text, index) => (
        <div key={index} className="text-text relative h-[1.5em] text-lg">
          {text}
          {isTyping && currentLine === index && (
            <span className="animate-blink absolute ml-1">|</span>
          )}
        </div>
      ))}
    </>
  )
}
