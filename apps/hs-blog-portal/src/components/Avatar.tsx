'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
  let inThrottle: boolean
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export default function Avatar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 })
  const [navOffset, setNavOffset] = useState({ x: 40, y: 20 })

  useEffect(() => {
    const updatePosition = () => {
      /*更新首页内容位置*/
      if (isHome) {
        const contentElement = document.getElementById('content-start')
        if (contentElement) {
          const rect = contentElement.getBoundingClientRect()
          const scrollY = window.scrollY
          setContentOffset({
            x: rect.left,
            y: rect.top + scrollY - 120,
          })
        }
      }

      /*更新导航栏位置*/
      const navElement = document.getElementById('navbar')
      if (navElement) {
        const rect = navElement.getBoundingClientRect()
        const scrollY = window.scrollY
        setNavOffset({
          x: 40, // 固定的 x 偏移
          y: rect.top + scrollY + rect.height / 2 - 50, // 调整垂直居中
        })
      }
    }

    const throttledUpdatePosition = throttle(updatePosition, 16)

    updatePosition()
    window.addEventListener('resize', throttledUpdatePosition)
    window.addEventListener('scroll', throttledUpdatePosition)

    return () => {
      window.removeEventListener('resize', throttledUpdatePosition)
      window.removeEventListener('scroll', throttledUpdatePosition)
    }
  }, [isHome])

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        x: isHome ? contentOffset.x : navOffset.x,
        y: isHome ? contentOffset.y : navOffset.y,
        scale: isHome ? 1 : 0.4,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="absolute top-0 left-0"
    >
      <Image
        src="/img/avatar.jpg"
        height={100}
        width={100}
        alt="avatar"
        priority={true}
        className="rounded-full"
      />
    </motion.div>
  )
}
