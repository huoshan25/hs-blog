'use client'

import { usePathname, useRouter } from 'next/navigation'
import { IoMoon, IoSunny, IoLanguage } from 'react-icons/io5'
import { useTheme } from '@/hooks/useTheme'
import { useAvatarStore } from '@/store/avatar'
import Avatar from '@/components/Avatar'
import { useState } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import {useNavigationTranslation} from "@/hooks/useTranslation";

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const { isHome, setIsHome } = useAvatarStore()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const { home, daily } = useNavigationTranslation()
  const handleNavigation = async (path: string) => {
    if (pathname === path) return

    if (document.startViewTransition) {
      const transition = document.startViewTransition(async () => {
        setIsHome(path === '/')
        router.push(path)
      })
    } else {
      setIsHome(path === '/')
      router.push(path)
    }
  }

  return (
    <header className="h-16">
      <nav className="w-full mt-5">
        <div className="mx-auto lg:px-[200px] lt-lg:px-[20px]">
          <div className="flex px-6 h-16 items-center justify-between">
            <div className="w-[40px] h-[40px]" />
            <Avatar />
            <div id="navbar" />
            <div className="flex items-center gap-[30px]">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`${
                    pathname === '/' ? 'text-primary' : 'text-text hover:text-gray-400'
                  } text-[22px]`}
                >
                  {home}
                </button>
                <button
                  onClick={() => handleNavigation('/daily')}
                  className={`${
                    pathname === '/daily' ? 'text-primary' : 'text-text hover:text-gray-400'
                  } text-[22px]`}
                >
                  {daily}
                </button>
              </div>

              <button
                onClick={toggleTheme}
                className="rounded-lg p-2.5 text-text hover:bg-hover focus:outline-none ml-[15px]"
              >
                {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center text-text hover:bg-hover p-2.5"
                >
                  <IoLanguage size={20} />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 py-2 w-24 rounded-md shadow-lg">
                    <button
                      className="text-text block w-full px-4 py-2 text-left hover:bg-hover bg-base"
                      onClick={() => {
                        setLocale('zh')
                        setShowLangMenu(false)
                      }}
                    >
                      简体中文
                    </button>
                    <button
                      className="text-text block w-full px-4 py-2 text-left hover:bg-hover bg-base"
                      onClick={() => {
                        setLocale('en')
                        setShowLangMenu(false)
                      }}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
