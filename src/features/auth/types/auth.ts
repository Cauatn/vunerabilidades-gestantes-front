import type { SessionUser } from '@/features/core/service/tokenService'

export interface SignInPayload {
	email: string
	password: string
}

export interface SignInResponse {
	accessToken: string
	user: SessionUser
}
