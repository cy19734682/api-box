import { NextRequest, NextResponse } from 'next/server'
import { faker } from '@faker-js/faker/locale/zh_CN'
import { jsonDb } from '@/app/lib/jsonDb'
import { MOCK_API_URL } from '@/app/lib/constant'

const handler = async function (req: NextRequest) {
	try {
		const path = req.nextUrl.pathname.split(MOCK_API_URL).pop()
		let mockData = null
		if (path) {
			const mock: any = jsonDb.getOneByPath(path)
			if (mock) {
				if (mock.dataType === 'Array') {
					mockData = Array.from({ length: Number(mock.size) }, () => JSON.parse(faker.helpers.fake(mock.response)))
				} else {
					mockData = JSON.parse(faker.helpers.fake(mock.response))
				}
			}
		}
		// 返回模拟数据
		return NextResponse.json({
			code: 0,
			data: mockData
		})
	} catch (error) {
		console.error('Mock错误:', error)
		return NextResponse.json({ error: '服务器错误', details: (error as Error).message }, { status: 500 })
	}
}

// 导出所有 method 的 handler
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const OPTIONS = handler
export const HEAD = handler
