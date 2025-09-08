import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'API 测试工具',
  description: 'API 测试工具',
  keywords: ['API', '测试', '工具'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`m-0 p-0 h-full ${inter.className}`}>
        <div className="h-full bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
