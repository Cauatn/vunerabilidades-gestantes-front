export interface Paginated<T> {
	items: T[]
	total: number
	page: number
	pageSize: number
}

export interface ApiErrorBody {
	statusCode: number
	code?: string
	message: string | string[]
	error?: string
	requestId?: string
}
