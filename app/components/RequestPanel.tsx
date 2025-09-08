'use client'

import { useEffect, useRef, useState } from 'react'
import { useRequestStore } from '@/app/store'
import { FaMagic, FaPlay, FaPlus, FaTrash } from 'react-icons/fa'
import { useToast } from '@/app/components/commons/Toast'
import { apiFetch } from '@/app/lib/api/fetch'
import { MOCK_API_URL } from '@/app/lib/constant'

export default function RequestPanel() {
	const toast = useToast()
	const { addHistoryItem } = useRequestStore()
	const { request, setMethod, setUrl, addHeader, updateHeader, removeHeader, setBody, setResponse } = useRequestStore()

	const [mockList, setMockList] = useState<any[]>([])
	const [isSending, setIsSending] = useState(false)
	const [showMockSelector, setShowMockSelector] = useState(false)
	const urlRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		queryMock().then()
	}, [])

	/**
	 * 查询Mock接口
	 */
	async function queryMock() {
		let res = await apiFetch(MOCK_API_URL, 'GET')
		let data = await res.json()
		setMockList(data)
	}

	const handleSendRequest = async () => {
		if (!request.url.trim()) {
			toast.warning('请输入URL')
			urlRef.current?.focus()
			return
		}
		setIsSending(true)
		const startTime = Date.now()
		const headers = request?.headers?.reduce((acc: any, header) => {
			acc[header.key] = header.value
			return acc
		}, {})
		try {
			const response: any = await apiFetch('/api/proxy', 'POST', {
				body: {
					url: request.url,
					method: request.method,
					headers,
					body: request.body ? JSON.parse(request.body) : null
				}
			})

			const data = await response.json()
			const endTime = Date.now()

			setResponse({
				status: response.status,
				data: JSON.stringify(data, null, 2),
				headers: response.headers,
				time: endTime - startTime
			})

			addHistoryItem({
				id: Date.now().toString(),
				method: request.method,
				url: request.url,
				status: response.status,
				timestamp: new Date().toISOString(),
				duration: endTime - startTime
			})
		} catch (error) {
			setResponse({
				status: 500,
				data: JSON.stringify({ error: '请求失败', details: error }, null, 2),
				headers: {},
				time: Date.now() - startTime
			})
		} finally {
			setIsSending(false)
		}
	}

	const handleUseMock = (mock: any) => {
		setMethod(mock.method)
		setUrl(`${window.location.origin}${MOCK_API_URL}${mock.path}`)
		setShowMockSelector(false)
	}

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
			<div className="flex items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800 flex items-center">
					<svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						></path>
					</svg>
					请求配置
				</h2>
				<button
					onClick={() => setShowMockSelector(!showMockSelector)}
					className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 flex items-center"
				>
					<FaMagic className="mr-1" /> 使用Mock
				</button>
			</div>

			{showMockSelector && (
				<div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
					<h3 className="font-medium text-indigo-800 mb-2">选择Mock接口</h3>
					<div className="max-h-40 overflow-y-auto">
						{mockList.length === 0 ? (
							<p className="text-indigo-500 text-sm">暂无Mock接口，请先创建</p>
						) : (
							mockList.map((mock) => (
								<div
									key={mock.id}
									className="p-2 mb-1 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
									onClick={() => handleUseMock(mock)}
								>
									<div className="flex items-center">
										<span
											className={`px-2 py-1 rounded text-xs ${
												mock.method === 'GET'
													? 'bg-blue-100 text-blue-800'
													: mock.method === 'POST'
														? 'bg-green-100 text-green-800'
														: mock.method === 'PUT'
															? 'bg-yellow-100 text-yellow-800'
															: mock.method === 'DELETE'
																? 'bg-red-100 text-red-800'
																: 'bg-gray-100 text-gray-800'
											}`}
										>
											{mock.method}
										</span>
										<span className="ml-2 truncate">{mock.name || mock.path}</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}

			<div className="flex mb-4 rounded-lg overflow-hidden shadow-sm">
				<select
					value={request.method}
					onChange={(e) => setMethod(e.target.value)}
					className="w-24 bg-gray-100 border-r border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					<option value="GET">GET</option>
					<option value="POST">POST</option>
					<option value="PUT">PUT</option>
					<option value="DELETE">DELETE</option>
					<option value="PATCH">PATCH</option>
				</select>
				<input
					ref={urlRef}
					type="text"
					value={request.url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="输入请求URL (例如: https://api.example.com/data)"
					className="flex-1 border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				/>
				<button
					onClick={handleSendRequest}
					disabled={isSending}
					className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70 flex items-center transition-all"
				>
					{isSending ? (
						<>
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							发送中...
						</>
					) : (
						<>
							<FaPlay className="mr-2" /> 发送请求
						</>
					)}
				</button>
			</div>

			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-gray-700 font-medium">请求头</h3>
					<button onClick={addHeader} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
						<FaPlus className="mr-1" size={10} /> 添加请求头
					</button>
				</div>
				<div className="space-y-2">
					{request.headers.map((header, index) => (
						<div key={index} className="flex space-x-2">
							<input
								type="text"
								placeholder="Key"
								value={header.key}
								onChange={(e) => updateHeader(index, e.target.value, header.value)}
								className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<input
								type="text"
								placeholder="Value"
								value={header.value}
								onChange={(e) => updateHeader(index, header.key, e.target.value)}
								className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
							/>
							<button onClick={() => removeHeader(index)} className="text-red-500 hover:text-red-700 p-2">
								<FaTrash size={16} />
							</button>
						</div>
					))}
				</div>
			</div>

			<div>
				<h3 className="text-gray-700 font-medium mb-2">请求体</h3>
				<textarea
					value={request.body}
					onChange={(e) => setBody(e.target.value)}
					placeholder={`输入请求体 (JSON格式)\n例如: {\n  "name": "John",\n  "email": "john@example.com"\n}`}
					className="w-full h-40 border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
				/>
			</div>
		</div>
	)
}
