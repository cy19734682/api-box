/**
 * 封装处理响应的公共方法
 * @param response
 * @param onMessages
 */
export const handleResponse = async (response: any, onMessages: (arg0: any) => void) => {
	if (!response.ok) {
		const errorData = await response.json()
		// 直接返回错误信息，避免本地抛出异常
		throw new Error(errorData.error?.message || `请求失败: ${response.status}`)
	}
	// 处理流式响应
	const reader = response.body.getReader()
	const decoder = new TextDecoder('utf-8')
	while (true) {
		const { value, done } = await reader.read()
		if (done) break
		const chunk = decoder.decode(value, { stream: true })
		const lines = chunk.split('\n\n').filter((line) => line.trim() !== '')
		for (const line of lines) {
			if (line) {
				try {
					const data = JSON.parse(line)
					// 更新内容
					if (data) {
						onMessages(data)
					}
				} catch (err: any) {
					throw new Error(`解析错误: ${err.message}`)
				}
			}
		}
	}
}

/**
 * UUID生成
 * @returns {string}
 * @constructor
 */
export function UUID(): string {
	let d = new Date().getTime()
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
}

/**
 * 格式化搜索查询
 */
export function formatSearchQuery(result: any) {
	// extract json from response
	const regex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g
	const match = result.content.match(regex)
	if (match?.length > 0) {
		const data = JSON.parse(match[0])
		if (data?.action === 'search') {
			return { query: data.query }
		}
	}
	return { query: '' }
}

/**
 * 将MCP结果格式化为AI工具调参数
 */
export function formatMcpSchemaTool(mcpTools: any[]) {
	return mcpTools.map((tool) => ({
		type: 'function',
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.input_schema
		}
	}))
}