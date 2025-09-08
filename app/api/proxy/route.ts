// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { url, method, headers, body } = await req.json()

		if (!url) {
			return NextResponse.json({ error: '缺少URL参数' }, { status: 400 })
		}

		// 发送请求到目标API
		const response = await fetch(url, {
			method: method || 'GET',
			headers: headers || {},
			body: body ? JSON.stringify(body) : undefined
		})

		// 获取响应数据
		const responseBody = await response.json()

		// 返回响应给客户端
		return NextResponse.json(responseBody)
	} catch (error) {
		console.error('代理错误:', error)
		return NextResponse.json({ error: '服务器错误', details: (error as Error).message }, { status: 500 })
	}
}
