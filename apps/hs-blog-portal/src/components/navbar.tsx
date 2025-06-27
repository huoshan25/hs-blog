'use client'

import { usePathname, useRouter } from 'next/navigation'
import { IoLanguage, IoLogoGithub, IoMoon, IoSunny, IoMenu } from 'react-icons/io5'
import { useTheme } from '@/hooks/useTheme'
import { useAvatarStore } from '@/store/avatar'
import Avatar from '@/components/Avatar'
import { useState } from 'react'
import { useLanguage } from '@/app/context/LanguageContext'
import { useNavigationTranslation } from '@/hooks/useTranslation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const { isHome, setIsHome } = useAvatarStore()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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
            <div className="w-[40px] h-[40px] md:block hidden" />
            <div className="flex items-center">
              <Avatar />
            </div>
            <div id="navbar" />
            
            {/* 桌面端导航 */}
            <div className="sm:flex hidden items-center gap-[30px]">
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
                className="rounded-lg p-2.5 text-text hover:bg-hover focus:outline-none"
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

              <button
                className="flex items-center text-text hover:bg-hover p-2.5"
                onClick={() => window.open('https://github.com/huoshan25', '_blank')}
              >
                <IoLogoGithub />
              </button>
            </div>
            
            {/* 移动端工具栏 */}
            <div className="sm:hidden flex items-center space-x-1">
            <button 
                className="sm:hidden mr-2 text-text hover:bg-hover p-2" 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <IoMenu size={24} />
              </button>
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-text hover:bg-hover focus:outline-none"
              >
                {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center text-text hover:bg-hover p-2"
                >
                  <IoLanguage size={18} />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 py-2 w-24 rounded-md shadow-lg z-50">
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

              <button
                className="flex items-center text-text hover:bg-hover p-2"
                onClick={() => window.open('https://github.com/huoshan25', '_blank')}
              >
                <IoLogoGithub size={18} />
              </button>
            </div>
          </div>
          
          {/* 移动端菜单 */}
          {showMobileMenu && (
            <div className="sm:hidden fixed right-9 top-[60px] bg-base shadow-md rounded-md py-3 w-[100px] z-50">
              <button
                onClick={() => {
                  handleNavigation('/')
                  setShowMobileMenu(false)
                }}
                className={`${
                  pathname === '/' ? 'text-primary' : 'text-text'
                } block w-full text-left px-4 py-2 hover:bg-hover`}
              >
                {home}
              </button>
              <button
                onClick={() => {
                  handleNavigation('/daily')
                  setShowMobileMenu(false)
                }}
                className={`${
                  pathname === '/daily' ? 'text-primary' : 'text-text'
                } block w-full text-left px-4 py-2 hover:bg-hover`}
              >
                {daily}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
