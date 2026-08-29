export type PaginationParams = {
	page: number
	pageSize: number
}

export type Paginated<T> = {
	items: T[]
	total: number
	page: number
	pageSize: number
}
