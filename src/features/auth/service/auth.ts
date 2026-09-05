import { api } from '@/features/core/service/apiService'
import type { SignInPayload } from '@/features/auth/types/auth'

export const signIn = (payload: SignInPayload) => api.post('/auth/login', payload)

export const acceptInvitation = (payload: {
	token: string
	name: string
	password: string
	professionalRegistration?: string
}) => api.post('/invitations/accept', payload)
