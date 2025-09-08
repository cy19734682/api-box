import { NextRequest, NextResponse } from 'next/server'
import { jsonDb } from '@/app/lib/jsonDb'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	const path = searchParams.get('path')
	if (id) {
		const todo = jsonDb.getOneById(id) || {}
		return NextResponse.json(todo)
	} else if (path) {
		const todo = jsonDb.getOneByPath(path) || {}
		return NextResponse.json(todo)
	}
	return NextResponse.json(jsonDb.getAll())
}

export async function POST(req: NextRequest) {
	const body = await req.json()
	const todo = jsonDb.add(body)
	return NextResponse.json(todo)
}

export async function PUT(req: NextRequest) {
	const body = await req.json()
	const todo = jsonDb.update(body.id, body)
	return NextResponse.json(todo)
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	if (id) {
		jsonDb.remove(id)
	}
	return NextResponse.json(null)
}
