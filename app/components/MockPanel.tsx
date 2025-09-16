'use client'

import React, { useState, useRef, useEffect } from 'react'
import { faker } from '@faker-js/faker/locale/zh_CN'
import { FaPlus, FaMagic, FaEye, FaFileCode } from 'react-icons/fa'
import { useToast } from '@/app/components/commons/Toast'
import { useConfirm } from '@/app/components/commons/Confirm'
import { apiFetch } from '@/app/lib/api/fetch'
import { MOCK_API_URL } from '@/app/lib/constant'

const defaultMock = {
	name: '',
	path: '',
	method: 'GET',
	size: '1',
	dataType: 'Object',
	response:
		'{\n  "id": "{{string.uuid}}",\n  "name": "{{person.fullName}}",\n  "email": "{{internet.email}}",\n  "createdAt": "{{date.recent}}"\n}'
}

export default function MockPanel() {
	const toast = useToast()
	const { confirm } = useConfirm()
	const [mockList, setMockList] = useState<any[]>([])
	const [newMock, setNewMock] = useState(defaultMock)
	const [editingMockId, setEditingMockId] = useState<string | null>(null)
	const [isValidJson, setIsValidJson] = useState(true)
	const [preview, setPreview] = useState<string | null>(null)
	const pathRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		queryMock().then()
	}, [])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		let processedValue = value
		if (name === 'size') {
			const min = 1
			const max = 100
			const numValue = Number(processedValue)
			if (!isNaN(numValue)) {
				processedValue = Math.max(min, Math.min(max, numValue)).toString()
			}
		}
		setNewMock((prev) => ({ ...prev, [name]: processedValue }))
		if (name === 'response') {
			try {
				JSON.parse(value.replace(/{{.*?}}/g, 'placeholder'))
				setIsValidJson(true)
			} catch (e) {
				setIsValidJson(false)
			}
		}
	}

	/**
	 * 点击Mock接口编辑
	 * @param mock
	 */
	const handleEditMock = (mock: any) => {
		setEditingMockId(mock.id)
		setNewMock({
			name: mock.name,
			path: mock.path,
			method: mock.method,
			size: mock.size,
			dataType: mock.dataType,
			response: mock.response
		})
	}

	/**
	 * 点击Mock接口删除
	 */
	const handleDeleteMock = (id: string) => {
		confirm({
			title: '删除确认',
			content: '确定要删除这个Mock接口吗？',
			submitConfirm: async () => {
				await deleteMock(id)
				toast.success('删除成功')
			}
		})
	}
	

	/**
	 * 格式化JSON
	 */
	const handleFormat = () => {
		try {
			const formattedJson = JSON.stringify(JSON.parse(newMock.response), null, 2)
			setNewMock((prev) => ({ ...prev, response: formattedJson }))
			setIsValidJson(true)
		} catch (error) {
			setIsValidJson(false)
		}
	}

	/**
	 * 预览结果
	 */
	const handlePreview = () => {
		if (!isValidJson) {
			return toast.warning('响应格式不是有效的JSON')
		}
		try {
			if (newMock.dataType === 'Array') {
				const fakeData = Array.from({ length: Number(newMock.size) }, () =>
					JSON.parse(faker.helpers.fake(newMock.response))
				)
				setPreview(JSON.stringify(fakeData, null, 2))
			} else {
				const fakeData = faker.helpers.fake(newMock.response)
				setPreview(fakeData)
			}
		} catch (error) {
			setPreview(`错误: ${(error as Error).message}`)
		}
	}

	/**
	 * 创建或更新Mock接口
	 */
	const handleCreateMock = async () => {
		if (!newMock.path.trim()) {
			toast.warning('请填写API路径')
			pathRef.current?.focus()
			return
		}
		if (!isValidJson) {
			return toast.warning('响应格式不是有效的JSON')
		}
		const mock = await queryMock(newMock.path)
		if (editingMockId) {
			if (mock?.id !== editingMockId && mock?.path === newMock.path) {
				return toast.warning('接口已存在')
			}
			await updateMock()
		} else {
			if (mock?.path === newMock.path) {
				return toast.warning('接口已存在')
			}
			await addMock()
		}
	}

	/**
	 * 查询Mock接口
	 */
	async function queryMock(path: string = '') {
		let url = MOCK_API_URL
		if (path) {
			url += `?path=${path}`
		}
		let res = await apiFetch(url, 'GET')
		let data = await res.json()
		if (path) {
			return data
		}
		setMockList(data)
	}

	/**
	 * 添加Mock接口
	 */
	async function addMock() {
		const newEndpoint = {
			id: `mock_${Date.now()}`,
			name: newMock.name || `Mock ${mockList.length + 1}`,
			path: newMock.path,
			method: newMock.method,
			size: newMock.size,
			dataType: newMock.dataType,
			response: newMock.response,
			createdAt: new Date().toISOString()
		}
		await apiFetch(MOCK_API_URL, 'POST', { body: newEndpoint })
		setNewMock(defaultMock)
		setPreview(null)
		toast.success('创建成功')
		await queryMock()
	}

	/**
	 * 更新Mock接口
	 */
	async function updateMock() {
		const updatedMock = {
			id: editingMockId,
			name: newMock.name || `Mock ${mockList.length}`,
			path: newMock.path,
			method: newMock.method,
			size: newMock.size,
			dataType: newMock.dataType,
			response: newMock.response,
			createdAt: new Date().toISOString()
		}
		await apiFetch(MOCK_API_URL, 'PUT', { body: updatedMock })
		setNewMock(defaultMock)
		setPreview(null)
		toast.success('更新成功')
		await queryMock()
	}

	/**
	 * 删除Mock接口
	 */
	async function deleteMock(id: string) {
		const updatedMock = { id }
		await apiFetch(MOCK_API_URL, 'DELETE', { body: updatedMock })
		setNewMock(defaultMock)
		setPreview(null)
		toast.success('删除成功')
		await queryMock()
	}

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
			<h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
					></path>
				</svg>
				创建Mock接口
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">名称 (可选)</label>
						<input
							type="text"
							name="name"
							value={newMock.name}
							onChange={handleInputChange}
							placeholder="例如: 用户信息接口"
							className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<p className="mt-1 text-sm text-gray-500">为您的Mock接口起一个易于识别的名称</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">API路径 *</label>
						<div className="flex rounded-lg overflow-hidden shadow-sm">
							<span className="inline-flex items-center px-4 bg-gray-100 text-gray-500 border border-r-0 border-gray-300">
								{MOCK_API_URL}
							</span>
							<input
								ref={pathRef}
								type="text"
								name="path"
								value={newMock.path}
								onChange={handleInputChange}
								placeholder="/userInfo"
								className="flex-1 min-w-0 block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<p className="mt-1 text-sm text-gray-500">此路径将用于访问您的Mock数据</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">请求方法</label>
						<select
							name="method"
							value={newMock.method}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="GET">GET</option>
							<option value="POST">POST</option>
							<option value="PUT">PUT</option>
							<option value="DELETE">DELETE</option>
							<option value="PATCH">PATCH</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">数据类型</label>
						<select
							name="dataType"
							value={newMock.dataType}
							onChange={handleInputChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="Object">对象</option>
							<option value="Array">数组</option>
						</select>
					</div>
					{newMock.dataType === 'Array' && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
							<input
								type="number"
								name="size"
								value={newMock.size}
								onChange={handleInputChange}
								placeholder="例如: 10"
								min={1}
								max={100}
								className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					)}
					<div className="pt-2">
						<button
							onClick={handleCreateMock}
							className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center shadow-md"
						>
							<FaPlus className="mr-2" />
							{editingMockId ? '更新Mock接口' : '创建Mock接口'}
						</button>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium text-gray-700">响应结构 *</label>
						<div className="flex space-x-3">
							<button
								onClick={handleFormat}
								className="px-3 py-1 bg-sky-100 text-sky-700 rounded-lg text-sm hover:bg-sky-200 flex items-center"
							>
								<FaFileCode className="mr-1" /> 格式化
							</button>
							<button
								onClick={handlePreview}
								className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 flex items-center"
							>
								<FaEye className="mr-1" /> 预览结果
							</button>
						</div>
					</div>

					<textarea
						name="response"
						value={newMock.response}
						onChange={handleInputChange}
						placeholder="输入JSON响应结构"
						className={`w-full h-40 border ${
							isValidJson ? 'border-gray-300' : 'border-red-500'
						} rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
					/>

					{!isValidJson && <p className="text-red-500 text-sm mt-2">无效的JSON格式，请检查您的JSON语法</p>}

					<div className="mt-3 p-3 bg-gray-50 rounded-lg">
						<h4 className="font-medium text-gray-700 mb-2">使用说明</h4>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>
								• 数据使用@faker-js生成，格式为
								<code className="bg-gray-200 px-1.5 py-0.5 rounded">&#123;&#123;xxx.yyy&#125;&#125;</code>，
								其中xxx是类型，yyy是字段名，详情请参考
								<a
									className="text-indigo-600 underline"
									href="https://fakerjs.dev/guide/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Faker.js
								</a>
								文档
							</li>
							<li>• 支持嵌套对象和数组结构，确保JSON格式正确</li>
							<li>• 点击"示例数据"生成示例模板</li>
						</ul>
					</div>

					{preview && (
						<div className="mt-4">
							<h3 className="text-sm font-medium text-gray-700 mb-2">预览结果</h3>
							<pre className="max-h-60 overflow-auto bg-gray-50 p-4 border border-gray-200 rounded-lg text-sm font-mono">
								{preview}
							</pre>
						</div>
					)}
				</div>
			</div>

			{mockList.length > 0 && (
				<div className="mt-10">
					<h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
						<svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
							></path>
						</svg>
						我的Mock接口
					</h3>
					<div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										名称
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										方法
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										数据类型
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										数量
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										路径
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										创建时间
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{mockList.map((mock, index) => (
									<tr key={mock.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
										<td className="px-4 py-3 text-sm font-medium text-gray-900">{mock.name}</td>
										<td className="px-4 py-3">
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
										</td>
										<td className="px-4 py-3 text-sm text-gray-900">{mock.dataType === 'Array' ? '数组' : '对象'}</td>
										<td className="px-4 py-3 text-sm text-gray-900">{mock.size}</td>
										<td className="px-4 py-3 text-sm text-gray-900">
											<span className="font-mono">{mock.path}</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-500">{new Date(mock.createdAt).toLocaleString()}</td>
										<td className="px-4 py-3 text-sm">
											<button
												onClick={() => handleEditMock(mock)}
												className="text-indigo-600 hover:text-indigo-900 mr-4"
											>
												编辑
											</button>
											<button onClick={() => handleDeleteMock(mock.id)} className="text-red-600 hover:text-red-900">
												删除
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}
