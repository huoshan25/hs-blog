'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useHomepageTranslation } from '@/hooks/useTranslation'

export default function Home() {
  const t = useHomepageTranslation()
  return (
    <>
      <div className="flex gap-[10px] lg:p-[50px_200px] lt-lg:p-[50px_40px]">
        <div className="flex flex-col">
          <div className="h-[100px]"/>
          <div
            id="content-start"
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.2s'}}
          >
            <div className="flex items-center">
              <span className="mr-[5px]">{t.hello}</span>
              <Image
                className="mb-[5px] w-[25px] h-[25px]"
                src="/gif/Hi.gif"
                width={0}
                height={0}
                alt="hi"
              />
            </div>
          </div>
          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.4s'}}
          >
            {t.introduce[0]}
          </div>
          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.6s'}}
          >
            {t.introduce[1]}
          </div>
          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.8s'}}
          >
            {t.introduce[2]}
          </div>

          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '1s'}}
          >
            {t.introduce[3]}
          </div>
          {/*技术栈*/}
          <div
            className="flex flex-wrap gap-[10px] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '1.2s'}}
          >
            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/nest.svg" height={20} width={20} alt="nest"/>
                <span>Nest.js</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#E0234E] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/py.svg" height={20} width={20} alt="python"/>
                <span>Python</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#3C78AA] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/js.svg" height={20} width={20} alt="python"/>
                <span>Javascript</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#F5DD1E] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/ts.svg" height={20} width={20} alt="python"/>
                <span>Typescript</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#007ACC] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/vue.svg" height={20} width={20} alt="python"/>
                <span>Vue.js</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#41B883] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/nuxt.svg" height={20} width={20} alt="python"/>
                <span>Nuxt.js</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#00DC82] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/react.svg" height={20} width={20} alt="python"/>
                <span>React.js</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#3ECDFE] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>

            <div className="group flex-center gap-[5px] p-[5px] hover:backdrop-blur-sm transition-all duration-300">
              <div className="flex-center gap-[5px] text-text">
                <Image src="/svg/next.svg" height={20} width={20} alt="python"/>
                <span>Next.js</span>
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-[2px] blur-[1.5px] bg-[#000000] group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-[10px] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '1.4s'}}
          >
            <div className="text-text min-h-[1.9em]">{t.introduce[4]}</div>
          </div>

          <div
            className="opacity-0 animate-fade-in-up"
            style={{animationDelay: '1.6s'}}
          >
            <div className="flex flex-wrap items-center text-text gap-x-[10px]">
              <div className="flex items-center flex-wrap">
                {t.guideLanguage[0]}
                <Link
                  className="text-blue-500 cursor-pointer relative group inline-block mx-1"
                  href="https://hs-blog.top"
                  target="_blank"
                >
                  {t.guideLanguage[1]}
                  <Image
                    src="/svg/wavyLine.svg"
                    width={40}
                    height={6}
                    alt="wavyLine"
                    className="absolute bottom-[-15.5px] left-0 w-full group-hover:animate-wave-flow"
                  />
                  <div
                    className="absolute opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 -bottom-[160px] left-1/2 -translate-x-1/2 w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg p-2 transition-all duration-200 ease-in-out">
                    <Image
                      src="/img/blog.png"
                      alt="blogHomepage"
                      width={300}
                      height={200}
                      quality={100}
                      className="w-full h-auto rounded"
                    />
                  </div>
                </Link>
                <span className="whitespace-nowrap">{t.guideLanguage[2]}</span>
              </div>
              <div className="flex items-center ml-1">
                <Image
                  className="h-[15px] w-auto"
                  src="img/logo.svg"
                  height={15}
                  width={15}
                  alt="blog_logo"
                />
              </div>
            </div>
          </div>

          {/* GitHub Heatmap Links */}
          <div
            className="opacity-0 animate-fade-in-up mt-4 space-y-3"
            style={{animationDelay: '1.8s'}}
          >
            <Link
              href="/github-heatmap"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-xl group-hover:animate-bounce">📊</span>
              <span className="font-medium">View GitHub Contributions</span>
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </Link>

            <div className="ml-4">
              <Link
                href="/test-tooltip"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                <span className="text-sm group-hover:animate-pulse">✨</span>
                <span className="font-medium">Test Enhanced Tooltips</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
