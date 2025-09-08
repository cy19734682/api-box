import fs from 'fs'
import path from 'path'

const DB_PATH = path.resolve('./app/data/db.json')
export type Todo = { id: string; name: string; path: string; method: string; response: string; createdAt: string }

function readDB(): Todo[] {
	if (!fs.existsSync(DB_PATH)) {
		fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
		fs.writeFileSync(DB_PATH, '[]')
	}
	return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDB(data: Todo[]) {
	fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export const jsonDb = {
	getAll: (): Todo[] => readDB(),
	getOneById: (id: string): Todo | null => {
		return readDB().find((t) => t.id === id) || null
	},
	getOneByPath: (path: string): Todo | null => {
		return readDB().find((t) => t.path === path) || null
	},
	add: (todo: Todo): Todo => {
		const todos = readDB()
		const newTodo = { ...todo }
		todos.push(newTodo)
		writeDB(todos)
		return newTodo
	},
	update: (id: string, patch: Partial<Omit<Todo, 'id'>>): Todo | null => {
		const todos = readDB()
		const idx = todos.findIndex((t) => t.id === id)
		if (idx === -1) return null
		todos[idx] = { ...todos[idx], ...patch }
		writeDB(todos)
		return todos[idx]
	},
	remove: (id: string): boolean => {
		const todos = readDB()
		const filtered = todos.filter((t) => t.id !== id)
		if (filtered.length === todos.length) return false
		writeDB(filtered)
		return true
	}
}
