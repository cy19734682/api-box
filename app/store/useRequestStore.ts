import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Header {
	key: string
	value: string
}

export interface Response {
	status: number | null
	data: string
	headers: Record<string, string>
	time: number | null
}

export interface RequestState {
	method: string
	url: string
	headers: Header[]
	body: string
	response: Response | null
}

export interface HistoryItem {
	id: string
	method: string
	url: string
	status: number
	timestamp: string
	duration: number
}

interface UseRequestStore {
	request: RequestState
	history: HistoryItem[]
	setMethod: (method: string) => void
	setUrl: (url: string) => void
	addHeader: () => void
	updateHeader: (index: number, key: string, value: string) => void
	removeHeader: (index: number) => void
	setBody: (body: string) => void
	setResponse: (response: Response | null) => void
	addHistoryItem: (item: HistoryItem) => void
	clearHistory: () => void
}

const initialState: RequestState = {
	method: 'GET',
	url: '',
	headers: [{ key: 'Content-Type', value: 'application/json' }],
	body: '',
	response: null
}

export const useRequestStore = create<UseRequestStore>()(
	persist(
		(set, get) => ({
			request: initialState,
			history: [],
			setMethod: (method) =>
				set((state) => ({
					request: { ...state.request, method }
				})),

			setUrl: (url) =>
				set((state) => ({
					request: { ...state.request, url }
				})),

			addHeader: () =>
				set((state) => ({
					request: {
						...state.request,
						headers: [...state.request.headers, { key: '', value: '' }]
					}
				})),

			updateHeader: (index, key, value) =>
				set((state) => {
					const updatedHeaders = [...state.request.headers]
					updatedHeaders[index] = { key, value }
					return {
						request: {
							...state.request,
							headers: updatedHeaders
						}
					}
				}),

			removeHeader: (index) =>
				set((state) => ({
					request: {
						...state.request,
						headers: state.request.headers.filter((_, i) => i !== index)
					}
				})),

			setBody: (body) =>
				set((state) => ({
					request: { ...state.request, body }
				})),

			setResponse: (response) =>
				set((state) => ({
					request: { ...state.request, response }
				})),

			addHistoryItem: (item) =>
				set((state) => {
					// 保留最近100条记录
					const newHistory = [item, ...state.history].slice(0, 100)
					return { history: newHistory }
				}),
			clearHistory: () => set({ history: [] })
		}),
		{
			name: 'api-tester-storage',
			partialize: (state) => ({
				history: state.history
			})
		}
	)
)
