import '@/styles/globals.css'
import Navbar from '@/components/navbar'
import {LanguageProvider} from "@/app/context/LanguageContext";

// 添加web-shared客户端组件
import WebSharedProvider from '@/components/WebSharedProvider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" key="icon" href="/logo.ico" />
        <title key="title">HuoShan</title>
        <meta
          name="description"
          key="description"
          content="你好，我是火山，一名前端开发工程师。 我喜欢用编程去实现一些有意思的事情， 为此，我会在技术上始终保持对前沿技术的追求，并始终在关注和探索新事物。"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="keywords" content="HuoShan, 火山博客, react, next, nest, nuxt, vue, python" />
        <meta name="author" content="HuoShan" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://chinese-fonts-cdn.deno.dev/packages/rzjryzzk/dist/nzgrRuYinZouZhangKai/result.css"
        />
      </head>
      <body>
        {/* 添加web-shared Provider包装 */}
        <WebSharedProvider>
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </WebSharedProvider>
      </body>
    </html>
  )
}
