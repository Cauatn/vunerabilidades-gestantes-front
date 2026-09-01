import { isAxiosError } from 'axios'

import type { ApiErrorBody } from '@/features/core/types/api'

export function apiErrorMessage(error: unknown, fallback: string): string {
	if (!isAxiosError<ApiErrorBody>(error)) return error instanceof Error ? error.message : fallback
	const message = error.response?.data?.message
	return Array.isArray(message) ? message.join(' ') : message || fallback
}
