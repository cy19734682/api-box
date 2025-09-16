// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		let { url, method, headers, body } = await req.json()

		if (!url) {
			return NextResponse.json({ error: '缺少URL参数' }, { status: 400 })
		}
		const config: Record<string, any> = {
			method,
			headers
		}
		if (body) {
			if (method === 'POST' || method === 'PUT') {
				config.body = JSON.stringify(body)
			}
			if (method === 'GET' || method === 'DELETE') {
				url += '?'
				Object.entries(body).forEach(([k, v]: [string, any]) => {
					url += `${k}=${v}&`
				})
			}
		}
		// 发送请求到目标API
		const response = await fetch(url, config)

		// 获取响应数据
		const responseBody = await response.json()

		// 返回响应给客户端
		return NextResponse.json(responseBody)
	} catch (error) {
		return NextResponse.json({ error: '服务器错误', details: (error as Error).message }, { status: 500 })
	}
}
