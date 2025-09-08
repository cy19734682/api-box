'use client'

import { useState } from 'react'
import { useRequestStore } from '@/app/store'
import { FaSearch, FaTrash } from 'react-icons/fa'

export default function HistoryPanel() {
	const { history, clearHistory } = useRequestStore()
	const [search, setSearch] = useState('')

	const filteredHistory = history.filter((item) => {
		return (
			search === '' ||
			item.url.toLowerCase().includes(search.toLowerCase()) ||
			item.method.toLowerCase().includes(search.toLowerCase())
		)
	})

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp)
		return date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 md:mb-0">
					<svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					接口请求历史
				</h2>

				<div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
					<div className="relative">
						<input
							type="text"
							placeholder="搜索URL或方法..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
						/>
						<div className="absolute left-3 top-3 text-gray-400">
							<FaSearch />
						</div>
					</div>
				</div>
			</div>

			{filteredHistory.length === 0 ? (
				<div className="text-center py-12">
					<svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						></path>
					</svg>
					<h3 className="mt-4 text-lg font-medium text-gray-500">暂无历史记录</h3>
					<p className="mt-1 text-gray-400">发送请求后，历史记录将显示在这里</p>
				</div>
			) : (
				<>
					<div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										方法
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										URL
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										状态
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										耗时
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										时间
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredHistory.map((item, index) => (
									<tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
										<td className="px-4 py-3">
											<div className="flex items-center">
												<span
													className={`px-2 py-1 rounded text-xs ${
														item.method === 'GET'
															? 'bg-blue-100 text-blue-800'
															: item.method === 'POST'
																? 'bg-green-100 text-green-800'
																: item.method === 'PUT'
																	? 'bg-yellow-100 text-yellow-800'
																	: item.method === 'DELETE'
																		? 'bg-red-100 text-red-800'
																		: 'bg-gray-100 text-gray-800'
													}`}
												>
													{item.method}
												</span>
											</div>
										</td>
										<td className="px-4 py-3 text-sm">
											<span className="text-gray-600 truncate max-w-xs inline-block" title={item.url}>
												{item.url}
											</span>
										</td>
										<td className="px-4 py-3">
											<span
												className={`px-2 py-1 rounded text-xs ${
													item.status >= 200 && item.status < 300
														? 'bg-green-100 text-green-800'
														: item.status >= 400 && item.status < 500
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-red-100 text-red-800'
												}`}
											>
												{item.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">{item.duration}ms</td>
										<td className="px-4 py-3 text-sm text-gray-500">{formatTime(item.timestamp)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-4 flex justify-between items-center">
						<div className="text-sm text-gray-500">
							显示 {filteredHistory.length} 条记录 (共 {history.length} 条)
						</div>
						<button
							onClick={clearHistory}
							className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
						>
							<FaTrash className="mr-1" /> 清空历史记录
						</button>
					</div>
				</>
			)}
		</div>
	)
}
