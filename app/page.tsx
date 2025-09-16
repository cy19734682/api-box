'use client'

import { useState } from 'react'
import { AppProviders } from '@/app/components/commons/AppProviders'
import RequestPanel from '@/app/components/RequestPanel'
import ResponsePanel from '@/app/components/ResponsePanel'
import HistoryPanel from '@/app/components/HistoryPanel'
import MockPanel from '@/app/components/MockPanel'
import TabNavigation from '@/app/components/TabNavigation'

export default function Home() {
	const [activeTab, setActiveTab] = useState<'test' | 'mock' | 'history'>('test')

	return (
		<AppProviders>
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
				<header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-6 shadow-lg">
					<div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
						<div className="flex items-center mb-4 md:mb-0">
							<div className="bg-white rounded-lg p-1 mr-3">
								<svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<h1 className="text-2xl font-bold">API Tester Pro</h1>
								<p className="text-indigo-200 text-sm">好用的接口测试工具</p>
							</div>
						</div>
					</div>
				</header>
				<main className="container flex-1 mx-auto py-8 px-4">
					<div className="bg-white rounded-xl shadow-lg overflow-hidden">
						<TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
						<div className="p-4 md:p-6">
							{activeTab === 'test' && (
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<RequestPanel />
									<ResponsePanel />
								</div>
							)}

							{activeTab === 'mock' && <MockPanel />}

							{activeTab === 'history' && <HistoryPanel />}
						</div>
					</div>
				</main>

				<footer className="bg-gray-800 text-white py-4">
					<div className="container mx-auto px-4">
						<div className="flex flex-col md:flex-row justify-between items-center">
							<div className="mb-4 md:mb-0">
								<h3 className="text-lg font-semibold mb-2">API Tester Pro</h3>
								<p className="text-gray-400 max-w-md">
									为前端开发者打造的接口测试工具，支持接口测试、Mock数据生成和历史记录功能。
								</p>
							</div>
							<div className="flex flex-col items-center md:items-end">
								<p className="text-gray-400">© {new Date().getFullYear()} API Tester Pro</p>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</AppProviders>
	)
}
