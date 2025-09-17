'use client'

import { useRequestStore } from '@/app/store'
import { FaCopy, FaRedo } from 'react-icons/fa'
import { useState } from 'react'
import { copyTextToClipboard } from '@/app/lib/util'
import { useToast } from '@/app/components/commons/Toast'

export default function ResponsePanel() {
	const toast = useToast()
	const { request, setResponse } = useRequestStore()
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (request.response?.data) {
			await copyTextToClipboard(request.response.data)
			setCopied(true)
			setTimeout(() => setCopied(false), 1000)
			toast.success('复制成功')
		}
	}

	const handleRetry = () => {
		setResponse(null)
	}

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
	}

	return (
		<div className="bg-white flex flex-col rounded-xl shadow-md p-6 border border-gray-200 h-full">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-gray-800 flex items-center">
					<svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					响应结果
				</h2>
				<div className="flex space-x-2">
					<button
						onClick={handleRetry}
						className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center"
					>
						<FaRedo className="mr-1" size={12} /> 重置
					</button>
					<button
						onClick={handleCopy}
						className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 flex items-center"
					>
						<FaCopy className="mr-1" size={12} /> {copied ? '已复制!' : '复制'}
					</button>
				</div>
			</div>

			{request.response ? (
				<div className="flex flex-col">
					<div className="mb-4">
						<div className="flex items-center">
							<span
								className={`px-3 py-1 rounded-lg text-sm ${
									request.response.status && request.response.status >= 200 && request.response.status < 300
										? 'bg-green-100 text-green-800'
										: request.response.status && request.response.status >= 400 && request.response.status < 500
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'
								}`}
							>
								{request.response.status} {request.response.status === 200 ? 'OK' : ''}
							</span>
							<span className="ml-2 text-sm text-gray-600">耗时: {request.response.time}ms</span>
							<span className="ml-2 text-sm text-gray-600">
								大小: {formatSize(new Blob([request.response.data]).size)}
							</span>
						</div>
					</div>

					<div className="border max-h-[450px] border-gray-200 rounded-lg overflow-auto flex-grow">
						<pre className="p-4 bg-gray-50 text-sm font-mono">{request.response.data}</pre>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
					<div className="text-center">
						<div className="text-gray-400 mb-4">
							<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								></path>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-500 mb-2">等待请求</h3>
						<p className="text-gray-400 max-w-md">
							发送请求后，响应结果将显示在这里。您可以配置请求URL、方法和参数，然后点击"发送请求"按钮。
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
