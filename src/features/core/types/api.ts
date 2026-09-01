export interface ApiErrorBody {
	statusCode: number
	code?: string
	message: string | string[]
	error?: string
	requestId?: string
}
