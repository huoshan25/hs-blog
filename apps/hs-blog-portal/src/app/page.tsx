'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useHomePageTranslation } from '@/hooks/useTranslation'


export default function Home() {
  const lang = useHomePageTranslation()
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
              <span className="mr-[5px]">{lang.hello}</span>
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
            {lang.introduce[0]}
          </div>
          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.6s'}}
          >
            {lang.introduce[1]}
          </div>
          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '0.8s'}}
          >
            {lang.introduce[2]}
          </div>

          <div
            className="text-text min-h-[1.5em] mb-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '1s'}}
          >
            {lang.introduce[3]}
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
            <div className="text-text min-h-[1.9em]">{lang.introduce[4]}</div>
          </div>

          <div
            className="flex text-text gap-[10px] opacity-0 animate-fade-in-up"
            style={{animationDelay: '1.6s'}}
          >
            <div>
              {lang.guideLanguage[0]}
              <Link
                className="text-blue-500 cursor-pointer relative group inline-block mx-1"
                href="https://hs-blog.top"
                target="_blank"
              >
                {lang.guideLanguage[1]}
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
              {lang.guideLanguage[2]}
            </div>
            <div className="flex items-center gap-2">
              <Image
                className="h-[15px] w-auto"
                src="img/logo.svg"
                height={15}
                width={15}
                alt="blog_logo"
              />
              <span className="font-[600]">|</span>
              <Link
                className="cursor-pointer relative group inline-block mx-1"
                href="https://github.com/huoshan25"
                target="_blank"
              >
                Github
                <Image
                  src="/svg/wavyLine.svg"
                  width={50}
                  height={5}
                  alt="wavyLine"
                  className="absolute bottom-[-21px] left-0 w-full group-hover:animate-wave-flow"
                />
              </Link>
              <Image
                className="h-[15px] w-auto"
                src="svg/github.svg"
                height={15}
                width={15}
                alt="blog_logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
